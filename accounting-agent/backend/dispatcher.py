# dispatcher.py

from agents.invoice_agent import handle_invoice_command
from agents.report_agent import handle_report_command
from agents.payment_agent import handle_payment_command

def handle_command(user_input: str) -> dict:
    """
    מזהה את סוג הבקשה ושולח ל-agent המתאים.
    תומך כרגע בהפקת חשבונית ובדוחות רווח/הוצאות/הכנסות.
    """
    user_input = user_input.strip().lower().replace("?", "").replace("?", "")  # מנקה סימנים מיוחדים

    if "חשבונית" in user_input:
        return handle_invoice_command(user_input)
    
    elif any(keyword in user_input for keyword in ["רווח", "הכנסות", "הוצאות"]):
        return handle_report_command(user_input)
    
    elif any(keyword in user_input for keyword in ["שילם", "לגבות", "חוב", "תזכיר"]):
        return handle_payment_command(user_input)
    
    return {
        "intent": "unknown",
        "response": "לא הצלחתי להבין את הבקשה. נסה לנסח אחרת."
    }
