# agents/report_agent.py

import datetime

# נתוני תנועות פיקטיביים
transactions = [
    {"type": "income", "amount": 1200, "date": "2024-04-10"},
    {"type": "expense", "amount": 300, "date": "2024-04-11"},
    {"type": "expense", "amount": 200, "date": "2024-04-17"},
    {"type": "income", "amount": 900, "date": "2024-04-20"},
    {"type": "income", "amount": 1500, "date": "2024-05-01"},
    {"type": "expense", "amount": 450, "date": "2024-05-03"},
    {"type": "expense", "amount": 100, "date": "2024-05-04"},
]

def handle_report_command(user_input: str) -> dict:
    user_input = user_input.strip().lower()
    month = extract_month(user_input)

    # סינון לפי חודש אם צוין
    if month:
        filtered = [t for t in transactions if t["date"][5:7] == month]
    else:
        filtered = transactions

    total_income = sum(t["amount"] for t in filtered if t["type"] == "income")
    total_expense = sum(t["amount"] for t in filtered if t["type"] == "expense")
    profit = total_income - total_expense

    if "רווח" in user_input:
        response = f"הרווח {'ב' + month if month else 'הכולל'} הוא {profit} ש\"ח."
        intent = "report_profit"
    elif "הכנסות" in user_input:
        response = f"ההכנסות {'ב' + month if month else 'הכוללות'} הן {total_income} ש\"ח."
        intent = "report_income"
    elif "הוצאות" in user_input:
        response = f"ההוצאות {'ב' + month if month else 'הכוללות'} הן {total_expense} ש\"ח."
        intent = "report_expense"
    else:
        response = "לא הצלחתי להבין איזה דוח אתה רוצה."
        intent = "unknown"

    return {
        "intent": intent,
        "response": response,
        "filtered_month": month,
        "profit": profit,
        "total_income": total_income,
        "total_expense": total_expense
    }

def extract_month(text: str) -> str | None:
    """מנסה לזהות חודש מתוך טקסט בעברית ולהחזיר מספר חודש בפורמט 2 ספרות."""
    months = {
        "ינואר": "01", "פברואר": "02", "מרץ": "03", "אפריל": "04",
        "מאי": "05", "יוני": "06", "יולי": "07", "אוגוסט": "08",
        "ספטמבר": "09", "אוקטובר": "10", "נובמבר": "11", "דצמבר": "12"
    }

    for heb_month, num in months.items():
        if heb_month in text:
            return num
    return None
