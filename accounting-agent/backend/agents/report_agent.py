# agents/report_agent.py
from sqlalchemy.orm import Session
from models import Invoice
from database import SessionLocal

def handle_report_command(user_input: str) -> dict:
    db: Session = SessionLocal()
    user_input = user_input.strip().lower()
    month = extract_month(user_input)

    invoices = db.query(Invoice).all()
    filtered = [i for i in invoices if month is None or i.date.strftime('%m') == month]

    total_income = sum(i.amount for i in filtered if i.amount > 0)
    total_expense = 0  # ניתן להוסיף סוג "expense" בעתיד אם תורחב הסכמה
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
    months = {
        "ינואר": "01", "פברואר": "02", "מרץ": "03", "אפריל": "04",
        "מאי": "05", "יוני": "06", "יולי": "07", "אוגוסט": "08",
        "ספטמבר": "09", "אוקטובר": "10", "נובמבר": "11", "דצמבר": "12"
    }
    for heb_month, num in months.items():
        if heb_month in text:
            return num
    return None