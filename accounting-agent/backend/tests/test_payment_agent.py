import pytest
from agents.payment_agent import handle_payment_command
from db import get_client_balance, mark_as_paid

# איפוס נתונים לפני כל טסט
@pytest.fixture(autouse=True)
def reset_db():
    # שחזור ערכים מקוריים מההתחלה
    from db import clients
    clients["דני"]["balance"] = 320
    clients["יוסי"]["balance"] = 450
    clients["דוד"]["balance"] = 210


def test_debt_status_all():
    result = handle_payment_command(intent="debt_status")
    assert result["intent"] == "debt_status"
    assert "דני" in result["response"]
    assert "יוסי" in result["response"]


def test_debt_status_single():
    result = handle_payment_command(intent="debt_status", client="דני")
    assert result["intent"] == "debt_status"
    assert result["client"] == "דני"
    assert "320" in result["response"]


def test_mark_as_paid_flow():
    # לפני תשלום
    assert get_client_balance("דני") == 320

    result = handle_payment_command(intent="mark_as_paid", client="דני")
    assert result["intent"] == "mark_as_paid"
    assert "הוסר" in result["response"]

    # לאחר תשלום
    assert get_client_balance("דני") == 0

    result2 = handle_payment_command(intent="mark_as_paid", client="דני")
    assert "אין חוב פתוח" in result2["response"]


def test_reminder_debt():
    result = handle_payment_command(intent="reminder_debt", client="יוסי")
    assert result["intent"] == "reminder_debt"
    assert result["client"] == "יוסי"
    assert "450" in result["response"]
