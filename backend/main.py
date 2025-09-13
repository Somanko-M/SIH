from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
import hashlib

# -----------------------------------
# Firebase Setup
# -----------------------------------
cred = credentials.Certificate("serviceAccount.json")  # your Firebase service key
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()
from chat_routes import router as chat_router
app.include_router(chat_router)

# -----------------------------------
# Pydantic Models
# -----------------------------------
class RegisterUser(BaseModel):
    fullName: str
    username: str
    email: str
    phone: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

# -----------------------------------
# API Endpoints
# -----------------------------------

# 👉 Registration
@app.post("/register")
def register(user: RegisterUser):
    user_ref = db.collection("users").document(user.email)

    # Check if user already exists
    if user_ref.get().exists:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password before saving
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()

    # Save to Firestore
    user_ref.set({
        "fullName": user.fullName,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_pw
    })

    return {"ok": True, "message": "User registered successfully"}


# 👉 Login
@app.post("/login")
def login(user: LoginUser):
    user_ref = db.collection("users").document(user.email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash entered password and compare
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    if user_doc.to_dict()["password"] != hashed_pw:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"ok": True, "message": "Login successful", "user": user_doc.to_dict()}
