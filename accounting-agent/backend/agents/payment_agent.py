# agents/payment_agent.py
from sqlalchemy.orm import Session
from models import Client
from database import SessionLocal

def handle_payment_command(client: str | None = None, amount: float | None = None, intent: str | None = None) -> dict:
    db: Session = SessionLocal()

    if intent == "reminder_debt" and client:
        c = db.query(Client).filter(Client.name == client).first()
        if not c:
            return {"intent": intent, "response": f"לא נמצא לקוח בשם {client}."}
        return {
            "intent": intent,
            "response": f"אזכור: יש לגבות מ{client} סכום של {c.balance} ש\"ח.",
            "client": client,
            "amount": c.balance
        }

    elif intent == "mark_as_paid" and client:
        c = db.query(Client).filter(Client.name == client).first()
        if not c or c.balance <= 0:
            return {
                "intent": intent,
                "response": f"ל{client} אין חוב פתוח.",
                "client": client
            }
        c.balance = 0
        db.commit()
        return {
            "intent": intent,
            "response": f"הסכום של {client} הוסר מרשימת החובות.",
            "client": client
        }

    elif intent == "debt_status":
        if client:
            c = db.query(Client).filter(Client.name == client).first()
            if not c or c.balance <= 0:
                return {
                    "intent": intent,
                    "response": f"ל{client} אין חוב פתוח.",
                    "client": client
                }
            return {
                "intent": intent,
                "response": f"{client} חייב {c.balance} ש\"ח.",
                "client": client,
                "amount": c.balance
            }

        debtors = db.query(Client).filter(Client.balance > 0).all()
        if not debtors:
            return {
                "intent": intent,
                "response": "כל הלקוחות שילמו. אין חובות פתוחים."
            }
        debts = {c.name: c.balance for c in debtors}
        response = "הלקוחות שעוד לא שילמו:\n" + "\n".join(f"{n}: {a} ש\"ח" for n, a in debts.items())
        return {
            "intent": intent,
            "response": response,
            "debts": debts
        }

    return {
        "intent": "unknown",
        "response": "לא הצלחתי להבין את בקשת הגבייה."
    }