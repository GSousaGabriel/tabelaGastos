from bson import ObjectId
from fastapi import APIRouter, Body, Request, status
from fastapi.responses import JSONResponse
from utils.get_database import get_database
from datetime import datetime

from typing import Dict, List, Any
router = APIRouter(
    prefix="/api/finances"
)

def convert_datetimes(data):
    """Recursively convert all datetime objects in the dictionary to ISO format."""
    if isinstance(data, list):
        return [convert_datetimes(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_datetimes(value) for key, value in data.items()}
    elif isinstance(data, datetime):
        return data.isoformat()
    else:
        return data
    
@router.get("/", tags=["finances"])
async def get_finance(req: Request):
    try:
        user_token = ObjectId(req.headers.get("X-Authentication-Token"))
        period = datetime.strptime(req.query_params["period"][:15], "%a %b %d %Y")
        year = period.year
        month = period.month
        
        # Create start and end dates for the month
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        db = get_database()
        collection = db["finances"]
        all_finances = list(collection.aggregate([
            { '$match': { 
                'user': user_token,
                'date': {
                    '$gte': start_date,
                    '$lt': end_date
                }
            }},
            { '$addFields': { '_id': { '$toString': "$_id" } } },
            { '$project': { 'user': 0 } }
        ]))
    
        if len(all_finances) > 0:
            all_finances = convert_datetimes(all_finances)
            
            return JSONResponse(content={"data": all_finances, "status": 200}, status_code=status.HTTP_200_OK)
        
        return JSONResponse(content={"message": "No data found!", "status": 401}, status_code=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in get_finance: {str(e)}")  # Log the actual error
        return JSONResponse(content={"message": f"Server error: {str(e)}", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@router.post("/", tags=["finances", "add", "itens"])
async def post_finance(req: Request, finance_data: List[Dict[str, Any]]):
    try:
        user_token = ObjectId(req.headers.get("X-Authentication-Token"))

        for item in finance_data:
            # Remove _id if it exists (MongoDB will auto-generate it)
            if "_id" in item:
                del item["_id"]
            item["user"] = user_token
            item["date"] = datetime.fromisoformat(item["date"].replace('Z', '+00:00'))

        db = get_database()
        collection = db["finances"]
        collection.insert_many(finance_data)

        return JSONResponse(content={"success": True, "status": 201}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error in post_finance: {str(e)}")  # Log the actual error
        return JSONResponse(content={"message": f"Server error: {str(e)}", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@router.patch("/{item_id}", tags=["finances", "patch", "item", "field"])
async def patch_finance(item_id: str, updated_data: dict = Body(...)):
    try:
        if updated_data.get("field") == "date":
            updated_data["value"] = datetime.fromisoformat(updated_data.get("value").replace('Z', '+00:00'))

        update_payload = {}
        update_payload[updated_data.get("field")] = updated_data.get("value", "")
        db = get_database()
        collection = db["finances"]
        collection.update_one({"_id": ObjectId(item_id)}, {"$set": update_payload})
    except Exception as e:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return JSONResponse(content={"message": "Item updated!", "status": 200}, status_code=status.HTTP_200_OK)

@router.delete("/{item_id}", tags=["finances", "delete", "item"])
async def delete_finance(item_id: str):
    try:
        db = get_database()
        collection = db["finances"]
        collection.delete_one({"_id": ObjectId(item_id)})
    except Exception as e:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return JSONResponse(content={"message": "Item deleted!", "status": 200}, status_code=status.HTTP_200_OK)
