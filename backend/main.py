from fastapi import FastAPI
from backend.authAPI import login
from backend.utils.get_database import get_database
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your allowed origin(s)
    allow_credentials=True,
    allow_methods=["*"],  # Explicitly specify allowed methods
    allow_headers=["*"],  # Allow all headers
)
app.include_router(login.router)

@app.get("/items/{item_id}")
def read_item(item_id: str):
    db = get_database()
    collection = db["user_1_items"]
    item = collection.find({"_id": item_id})
    return {"item": item[0]}