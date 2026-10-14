from django.db import models

class Finding(models.Model):
    SEVERITY_CHOICES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
    ]

    rule_id = models.CharField(max_length=50) # e.g., "AWS_S3_PUBLIC"
    title = models.CharField(max_length=200)
    resource = models.CharField(max_length=200) # e.g., "arn:aws:s3:::company-finance"
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    nist_category = models.CharField(max_length=20) # e.g., "PR.DS-01"
    nist_pillar = models.CharField(max_length=20) # e.g., "PROTECT"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    remediation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.resource}"