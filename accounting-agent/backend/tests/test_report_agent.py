from agents.report_agent import handle_report_command

def test_report_profit():
    result = handle_report_command("כמה הרווחתי באפריל?")
    assert result["intent"] == "report_profit"
    assert "רווח" in result["response"]

def test_report_income():
    result = handle_report_command("כמה הכנסות היו לי?")
    assert result["intent"] == "report_income"

def test_report_expense():
    result = handle_report_command("כמה הוצאות היו לי?")
    assert result["intent"] == "report_expense"
