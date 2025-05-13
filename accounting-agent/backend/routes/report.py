from fastapi import APIRouter
from db import clients
from fastapi.responses import HTMLResponse

router = APIRouter()

@router.get("/report/clients")
def get_clients_report():
    return {
        "total_clients": len(clients),
        "clients": clients
    }

@router.get("/report/html", response_class=HTMLResponse)
def html_clients_report():
    html = """
    <html>
        <head>
            <title>דוח לקוחות</title>
            <style>
                body { font-family: Arial; direction: rtl; }
                table { width: 100%%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ccc; text-align: center; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>📄 דוח מצב לקוחות</h2>
            <table>
                <tr>
                    <th>שם לקוח</th>
                    <th>יתרה</th>
                    <th>חשבוניות</th>
                </tr>
    """

    for name, data in clients.items():
        invoices_html = "<br>".join(
            f"{inv['date']}: {inv['amount']} ש\"ח" for inv in data["invoices"]
        )
        html += f"""
            <tr>
                <td>{name}</td>
                <td>{data['balance']}</td>
                <td>{invoices_html}</td>
            </tr>
        """

    html += "</table></body></html>"
    return html
