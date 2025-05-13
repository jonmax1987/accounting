from llm_dispatcher import handle_command_via_llm

def test_llm_debt_status():
    result = handle_command_via_llm("מי עוד לא שילם?")
    assert result["intent"] == "debt_status"

def test_llm_invoice():
    result = handle_command_via_llm("תפיק לי חשבונית על 120 ליוסי")
    assert result["intent"] == "issue_invoice"
    assert "יוסי" in result["client_name"]

def test_llm_profit():
    result = handle_command_via_llm("כמה הרווחתי באפריל?")
    assert result["intent"] == "report_profit"
