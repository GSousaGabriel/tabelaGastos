from bson import ObjectId
from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from utils.get_database import get_database
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
async def get_finance(req: Request):
    try:
        user_token = ObjectId(req.headers.get("X-Authentication-Token"))
        period = datetime.strptime(req.query_params["period"][:15], "%a %b %d %Y")
        year = period.year
        month = period.month
        db = get_database()
        collection = db["finances"]
        all_finances = list(collection.aggregate([
            { '$match': { 
                'user': user_token,
                '$expr': {
                    '$and': [
                        {'$eq': [{'$year': '$date'}, year]},
                        {'$eq': [{'$month': '$date'}, month]}
                    ]
                }
            }},
            { '$addFields': { '_id': { '$toString': "$_id" } } },
            { '$project': { 'user': 0 } }
        ]))
    
        if len(all_finances) > 0:
            all_finances = convert_datetimes(all_finances)
            
            return JSONResponse(content={"data": all_finances, "status": 200}, status_code=status.HTTP_200_OK)
        
        return JSONResponse(content={"message": "No data found!", "status": 401}, status_code=status.HTTP_404_NOT_FOUND)
    except:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@router.post("/", tags=["finances", "add", "item"])
async def post_finance(req: Request):
    try:
        user_token = ObjectId(req.headers.get("X-Authentication-Token"))
        db = get_database()
        collection = db["finances"]
        collection.insert_one()
    
        if len(all_finances) > 0:
            all_finances = convert_datetimes(all_finances)
            
            return JSONResponse(content={"data": all_finances, "status": 200}, status_code=status.HTTP_200_OK)
        
        return JSONResponse(content={"message": "No data found!", "status": 401}, status_code=status.HTTP_404_NOT_FOUND)
    except:
        return JSONResponse(content={"message": "Server error!", "status": 500}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)