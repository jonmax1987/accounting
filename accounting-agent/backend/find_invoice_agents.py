import os

for root, dirs, files in os.walk("."):
    for file in files:
        if file == "invoice_agent.py":
            print("🔍 Found:", os.path.join(root, file))
