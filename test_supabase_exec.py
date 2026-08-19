import requests
import json
from backend.config import settings

url = f"{settings.SUPABASE_URL}/rest/v1/rpc/match_documents"
headers = {
    "apikey": settings.SUPABASE_KEY,
    "Authorization": f"Bearer {settings.SUPABASE_KEY}",
    "Content-Type": "application/json"
}

print("Testing Supabase connection...")
print("URL:", settings.SUPABASE_URL)

# Try fetching tables
res = requests.get(f"{settings.SUPABASE_URL}/rest/v1/employees", headers=headers)
print("Employees Table Status:", res.status_code, res.text)
