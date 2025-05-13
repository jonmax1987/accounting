from agents.invoice_agent import handle_invoice_command
from db import get_client_balance

def test_invoice_adds_to_client():
    initial_balance = get_client_balance("יוסי")
    result = handle_invoice_command("תפיק לי חשבונית על 100 ליוסי")
    assert result["intent"] == "issue_invoice"
    assert "יוסי" in result["client_name"]
    assert get_client_balance("יוסי") == initial_balance + 100
