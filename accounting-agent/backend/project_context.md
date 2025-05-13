# 🧠 Project Context: Accounting Agent with RAG + LLM

## 🎯 Purpose

Create a smart agent for accounting-related tasks in Hebrew, powered by:

* FastAPI backend
* LLM (GPT-3.5 via OpenRouter)
* RAG: ChromaDB + sentence-transformers
* Structured intent recognition + agent dispatching

## 📁 File Structure

### `main.py`

* FastAPI app entry point
* Exposes `/agent` endpoint

### `llm_dispatcher.py`

* Handles incoming user input
* Uses `query_similar` to retrieve context from vector store
* Enriches prompt and sends it to LLM
* Receives JSON with intent, client, amount
* Dispatches to appropriate agent:

  * `invoice_agent`
  * `payment_agent`
  * `report_agent`
  * `query_agent`

### `rag/vector_store.py`

* Initializes ChromaDB with multilingual embedding model
* Adds documents and supports semantic query

### `rag/loader.py`

* Loads all clients and their invoice data into vector DB
* Format example:

  ```
  הלקוח יוסי חייב 450 ש"ח. חשבונית בתאריך 2024-03-15 על סך 450 ש"ח.
  ```

### `agents/`

* `invoice_agent.py`: issues invoice and updates DB
* `payment_agent.py`: handles debt, payments, reminders
* `report_agent.py`: returns income/expense/profit reports
* `query_agent.py`: answers queries like "largest invoice"

### `db.py`

* Holds an in-memory client DB with:

  * name
  * balance
  * list of invoices \[{amount, date}]

---

## 🧠 LLM Integration

* Model: `openai/gpt-3.5-turbo` via OpenRouter
* Prompt includes structured JSON format + examples
* Enriched with RAG context dynamically before request

---

## 💬 Supported Intents

```json
[
  "issue_invoice",
  "report_profit",
  "report_income",
  "report_expense",
  "mark_as_paid",
  "reminder_debt",
  "debt_status",
  "query_largest_invoice",
  "unknown"
]
```

---

## 🧪 Example User Commands (Hebrew)

* הפק חשבונית על 200 ש"ח ליוסי → issue\_invoice
* מה ההוצאות שלי במאי? → report\_expense
* מי עוד לא שילם? → reminder\_debt
* תזכיר לי לגבות מדוד → reminder\_debt
* תבדוק אם רוני חייב משהו → debt\_status
* דנה סיימה לשלם → mark\_as\_paid
* דנה העבירה את הכסף → mark\_as\_paid
* מה החשבונית הכי גבוהה של רוני? → query\_largest\_invoice

---

## 🛠️ Improvements in Progress

* Better handling of Hebrew variants like "שדני", "לרוני" in extract\_name()
* Post-processing fallback: detect "העביר כסף" patterns if LLM fails
* Extended prompt examples to guide LLM with edge cases

---

## 📌 Notes

* Huggingface model: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
* RAG is fully integrated: loader populates DB, dispatcher uses it per request
* Logs saved to `debug_llm_output.txt` for debugging JSON output
