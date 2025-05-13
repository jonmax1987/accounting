from rag.loader import load_clients_from_db
from llm_dispatcher import handle_command_via_llm

def main():
    # שלב 1: טעינת נתונים למסד (רק בפעם הראשונה או כשמתחלפים נתונים)
    print("🚀 טוען לקוחות אל Vector Store (ChromaDB)...")
    load_clients_from_db()

    # שלב 2: שאילת שאלה בעברית
    question = "מה החשבונית הכי גבוהה של יוסי?"
    print(f"\n❓ שאלה: {question}")

    # שלב 3: הפעלת סוכן עם RAG
    response = handle_command_via_llm(question)

    # שלב 4: הדפסת תשובה
    print("\n🤖 תשובת הסוכן:")
    print(response.get("response", response))

if __name__ == "__main__":
    main()
