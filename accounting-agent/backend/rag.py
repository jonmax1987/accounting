from db import get_client_balance
import re

def enrich_prompt(system_prompt: str, user_input: str, extracted_client: str | None) -> str:
    context_info = ""

    client_name = extracted_client or extract_client_from_text(user_input)
    if client_name:
        balance = get_client_balance(client_name)
        context_info += f"\nהלקוח בשם {client_name} חייב {balance} ש\"ח.\n"

    return system_prompt + context_info


def extract_client_from_text(text: str) -> str | None:
    """
    חילוץ שם לקוח מהטקסט — תומך ב-ליוסי / לשמעון / למדוד וכו'.
    """
    match = re.search(r"ל([א-ת]{2,})", text)
    return match.group(1) if match else None
