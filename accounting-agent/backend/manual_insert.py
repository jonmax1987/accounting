from database import SessionLocal
from models import Client, Invoice
from datetime import date

db = SessionLocal()

client = Client(name="בדיקה", balance=0.0)
db.add(client)
db.commit()
db.refresh(client)

invoice = Invoice(amount=999, date=date.today(), type="income", client_id=client.id)
db.add(invoice)
db.commit()

print("✅ נכתב בהצלחה")
