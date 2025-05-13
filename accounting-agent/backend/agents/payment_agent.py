from db import get_client_balance, mark_as_paid, get_all_debts

def handle_payment_command(client: str | None = None, amount: float | None = None, intent: str | None = None) -> dict:
    from db import get_client_balance, mark_as_paid, get_all_debts

    if intent == "reminder_debt" and client:
        balance = get_client_balance(client)
        return {
            "intent": "reminder_debt",
            "response": f"אזכור: יש לגבות מ{client} סכום של {balance} ש\"ח.",
            "client": client,
            "amount": balance
        }

    elif intent == "mark_as_paid" and client:
        balance = get_client_balance(client)
        if balance > 0:
            mark_as_paid(client)
            return {
                "intent": "mark_as_paid",
                "response": f"הסכום של {client} הוסר מרשימת החובות.",
                "client": client
            }
        else:
            return {
                "intent": "mark_as_paid",
                "response": f"ל{client} אין חוב פתוח.",
                "client": client
            }

    elif intent == "debt_status":
        # 🟡 נוסיף כאן בדיקה ללקוח בודד!
        if client:
            balance = get_client_balance(client)
            if balance > 0:
                return {
                    "intent": "debt_status",
                    "response": f"{client} חייב {balance} ש\"ח.",
                    "client": client,
                    "amount": balance
                }
            else:
                return {
                    "intent": "debt_status",
                    "response": f"ל{client} אין חוב פתוח.",
                    "client": client
                }

        # אם לא נשלח לקוח → הצג את כל החייבים
        debts = get_all_debts()
        if not debts:
            return {
                "intent": "debt_status",
                "response": "כל הלקוחות שילמו. אין חובות פתוחים."
            }

        response = "הלקוחות שעוד לא שילמו:\n" + "\n".join(
            f"{name}: {amount} ש\"ח" for name, amount in debts.items()
        )
        return {
            "intent": "debt_status",
            "response": response,
            "debts": debts
        }

    return {
        "intent": "unknown",
        "response": "לא הצלחתי להבין את בקשת הגבייה."
    }


def extract_name(text: str) -> str | None:
    """
    חילוץ שם פרטי מהמשפט בצורה נאיבית (מבוסס על שמות קיימים במערכת).
    """
    from db import clients  # שימוש בשמות מה־DB עצמו

    for word in text.split():
        if word in clients:
            return word
    return None
