# db.py

clients = {
    "דני": {"balance": 320, "invoices": [{"date": "2024-04-10", "amount": 320}]},
    "יוסי": {"balance": 450, "invoices": [{"date": "2024-03-15", "amount": 450}]},
    "דוד": {"balance": 210, "invoices": [{"date": "2024-05-01", "amount": 210}]}
}


def get_client_balance(name: str) -> float:
    client = clients.get(name)
    if not client:
        return 0.0
    return client.get("balance", 0.0)


def get_last_invoice(name: str) -> dict | None:
    client = clients.get(name)
    if client and client.get("invoices"):
        return client["invoices"][-1]
    return None


def mark_as_paid(name: str) -> bool:
    if name in clients:
        clients[name]["balance"] = 0
        return True
    return False


def get_all_debts() -> dict:
    return {name: data["balance"] for name, data in clients.items() if data["balance"] > 0}

def add_invoice_to_client(name: str, amount: float):
    from datetime import date

    if name not in clients:
        # לקוח חדש – הוספה למאגר
        clients[name] = {
            "balance": amount,
            "invoices": [{"date": date.today().isoformat(), "amount": amount}]
        }
    else:
        clients[name]["balance"] += amount
        clients[name]["invoices"].append({
            "date": date.today().isoformat(),
            "amount": amount
        })
