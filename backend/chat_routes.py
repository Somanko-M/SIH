# chat_routes.py
from fastapi import APIRouter, HTTPException, Header, Depends, Query
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
    """
    Simple header-based auth. Requires frontend to send X-User-Email in headers.
    """
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

    # Create new conversation if none provided
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

    # ✅ Correct sender detection
    if payload.recipient == "serene_bot":
        # message sent by user → sender is the user
        sender = user_email
    else:
        # if not sending TO the bot, assume it's from the bot itself
        sender = "serene_bot"

    # Add message document
    msg_ref = conv_ref.collection("messages").document()
    msg_ref.set({
        "sender": sender,
        "text": payload.text,
        "sentAt": firestore.SERVER_TIMESTAMP
    })

    return {"ok": True, "conversationId": conversation_id, "messageId": msg_ref.id}


# -------------------------
# Get messages for a conversation
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
        sent_iso = sent.isoformat() if hasattr(sent, "isoformat") else str(sent)
        messages.append({
            "sender": m.get("sender"),
            "text": m.get("text"),
            "sentAt": sent_iso
        })
    return list(reversed(messages))

# -------------------------
# List conversations
# -------------------------
@router.get("/conversations")
def list_conversations(current_user: str = Depends(get_current_user), limit: int = 50):
    query = (
        db.collection("conversations")
        .where("participants", "array_contains", current_user)
        .order_by("lastMessageAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )
    docs = query.stream()
    result = []
    for d in docs:
        data = d.to_dict()
        last_at = data.get("lastMessageAt")
        last_at_iso = last_at.isoformat() if hasattr(last_at, "isoformat") else str(last_at)
        result.append({
            "conversationId": d.id,
            "participants": data.get("participants"),
            "lastMessage": data.get("lastMessage"),
            "lastMessageAt": last_at_iso
        })
    return {"ok": True, "conversations": result}

# -------------------------
# Compatibility endpoints (/chat, /chat/history)
# -------------------------
@router.post("/chat")
def chat_compat(payload: SendMessage, current_user: str = Depends(get_current_user)):
    return send_message(payload, current_user)

@router.get("/chat/history")
def chat_history_compat(
    conversationId: Optional[str] = Query(None),
    limit: int = 50,
    current_user: str = Depends(get_current_user)
):
    if conversationId:
        msgs = get_messages(conversationId, limit, current_user)
        return {"ok": True, "messages": msgs}
    else:
        convs = list_conversations(current_user, limit)
        return convs
