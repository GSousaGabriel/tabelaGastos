from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from backend.utils.get_database import get_database
from datetime import datetime

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
async def get_finance():
    try:
        db = get_database()
        collection = db["finances"]
        all_finances = list(collection.find({}, {"_id": 0}))
    
        if len(all_finances) > 0:
            all_finances = convert_datetimes(all_finances)
            
            return JSONResponse(content={"data": all_finances, "status": 200}, status_code=status.HTTP_200_OK)
        
        return JSONResponse(content={"message": "No data found!", "status": 401}, status_code=status.HTTP_404_NOT_FOUND)
    except:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)