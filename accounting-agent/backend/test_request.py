import requests

res = requests.post(
    "http://localhost:8100/agent?llm=true",
    json={"input": "הפק חשבונית על 123 לרוני"}
)

print(res.json())
