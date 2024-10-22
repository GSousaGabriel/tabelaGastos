from fastapi import FastAPI

from backend.get_database import get_database
from test_insert import instert_via_api

app = FastAPI()

@app.get("/")
def read_root():
    result =instert_via_api()
    print(result)
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: str):
    db = get_database()
    collection = db["user_1_items"]
    item = collection.find({"_id": item_id})
    return {"item": item[0]}