from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import hashlib
import os
import secrets

load_dotenv()

# -----------------------------------
# Firebase Setup
# -----------------------------------
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS", "serviceAccount.json")
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

# Import chat routes
from chat_routes import router as chat_router
app.include_router(chat_router)

# -----------------------------------
# CORS Configuration
# -----------------------------------
# During development, allow your frontend ports (8080, 5173, 3000)
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # add deployed frontend domain(s) later, e.g. "https://myapp.example.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # ⚠️ Use ["*"] only for local quick tests
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],          # Allow Content-Type, Authorization, custom headers
)

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

    # ⚠️ For production use bcrypt or Argon2
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()

    # Save to Firestore
    user_ref.set({
        "fullName": user.fullName,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_pw,
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

    # Generate a simple token (replace with JWT in production)
    token = secrets.token_hex(16)

    return {
        "ok": True,
        "message": "Login successful",
        "user": user_doc.to_dict(),
        "access_token": token,   # frontend expects this
    }
