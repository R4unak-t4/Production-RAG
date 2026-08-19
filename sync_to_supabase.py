import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from config import settings
from db import db
from create_company_pdf_and_ingest import create_company_pdf

def sync():
    print("=" * 60)
    print("  LEROY AI // SUPABASE PGVECTOR SYNC TOOL")
    print("=" * 60)

    if not settings.is_supabase_configured:
        print("\n[ERROR] SUPABASE NOT CONFIGURED YET!")
        print("Please edit e:\\Production RAG\\backend\\.env and paste your real SUPABASE_URL and SUPABASE_KEY.")
        return

    print(f"\n[OK] Connected to Supabase Project: {settings.SUPABASE_URL}")
    print("[SYNC] Seeding employees, revenue metrics, and vector embeddings into Supabase...")

    # Seed baseline dataset into Supabase
    db.seed_initial_data()

    # Re-run company PDF ingestion into Supabase
    create_company_pdf()

    print("\n[SUCCESS] SYNC COMPLETE! Check your Supabase Dashboard -> Table Editor -> 'knowledge_documents' table!")
    print("=" * 60)

if __name__ == "__main__":
    sync()
