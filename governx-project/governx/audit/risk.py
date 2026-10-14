import numpy as np

def calculate_monte_carlo_risk(open_findings_count):
    if open_findings_count == 0:
        return {"expected_loss": 0, "p95_loss": 0}

    # Simulation assumptions: 10,000 iterations
    simulations = 10000
    
    # Base probability of breach based on finding count
    probability = min(0.15 * open_findings_count, 0.85)
    
    # Randomly simulate breach occurrences
    breaches = np.random.binomial(1, probability, simulations)
    
    # Financial impact per breach ($50,000 to $500,000)
    impacts = np.random.uniform(50000, 500000, simulations)
    
    losses = breaches * impacts
    
    return {
        "expected_loss": round(float(np.mean(losses)), 2),
        "p95_loss": round(float(np.percentile(losses, 95)), 2) # 95th percentile worst case
    }