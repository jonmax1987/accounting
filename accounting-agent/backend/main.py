# main.py

from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dispatcher import handle_command as basic_dispatcher
from llm_dispatcher import handle_command_via_llm as llm_dispatcher
from routes import report  # למעלה

app = FastAPI()

app.include_router(report.router)

# הרשה קריאות מה-Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    input: str

@app.post("/agent")
async def process_command(request: Request, body: CommandRequest):
    use_llm = request.query_params.get("llm", "false").lower() == "true"
    
    if use_llm:
        result = llm_dispatcher(body.input)
    else:
        result = basic_dispatcher(body.input)
    
    return result