import os
import sys
import uuid

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from config import settings
from db import db
from create_company_pdf_and_ingest import create_company_pdf

def ingest_all_dummy_data():
    print("=" * 65)
    print("  LEROY AI // ENTERPRISE DUMMY DATA INGESTION ENGINE")
    print("=" * 65)

    print(f"\n[INFO] Connected Engine: {'Supabase pgvector' if db.use_supabase else 'Resilient Vector Fallback Store'}")

    # 1. EXPANDED EMPLOYEES DATASET
    dummy_employees = [
        {
            "id": str(uuid.uuid4()),
            "name": "Sarah Jenkins",
            "role": "VP of Enterprise Sales",
            "department": "Sales",
            "salary": 185000,
            "performance_score": 9.6,
            "revenue_generated": 2450000,
            "status": "Active",
            "skills": ["Enterprise Closing", "ARR Expansion", "Fortune 500 Deals", "SaaS Negotiation"],
            "bio": "Closed $2.45M ARR in FY26 Q1-Q2 across key Fortune 500 accounts. Specialist in multi-year contract expansion."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Marcus Vance",
            "role": "Lead Revenue Architect",
            "department": "Strategy & Ops",
            "salary": 160000,
            "performance_score": 9.2,
            "revenue_generated": 1800000,
            "status": "Active",
            "skills": ["Dynamic Pricing", "Churn Analytics", "SaaS Packaging", "CLV Optimization"],
            "bio": "Architected the tiered usage pricing model that reduced net revenue churn by 2.4% and boosted expansion MRR."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Elena Rostova",
            "role": "Head of Customer Success",
            "department": "Customer Success",
            "salary": 140000,
            "performance_score": 8.9,
            "revenue_generated": 1200000,
            "status": "Active",
            "skills": ["Account Retention", "Upsell Triggers", "NPS Growth", "Onboarding Velocity"],
            "bio": "Maintained 118.5% Net Retention Rate (NRR) across key mid-market accounts. Increased account expansion velocity."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "David Chen",
            "role": "Principal AI Solutions Engineer",
            "department": "Engineering",
            "salary": 175000,
            "performance_score": 9.4,
            "revenue_generated": 950000,
            "status": "Active",
            "skills": ["LangChain", "LangGraph", "Vector DBs", "FastAPI Architecture"],
            "bio": "Engineered automated RAG sales copilot features for product enterprise tier, driving 35% upsell conversion."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Jessica Taylor",
            "role": "Growth Marketing Lead",
            "department": "Marketing",
            "salary": 130000,
            "performance_score": 8.7,
            "revenue_generated": 820000,
            "status": "Active",
            "skills": ["CAC Reduction", "Funnel Optimization", "Inbound Demand Gen", "Product-Led Growth"],
            "bio": "Reduced Customer Acquisition Cost (CAC) by 18% while expanding inbound pipeline for enterprise product lines."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Alexander Wright",
            "role": "Director of Strategic Accounts",
            "department": "Sales",
            "salary": 170000,
            "performance_score": 9.1,
            "revenue_generated": 1650000,
            "status": "Active",
            "skills": ["Strategic Alliances", "Cross-selling", "Enterprise Procurement"],
            "bio": "Expanded mid-market accounts into full enterprise contracts, securing $1.65M in expansion ARR."
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Samantha Lee",
            "role": "Lead DevOps & Vector Infrastructure Eng",
            "department": "Engineering",
            "salary": 165000,
            "performance_score": 9.3,
            "revenue_generated": 600000,
            "status": "Active",
            "skills": ["Supabase pgvector", "Kubernetes", "Low Latency API", "LLM Scaling"],
            "bio": "Optimized vector search indexing latency below 20ms, sustaining 99.99% uptime for enterprise RAG features."
        }
    ]

    print(f"\n[1/3] Ingesting {len(dummy_employees)} Employee Profiles into Database & Auto-Vectorizing...")
    for emp in dummy_employees:
        db.add_employee(emp, auto_embed=True)
        print(f"  • Added & Vectorized Employee: {emp['name']} ({emp['role']}) - ${emp['revenue_generated']:,.2f} ARR")

    # 2. EXPANDED KNOWLEDGE BASE DOCUMENTS (RAG CHUNKS)
    dummy_documents = [
        {
            "title": "FY26 Enterprise Sales Expansion Playbook",
            "category": "revenue_strategy",
            "content": "Enterprise Sales Strategy: Focus on accounts with > 500 seats. Offer a 60-day proof-of-concept (POC) featuring custom LangGraph workflows. Sarah Jenkins and Alexander Wright to lead tier 1 enterprise pitches. Target average contract value (ACV): $150,000 ARR.",
            "source_type": "playbook"
        },
        {
            "title": "SaaS Churn Early Warning & Account Retention Protocol",
            "category": "revenue_strategy",
            "content": "Account Churn Prevention Directive: Elena Rostova's CS team monitors weekly vector search API queries. Accounts showing > 30% drop in active seats receive automated executive outreach and a free technical optimization session. Target gross revenue churn: < 1.5%.",
            "source_type": "sop_doc"
        },
        {
            "title": "Leroy AI Monetization & Pricing Tier Matrix",
            "category": "pricing_policy",
            "content": "Product Tier Breakdown: 1. Standard Tier ($99/seat/mo): Core telemetry dashboard. 2. Pro Vector Tier ($249/seat/mo): Includes Supabase pgvector search & automated copilot. 3. Enterprise Tier ($499/seat/mo): Custom LangGraph multi-agent workflows, dedicated Supabase DB instance, 24/7 SLA.",
            "source_type": "pricing_policy"
        },
        {
            "title": "Competitive Intelligence & Market Positioning",
            "category": "market_benchmarks",
            "content": "Market Benchmark: Leroy AI maintains a 14.7x LTV/CAC ratio compared to industry average of 4.2x. Key differentiator: Seamless integration of human capital performance metrics with live revenue RAG intelligence.",
            "source_type": "benchmark"
        }
    ]

    print(f"\n[2/3] Ingesting {len(dummy_documents)} Enterprise Knowledge Base Vector Documents...")
    for doc in dummy_documents:
        db.add_knowledge_document(
            title=doc["title"],
            category=doc["category"],
            content=doc["content"],
            source_type=doc["source_type"]
        )
        print(f"  • Embedded Vector Doc: [{doc['category'].upper()}] {doc['title']}")

    # 3. COMPANY OVERVIEW PDF INGESTION
    print("\n[3/3] Generating Company Overview PDF & Auto-Ingesting PDF Vectors...")
    create_company_pdf()

    print("\n" + "=" * 65)
    print("  [SUCCESS] DUMMY DATASET INGESTION COMPLETED SUCCESSFULLY!")
    print("  All employees, metrics, strategy docs & company PDF vectors are live!")
    print("=" * 65)

if __name__ == "__main__":
    ingest_all_dummy_data()
