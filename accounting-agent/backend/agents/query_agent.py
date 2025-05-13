from db import clients

def handle_largest_invoice_query(client_name: str | None) -> dict:
    if not client_name or client_name not in clients:
        return {
            "intent": "query_largest_invoice",
            "response": "לא הצלחתי למצוא את הלקוח שציינת או שאין לו חשבוניות.",
        }

    invoices = clients[client_name].get("invoices", [])
    if not invoices:
        return {
            "intent": "query_largest_invoice",
            "response": f"ל{client_name} אין חשבוניות רשומות."
        }

    largest = max(invoices, key=lambda x: x["amount"])
    return {
        "intent": "query_largest_invoice",
        "response": f"החשבונית הגבוהה ביותר של {client_name} היא על סך {largest['amount']} ש\"ח, בתאריך {largest['date']}."
    }
