from database import SessionLocal
from models import Client, Invoice

db = SessionLocal()

print("📋 Clients:")
for client in db.query(Client).all():
    print(f"{client.id} | {client.name} | balance: {client.balance}")

print("\n📄 Invoices:")
for inv in db.query(Invoice).all():
    print(f"{inv.id} | client_id={inv.client_id} | {inv.amount}₪ | {inv.type} | {inv.date}")