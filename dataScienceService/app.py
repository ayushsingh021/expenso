from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.messageService import MessageService

app = FastAPI()

# Create instance of your message service
messageService = MessageService()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schema using Pydantic
class MessageInput(BaseModel):
    message: str

# POST endpoint to handle incoming messages
@app.post("/api/v1/message")
async def handle_message(payload: MessageInput):
    try:
        result = messageService.process_message(payload.message)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Simple GET endpoint to test the server
@app.get("/api/test")
async def test():
    return {"message": "The testing is successful"}
