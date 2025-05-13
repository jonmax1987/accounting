from sentence_transformers import SentenceTransformer

# שלב ההורדה של המודל - זה יבצע את ההורדה מהאינטרנט וישמור בזיכרון המטמון
print("🔄 מוריד את המודל, אנא המתן...")
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
print("✅ המודל ירד בהצלחה!")
