from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FindingViewSet, trigger_scan, get_dashboard_data
from .reports import generate_pdf_report

router = DefaultRouter()
router.register(r'findings', FindingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('scan/', trigger_scan, name='trigger_scan'),
    path('dashboard/', get_dashboard_data, name='get_dashboard'),
    path('report.pdf', generate_pdf_report, name='generate_pdf_report'),
]