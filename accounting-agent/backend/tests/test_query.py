from rag.vector_store import query_similar

text = "כמה שושנה חייבת לי?"
results = query_similar(text)

for i, doc in enumerate(results['documents'][0]):
    print(f"\n🔹 תוצאה {i+1}:\n{doc}")
