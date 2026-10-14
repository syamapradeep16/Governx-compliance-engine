from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Finding
from .serializers import FindingSerializer
from .scanner import run_mock_scan
from .risk import calculate_monte_carlo_risk

class FindingViewSet(viewsets.ModelViewSet):
    queryset = Finding.objects.all()
    serializer_class = FindingSerializer

@api_view(['POST'])
def trigger_scan(request):
    raw_findings = run_mock_scan()
    for item in raw_findings:
        Finding.objects.update_or_create(
            rule_id=item["rule_id"],
            resource=item["resource"],
            defaults=item
        )
    return Response({"message": "Scan completed successfully!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_dashboard_data(request):
    total = Finding.objects.count()
    open_count = Finding.objects.filter(status='OPEN').count()
    risk_data = calculate_monte_carlo_risk(open_count)
    
    return Response({
        "total_findings": total,
        "open_findings": open_count,
        "risk_metrics": risk_data,
        "pillars": {
            "GOVERN": Finding.objects.filter(nist_pillar="GOVERN").count(),
            "PROTECT": Finding.objects.filter(nist_pillar="PROTECT").count(),
            "IDENTIFY": Finding.objects.filter(nist_pillar="IDENTIFY").count(),
            "DETECT": Finding.objects.filter(nist_pillar="DETECT").count(),
            "RESPOND": Finding.objects.filter(nist_pillar="RESPOND").count(),
            "RECOVER": Finding.objects.filter(nist_pillar="RECOVER").count(),
        }
    })