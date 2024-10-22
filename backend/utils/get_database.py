from pymongo import MongoClient
def get_database(db: str = "expenseTable"):
   CONNECTION_STRING = "mongodb+srv://pasteu008:123@cluster0.yjo5rgo.mongodb.net/"
   client = MongoClient(CONNECTION_STRING)
   return client[db]
  
if __name__ == "__main__":   
   dbname = get_database()