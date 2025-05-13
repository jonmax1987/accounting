import os
import json
import httpx
from dotenv import load_dotenv

from agents.invoice_agent import handle_invoice_command
from agents.report_agent import handle_report_command
from agents.payment_agent import handle_payment_command
from rag.vector_store import query_similar
from agents.query_agent import handle_largest_invoice_query
from agents.payment_agent import extract_name

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def handle_command_via_llm(user_input: str) -> dict:
    if not OPENROUTER_API_KEY:
        return {
            "intent": "unknown",
            "response": "לא נמצא מפתח API ל-OpenRouter. בדוק את קובץ .env."
        }

    # הפרומפט הבסיסי למודל
    base_system_prompt = """
    אתה עוזר חכם בתחום הנהלת החשבונות.
    מטרתך היא להבין פקודות חופשיות בעברית ולהחזיר מבנה JSON בלבד, ללא הסברים, תגובות או טקסט נוסף.

    📦 פורמט הפלט:
{
  "intent": one of [
    "issue_invoice",               # הפקת חשבונית
    "report_profit",               # דוח רווח
    "report_income",               # דוח הכנסות
    "report_expense",              # דוח הוצאות
    "mark_as_paid",                # סימון תשלום שהתקבל
    "reminder_debt",              # תזכורת גבייה
    "debt_status",                 # בדיקת חוב
    "query_largest_invoice",       # מה החשבונית הכי גבוהה
    "unknown"
  ],
  "client": string or null,        # שם הלקוח (אם קיים)
  "amount": number or null         # סכום אם רלוונטי
}

📋 כללים:
- אל תחזיר טקסט חופשי — JSON בלבד
- אם שם הלקוח או סכום לא ברורים — החזר null
- אין להחזיר תיאור, תגובה או מילות נימוס — רק את המבנה שנדרש

🧠 דוגמאות שימוש:
- "הפק חשבונית על 400 ש\"ח ליוסי" → issue_invoice, client=יוסי, amount=400
- "מה ההוצאות שלי באפריל?" → report_expense
- "האם הייתי ברווח במרץ?" → report_profit
- "מי עוד לא שילם?" → reminder_debt
- "תזכיר לי לגבות מדני" → reminder_debt, client=דני
- "תבדוק אם רוני חייב משהו" → debt_status, client=רוני
- "דנה סיימה לשלם" → mark_as_paid, client=דנה
- "דנה העבירה את הכסף" → mark_as_paid, client=דנה
- "מה החשבונית הכי גבוהה של יוסי?" → query_largest_invoice, client=יוסי
- "איזו חשבונית הכי יקרה של רוני?" → query_largest_invoice, client=רוני
- "דנה העבירה את הכסף" → mark_as_paid, client=דנה
- "דנה העבירה כסף" → mark_as_paid, client=דנה
- "דנה שילמה לי" → mark_as_paid, client=דנה
- "קיבלתי תשלום מדנה" → mark_as_paid, client=דנה
- "הכסף מדנה הגיע" → mark_as_paid, client=דנה
"""

    # שלב RAG: שליפת הקשר דומה מהמערכת
    retrieved = query_similar(user_input, n_results=3)
    context_snippets = retrieved.get("documents", [[]])[0]
    rag_context = "\n\n".join(context_snippets)

    # שילוב הקשר לתוך הפרומפט
    enriched_prompt = base_system_prompt + "\n\nמידע נוסף להקשר:\n" + rag_context

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "accounting-agent/1.0"
    }

    body = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": enriched_prompt},
            {"role": "user", "content": user_input}
        ]
    }

    try:
        with httpx.Client(timeout=30) as client:
            response = client.post(OPENROUTER_URL, headers=headers, json=body)
            response.raise_for_status()
            reply = response.json()
            raw_output = reply["choices"][0]["message"]["content"].strip()

            with open("debug_llm_output.txt", "a", encoding="utf-8") as f:
                f.write(f"\n=== USER: {user_input} ===\n{raw_output}\n")

            data = json.loads(raw_output)

    except httpx.HTTPStatusError as e:
        return {
            "intent": "unknown",
            "response": f"שגיאה מהשרת ({e.response.status_code}): {e.response.text}"
        }
    except json.JSONDecodeError:
        return {
            "intent": "unknown",
            "response": "המודל החזיר פלט לא תקין (לא JSON).",
            "raw_output": raw_output
        }
    except Exception as e:
        return {
            "intent": "unknown",
            "response": f"שגיאה כללית: {str(e)}"
        }

    # ניתוב לפי intent
    intent = data.get("intent")

    if intent == "issue_invoice":
        return handle_invoice_command(user_input)
    elif intent and intent.startswith("report_"):
        return handle_report_command(user_input)
    elif intent in ["mark_as_paid", "reminder_debt", "debt_status"]:
        return handle_payment_command(
            client=data.get("client"),
            amount=data.get("amount"),
            intent=intent
        )
    elif intent == "query_largest_invoice":
        client = data.get("client") or extract_name(user_input)
        return handle_largest_invoice_query(client)
    else:
        return {
            "intent": "unknown",
            "response": "intent לא מוכר מהמודל.",
            "raw": data
        }
