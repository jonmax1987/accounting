from rag.vector_store import add_document
from db import clients

def load_clients_from_db():
    """
    טוען את כל הלקוחות הקיימים במבנה ה-DB ומכניס אותם לווקטור סטור.
    כל לקוח נכנס כ-document אחד, עם פרטים רלוונטיים.
    """
    for name, data in clients.items():
        balance = data.get("balance", 0)
        invoices = data.get("invoices", [])
        invoice_summary = ". ".join(
            f"חשבונית בתאריך {inv['date']} על סך {inv['amount']} ש\"ח" for inv in invoices
        )
        text = f"הלקוח {name} חייב {balance} ש\"ח. {invoice_summary}."
        add_document(doc_id=f"client_{name}", text=text, metadata={"type": "client"})
