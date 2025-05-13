import re
import random
from db import add_invoice_to_client

def handle_invoice_command(user_input: str) -> dict:
    """
    מפיק חשבונית + מעדכן DB.
    """

    # ניסיון טוב יותר לחלץ שם אחרי "ל" (כמו "ליוסי")
    name_match = re.search(r"ל([א-ת]{2,})", user_input)
    client_name = name_match.group(1).strip() if name_match else "לקוח לא ידוע"

    # חילוץ סכום
    amount_match = re.search(r"(\d+(?:[.,]\d+)?)", user_input)
    amount_str = amount_match.group(1).replace(',', '.') if amount_match else "0"
    amount = round(float(amount_str), 2)

    invoice_number = f"INV-{random.randint(1000, 9999)}"

    # עדכון ב-DB
    add_invoice_to_client(client_name, amount)

    response_text = (
        f"הפקתי חשבונית על {amount} ש\"ח ל{client_name}.\n"
        f"מספר מסמך: {invoice_number}"
    )

    return {
        "intent": "issue_invoice",
        "invoice_number": invoice_number,
        "client_name": client_name,
        "amount": amount,
        "response": response_text
    }
