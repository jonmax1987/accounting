import re
import random
from sqlalchemy.orm import Session
from models import Client, Invoice
from database import SessionLocal
from datetime import date
import logging

logging.basicConfig(level=logging.INFO)

def handle_invoice_command(client_name: str, amount: float, user_input: str = "") -> dict:
    db: Session = SessionLocal()

    try:
        logging.info(f"🔄 מטפל בפקודת חשבונית עבור {client_name}, סכום: {amount}")

        client = db.query(Client).filter(Client.name == client_name).first()
        if not client:
            logging.info(f"➕ יוצר לקוח חדש: {client_name}")
            client = Client(name=client_name, balance=0.0)
            db.add(client)
            db.commit()
            db.refresh(client)

        inv_type = "income"
        if any(keyword in user_input for keyword in ["הוצאה", "קניתי", "הוצאתי", "שילמתי"]):
            inv_type = "expense"

        invoice = Invoice(amount=amount, date=date.today(), type=inv_type, client_id=client.id)

        if inv_type == "income":
            client.balance += amount

        db.add(invoice)
        db.commit()
        db.refresh(invoice)

        invoice_number = f"INV-{invoice.id:04}"
        action = "הכנסתי" if inv_type == "income" else "הוצאתי"
        response_text = (
            f"{action} {amount} ש\"ח {'מ' if inv_type == 'expense' else 'ל'}{client_name}.\n"
            f"סוג תנועה: {inv_type}\n"
            f"מספר מסמך: {invoice_number}"
        )

        logging.info(f"✅ חשבונית נוצרה: {invoice_number}")

        return {
            "intent": "issue_invoice",
            "invoice_number": invoice_number,
            "client_name": client_name,
            "amount": amount,
            "type": inv_type,
            "response": response_text
        }

    except Exception as e:
        logging.error(f"❌ שגיאה בעת יצירת חשבונית: {str(e)}")
        db.rollback()
        return {
            "intent": "issue_invoice",
            "response": f"שגיאה ביצירת חשבונית: {str(e)}"
        }
    finally:
        db.close()
