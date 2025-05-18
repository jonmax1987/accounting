# agents/query_agent.py
from sqlalchemy.orm import Session
from models import Client, Invoice
from database import SessionLocal

def handle_largest_invoice_query(client_name: str | None) -> dict:
    db: Session = SessionLocal()

    client = db.query(Client).filter(Client.name == client_name).first()
    if not client or not client.invoices:
        return {
            "intent": "query_largest_invoice",
            "response": "לא הצלחתי למצוא את הלקוח שציינת או שאין לו חשבוניות."
        }

    largest = max(client.invoices, key=lambda x: x.amount)
    return {
        "intent": "query_largest_invoice",
        "response": f"החשבונית הגבוהה ביותר של {client.name} היא על סך {largest.amount} ש\"ח, בתאריך {largest.date}."
    }