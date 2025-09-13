# chat_routes.py
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import List, Optional
from firebase_admin import firestore
from datetime import datetime

db = firestore.client()
router = APIRouter()

# -------------------------
# Models
# -------------------------
class SendMessage(BaseModel):
    conversationId: Optional[str] = None
    recipient: Optional[str] = None
    text: str

class MessageOut(BaseModel):
    sender: str
    text: str
    sentAt: str

# -------------------------
# Temporary "auth" (header based)
# -------------------------
def get_current_user(x_user_email: str = Header(None)):
    if not x_user_email:
        raise HTTPException(status_code=401, detail="Missing X-User-Email header")
    user_doc = db.collection("users").document(x_user_email).get()
    if not user_doc.exists:
        raise HTTPException(status_code=401, detail="User not found")
    return x_user_email

# -------------------------
# Send message / create conversation
# -------------------------
@router.post("/chat/send")
def send_message(payload: SendMessage, current_user: str = Depends(get_current_user)):
    user_email = current_user

    # create a new 1:1 conversation if no conversationId provided
    if not payload.conversationId:
        if not payload.recipient:
            raise HTTPException(status_code=400, detail="recipient required to create conversation")
        conv_ref = db.collection("conversations").document()
        conv_ref.set({
            "participants": [user_email, payload.recipient],
            "title": None,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "lastMessage": payload.text,
            "lastMessageAt": firestore.SERVER_TIMESTAMP,
            "isGroup": False
        })
        conversation_id = conv_ref.id
    else:
        conversation_id = payload.conversationId
        conv_ref = db.collection("conversations").document(conversation_id)
        if not conv_ref.get().exists:
            raise HTTPException(status_code=404, detail="Conversation not found")
        conv_ref.update({
            "lastMessage": payload.text,
            "lastMessageAt": firestore.SERVER_TIMESTAMP
        })

    # add message doc
    msg_ref = db.collection("conversations").document(conversation_id).collection("messages").document()
    msg_ref.set({
        "sender": user_email,
        "text": payload.text,
        "sentAt": firestore.SERVER_TIMESTAMP
    })

    return {"ok": True, "conversationId": conversation_id, "messageId": msg_ref.id}


# -------------------------
# Get messages for a conversation (latest N)
# -------------------------
@router.get("/chat/{conversation_id}/messages", response_model=List[MessageOut])
def get_messages(conversation_id: str, limit: int = 50, current_user: str = Depends(get_current_user)):
    conv_ref = db.collection("conversations").document(conversation_id)
    conv = conv_ref.get()
    if not conv.exists:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conv_data = conv.to_dict()
    if current_user not in conv_data.get("participants", []):
        raise HTTPException(status_code=403, detail="Not a participant")

    msgs_col = conv_ref.collection("messages")
    query = msgs_col.order_by("sentAt", direction=firestore.Query.DESCENDING).limit(limit)
    docs = query.stream()
    messages = []
    for d in docs:
        m = d.to_dict()
        sent = m.get("sentAt")
        # convert Firestore timestamp to ISO if possible
        try:
            sent_iso = sent.isoformat()
        except Exception:
            sent_iso = str(sent)
        messages.append({
            "sender": m.get("sender"),
            "text": m.get("text"),
            "sentAt": sent_iso
        })
    return list(reversed(messages))


# -------------------------
# List conversations for current user
# -------------------------
@router.get("/conversations")
def list_conversations(current_user: str = Depends(get_current_user), limit: int = 50):
    query = db.collection("conversations")\
              .where("participants", "array_contains", current_user)\
              .order_by("lastMessageAt", direction=firestore.Query.DESCENDING)\
              .limit(limit)
    docs = query.stream()
    result = []
    for d in docs:
        data = d.to_dict()
        last_at = data.get("lastMessageAt")
        try:
            last_at_iso = last_at.isoformat()
        except Exception:
            last_at_iso = str(last_at)
        result.append({
            "conversationId": d.id,
            "participants": data.get("participants"),
            "lastMessage": data.get("lastMessage"),
            "lastMessageAt": last_at_iso
        })
    return {"conversations": result}
