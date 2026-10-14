from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from .models import Finding

def generate_pdf_report(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="GovernX_Compliance_Report.pdf"'

    p = canvas.Canvas(response, pagesize=letter)
    p.setFont("Helvetica-Bold", 18)
    p.drawString(100, 750, "GovernX - Executive NIST CSF 2.0 Audit")

    p.setFont("Helvetica", 10)
    p.drawString(100, 730, "Generated automatically via Continuous Integration Engine")
    p.line(100, 720, 500, 720)

    y = 680
    findings = Finding.objects.all()
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, y, "Active Security Findings:")
    y -= 25

    p.setFont("Helvetica", 10)
    for item in findings:
        text = f"[{item.severity}] {item.title} ({item.nist_category}) - Status: {item.status}"
        p.drawString(100, y, text)
        y -= 20
        if y < 100: # New page if full
            p.showPage()
            y = 750

    p.showPage()
    p.save()
    return response