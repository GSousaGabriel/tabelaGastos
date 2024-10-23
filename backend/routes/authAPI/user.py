from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from backend.utils.get_database import get_database

router = APIRouter(
    prefix="/api/user"
)

class User(BaseModel):
    email: str | None = None
    password: str | None = None
    
@router.post("/login", response_model=User, tags=["user"])
async def get_user(user: User):
    try:
        user_encoded = jsonable_encoder(user)
        db = get_database()
        collection = db["users"]
        user = collection.find_one({"email": user_encoded["email"], "password": user_encoded["password"]})
    
        if user:
            return JSONResponse(content={"message": "Login authorized!", "status": 200}, status_code=status.HTTP_200_OK)
        
        return JSONResponse(content={"message": "User not found!", "status": 401}, status_code=status.HTTP_401_UNAUTHORIZED)
    except:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@router.post("/register", response_model=User, tags=["user"])
async def get_user(user: User):
    try:
        user_encoded = jsonable_encoder(user)
        db = get_database()
        collection = db["users"]
        user = collection.find_one({"email": user_encoded["email"]})
    
        if user:
            return JSONResponse(content={"message": "user already registered!", "status": 409}, status_code=status.HTTP_409_CONFLICT)
        
        collection.insert_one(user_encoded)
        return JSONResponse(content={"message": "User successfully registered!", "status": 201}, status_code=status.HTTP_201_CREATED)
    except:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)