# 📊 AI Accounting Agent (Hebrew)

A smart, modular accounting agent that understands **Hebrew commands** and performs structured financial tasks — powered by **FastAPI**, **GPT-3.5 via OpenRouter**, and semantic search using **ChromaDB**.

---

## 🚀 Features

### 🔤 Hebrew Natural Language Understanding
Understands freeform Hebrew sentences like:
- "תוציא לי חשבונית על 850 לרוני"
- "מה ההוצאות שלי באפריל?"
- "מי עדיין לא שילם?"
- "מה החשבונית הכי גבוהה של יוסי?"

### 🧠 LLM-based Intent Recognition
Uses **GPT-3.5** to extract:
- `intent`
- `client`
- `amount`  
All in clean, structured JSON.

### 🔎 Context-Aware with RAG
Uses **ChromaDB** and **Sentence Transformers** (`paraphrase-multilingual-MiniLM-L12-v2`) to provide relevant vector-based context to the LLM.

### 🧾 Structured Logic Agents
Separate modules handle:
- Invoice issuing
- Profit / Income / Expense reports
- Payment reminders & debt status
- Invoice queries (e.g., highest invoice)

### 🌐 FastAPI Backend
Exposes a RESTful endpoint at `/agent` with support for `llm=true` for enriched AI responses.

### 🧪 Tested & Extensible
Includes example tests for core functionality.  
Easy to expand with new `intents`, agents, and logic.

---

## 📂 Project Structure

📦 accounting-agent/
├── main.py                         # Entry point – FastAPI app
├── llm_dispatcher.py              # LLM logic, prompt enrichment, intent routing
├── db.py                          # In-memory DB of clients and invoices
├── project_context.md             # Full internal documentation (for devs)

├── rag/                           # RAG layer: context retrieval
│   ├── loader.py                  # Loads client data into vector store
│   └── vector_store.py            # ChromaDB setup and semantic querying

├── agents/                        # Business logic agents per intent
│   ├── invoice_agent.py           # Issue invoices + update DB
│   ├── report_agent.py            # Income / expense / profit reports
│   ├── payment_agent.py           # Mark paid, reminders, debt status
│   └── query_agent.py             # Advanced queries (e.g. highest invoice)

├── tests/                         # (Optional) Test cases
│   ├── test_llm_dispatcher.py     # Tests for LLM parsing
│   ├── test_invoice_agent.py      # Unit tests for invoice logic
│   ├── test_payment_agent.py      # Tests for debt/collection logic
│   └── test_report_agent.py       # Tests for report generation
