import chromadb
from chromadb.utils import embedding_functions

# אתחול פונקציית ההטמעה עם שם המודל (תומך עברית)
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# אתחול לקוח ChromaDB ואוסף בשם accounting_docs
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(
    name="accounting_docs",
    embedding_function=embedding_function
)

def add_document(doc_id: str, text: str, metadata: dict = None):
    """
    מוסיף טקסט למאגר הווקטורי.
    :param doc_id: מזהה ייחודי למסמך
    :param text: טקסט לתיעוד (למשל: מידע על לקוח)
    :param metadata: מטא־דאטה אופציונלי (למשל {"type": "client"})
    """
    collection.add(
        documents=[text],
        ids=[doc_id],
        metadatas=[metadata or {}]
    )

def query_similar(text: str, n_results: int = 3):
    """
    מבצע שאילתת קירבה סמנטית לטקסט נתון.
    :param text: שאילתת טקסט חופשי (למשל "כמה יוסי חייב?")
    :param n_results: מספר תוצאות שיחזרו (ברירת מחדל: 3)
    :return: תוצאות כולל טקסטים מקוריים ומטא־דאטה
    """
    return collection.query(
        query_texts=[text],
        n_results=n_results
    )
