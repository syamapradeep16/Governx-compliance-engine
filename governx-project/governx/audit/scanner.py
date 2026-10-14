# Sample mock AWS infrastructure configuration
MOCK_AWS_DATA = [
    {
        "resource_type": "s3_bucket",
        "name": "company-financial-records",
        "is_public": True,
        "is_encrypted": False
    },
    {
        "resource_type": "iam_user",
        "username": "admin_temp",
        "mfa_enabled": False
    },
    {
        "resource_type": "security_group",
        "name": "default-sg",
        "open_ssh_to_world": True
    }
]

def run_mock_scan():
    findings = []
    
    for item in MOCK_AWS_DATA:
        # Check 1: Public S3 Buckets (NIST PR.DS-01)
        if item.get("resource_type") == "s3_bucket" and item.get("is_public"):
            findings.append({
                "rule_id": "AWS_S3_PUBLIC",
                "title": "Public S3 Bucket Detected",
                "resource": item["name"],
                "severity": "CRITICAL",
                "nist_category": "PR.DS-01",
                "nist_pillar": "PROTECT",
                "remediation": "Enable 'Block Public Access' setting on the S3 bucket."
            })
            
        # Check 2: Unencrypted Storage (NIST PR.DS-02)
        if item.get("resource_type") == "s3_bucket" and not item.get("is_encrypted"):
            findings.append({
                "rule_id": "AWS_S3_UNENCRYPTED",
                "title": "S3 Encryption Disabled",
                "resource": item["name"],
                "severity": "HIGH",
                "nist_category": "PR.DS-02",
                "nist_pillar": "PROTECT",
                "remediation": "Enable default AWS-KMS or AES-256 server-side encryption."
            })
            
        # Check 3: IAM MFA Missing (NIST PR.AA-03)
        if item.get("resource_type") == "iam_user" and not item.get("mfa_enabled"):
            findings.append({
                "rule_id": "AWS_IAM_NO_MFA",
                "title": "IAM User Missing MFA",
                "resource": item["username"],
                "severity": "HIGH",
                "nist_category": "PR.AA-03",
                "nist_pillar": "GOVERN",
                "remediation": "Enforce Multi-Factor Authentication via IAM Policy."
            })

    return findings