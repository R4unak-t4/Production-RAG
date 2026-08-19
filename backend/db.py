import json
import uuid
import math
import numpy as np
from typing import List, Dict, Any, Optional
from config import settings

# Attempt importing Supabase SDK
try:
    from supabase import create_client, Client
    supabase_available = True
except ImportError:
    supabase_available = False

# Local embedding model initialization
try:
    from sentence_transformers import SentenceTransformer
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"[Leroy AI DB] SentenceTransformer loaded with mock fallback: {e}")
    embedding_model = None


def generate_embedding(text: str) -> List[float]:
    """Generates a 384-dimensional vector embedding for the input text."""
    if embedding_model is not None:
        try:
            vec = embedding_model.encode(text)
            return vec.tolist()
        except Exception as err:
            print(f"[Leroy AI DB] Embedding generation fallback: {err}")

    # Fallback deterministic pseudo-embedding vector (384 dimensions)
    rng = np.random.RandomState(abs(hash(text)) % (2**31))
    vec = rng.randn(384)
    norm = np.linalg.norm(vec)
    return (vec / norm).tolist()


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Computes cosine similarity between two 384-d vectors."""
    a = np.array(v1)
    b = np.array(v2)
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))


class DatabaseManager:
    def __init__(self):
        self.supabase: Optional[Any] = None
        self.use_supabase = False
        
        if settings.is_supabase_configured and supabase_available:
            try:
                self.supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self.use_supabase = True
                print("[Leroy AI DB] Connected to Supabase pgvector instance successfully!")
            except Exception as e:
                print(f"[Leroy AI DB] Supabase connection failed, falling back to local store: {e}")

        # In-Memory Resilient Fallback Storage
        self._employees: List[Dict[str, Any]] = []
        self._revenue_metrics: List[Dict[str, Any]] = []
        self._knowledge_documents: List[Dict[str, Any]] = []
        self.seed_initial_data()

    def seed_initial_data(self):
        """Initializes default seed records for demo execution."""
        if self._employees:
            return

        initial_employees = [
            {
                "id": str(uuid.uuid4()),
                "name": "Sarah Jenkins",
                "role": "VP of Enterprise Sales",
                "department": "Sales",
                "salary": 185000,
                "performance_score": 9.6,
                "revenue_generated": 2450000,
                "status": "Active",
                "skills": ["Enterprise Closing", "ARR Expansion", "Contract Negotiation", "SaaS Strategy"],
                "bio": "Lead closed $2.45M ARR in FY26 Q1-Q2 across Fortune 500 accounts. Specialist in multi-year contract expansion."
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
                "bio": "Maintained 118% Net Retention Rate (NRR) across key mid-market accounts. Increased account expansion velocity."
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
            }
        ]

        for emp in initial_employees:
            self.add_employee(emp, auto_embed=True)

        initial_metrics = [
            {
                "id": str(uuid.uuid4()),
                "period": "2026-Q2 Current",
                "arr": 4850000.00,
                "mrr": 404166.67,
                "churn_rate": 1.80,
                "net_retention": 118.5,
                "cac": 8500.00,
                "ltv": 125000.00,
                "notes": "Strong enterprise adoption driven by new RAG co-pilot add-on tier. LTV/CAC ratio stands at healthy 14.7x."
            },
            {
                "id": str(uuid.uuid4()),
                "period": "2026-Q1 Prior",
                "arr": 4200000.00,
                "mrr": 350000.00,
                "churn_rate": 2.30,
                "net_retention": 112.0,
                "cac": 9200.00,
                "ltv": 105000.00,
                "notes": "Quarterly benchmark before introducing annual contract lock-in & optimized usage-based billing."
            }
        ]
        self._revenue_metrics = initial_metrics

        # Initial Knowledge Documents (RAG)
        initial_docs = [
            {
                "id": str(uuid.uuid4()),
                "title": "Q2 2026 Revenue Optimization Playbook",
                "category": "revenue_strategy",
                "content": "To accelerate ARR growth from $4.85M to $6.5M in FY26, Leroy AI recommends: 1. Shifting 30% of mid-market tier to automated annual expansion contracts. 2. Implementing dynamic seats pricing based on high-frequency RAG feature usage. 3. Target top 10 enterprise accounts with customized solution engineering led by Sarah Jenkins and David Chen to capture $1.2M in pipeline expansion.",
                "source_type": "policy_doc"
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Employee Revenue Impact & Sales Incentive Matrix",
                "category": "employee_intel",
                "content": "Sales incentive structure: Enterprise Reps (e.g. Sarah Jenkins) receive 12% commission on expansion ARR exceeding baseline quota. Solutions Engineers (David Chen) receive 4% co-sell bonus for closed AI pilots. Customer Success Reps (Elena Rostova) earn retention bonuses when account NRR surpasses 115%.",
                "source_type": "hr_policy"
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Pricing & Tiering Optimization Framework",
                "category": "pricing_policy",
                "content": "Leroy AI Tier Structure: Standard ($99/seat/mo), Pro ($249/seat/mo including vector search), Enterprise ($499/seat/mo including custom LangGraph workflow agents and dedicated Supabase pgvector instances). Enterprise accounts show 98% retention rate and 15.2x LTV/CAC.",
                "source_type": "pricing_matrix"
            }
        ]

        for doc in initial_docs:
            self.add_knowledge_document(
                title=doc["title"],
                category=doc["category"],
                content=doc["content"],
                source_type=doc["source_type"]
            )

    # --- EMPLOYEE MANAGEMENT ---
    def get_employees(self) -> List[Dict[str, Any]]:
        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("employees").select("*").execute()
                return res.data
            except Exception as e:
                print(f"[Leroy AI DB] Supabase get_employees error: {e}")
        return self._employees

    def add_employee(self, emp_data: Dict[str, Any], auto_embed: bool = True) -> Dict[str, Any]:
        if "id" not in emp_data or not emp_data["id"]:
            emp_data["id"] = str(uuid.uuid4())
        
        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("employees").insert(emp_data).execute()
                inserted = res.data[0] if res.data else emp_data
            except Exception as e:
                print(f"[Leroy AI DB] Supabase add_employee error: {e}")
                inserted = emp_data
                self._employees.append(emp_data)
        else:
            self._employees.append(emp_data)
            inserted = emp_data

        # Auto-Feed Employee metadata into Knowledge Base for Chatbot RAG!
        if auto_embed:
            emp_bio_doc = (
                f"Employee Profile: {inserted['name']} | Role: {inserted['role']} | "
                f"Department: {inserted['department']} | Revenue Contribution: ${inserted.get('revenue_generated', 0):,.2f} | "
                f"Performance Rating: {inserted.get('performance_score', 8.5)}/10. "
                f"Skills: {', '.join(inserted.get('skills', []))}. "
                f"Background & Achievements: {inserted.get('bio', '')}"
            )
            self.add_knowledge_document(
                title=f"Employee Intel - {inserted['name']}",
                category="employee_intel",
                content=emp_bio_doc,
                metadata={"employee_id": inserted["id"], "department": inserted["department"]},
                source_type="employee_profile"
            )

        return inserted

    def update_employee(self, emp_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("employees").update(updates).eq("id", emp_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Leroy AI DB] Supabase update_employee error: {e}")

        for i, emp in enumerate(self._employees):
            if emp["id"] == emp_id:
                self._employees[i].update(updates)
                return self._employees[i]
        return None

    def delete_employee(self, emp_id: str) -> bool:
        if self.use_supabase and self.supabase:
            try:
                self.supabase.table("employees").delete().eq("id", emp_id).execute()
            except Exception as e:
                print(f"[Leroy AI DB] Supabase delete_employee error: {e}")

        self._employees = [e for e in self._employees if e["id"] != emp_id]
        return True

    # --- REVENUE METRICS ---
    def get_revenue_metrics(self) -> List[Dict[str, Any]]:
        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("revenue_metrics").select("*").execute()
                return res.data
            except Exception as e:
                print(f"[Leroy AI DB] Supabase get_revenue_metrics error: {e}")
        return self._revenue_metrics

    # --- KNOWLEDGE BASE & PGVECTOR RAG ---
    def add_knowledge_document(
        self,
        title: str,
        category: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        source_type: str = "document"
    ) -> Dict[str, Any]:
        embedding_vec = generate_embedding(content)
        doc_id = str(uuid.uuid4())
        doc_item = {
            "id": doc_id,
            "title": title,
            "category": category,
            "content": content,
            "embedding": embedding_vec,
            "metadata": metadata or {},
            "source_type": source_type
        }

        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("knowledge_documents").insert(doc_item).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Leroy AI DB] Supabase add_knowledge_document error: {e}")

        self._knowledge_documents.append(doc_item)
        return doc_item

    def get_all_knowledge_documents(self) -> List[Dict[str, Any]]:
        if self.use_supabase and self.supabase:
            try:
                res = self.supabase.table("knowledge_documents").select("id, title, category, content, metadata, source_type, created_at").execute()
                return res.data
            except Exception as e:
                print(f"[Leroy AI DB] Supabase get_all_knowledge_documents error: {e}")

        # Return local docs omitting huge raw vector floats for list API
        return [
            {
                "id": d["id"],
                "title": d["title"],
                "category": d["category"],
                "content": d["content"],
                "metadata": d["metadata"],
                "source_type": d["source_type"]
            }
            for d in self._knowledge_documents
        ]

    def search_vector_documents(self, query: str, limit: int = 4, category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Vector similarity search over Knowledge Base using pgvector or local cosine similarity."""
        query_vec = generate_embedding(query)

        if self.use_supabase and self.supabase:
            try:
                rpc_params = {
                    "query_embedding": query_vec,
                    "match_count": limit,
                    "filter_category": category_filter
                }
                res = self.supabase.rpc("match_documents", rpc_params).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[Leroy AI DB] Supabase RPC match_documents error: {e}")

        # Local Cosine Similarity Fallback
        results = []
        for doc in self._knowledge_documents:
            if category_filter and doc.get("category") != category_filter:
                continue
            sim = cosine_similarity(query_vec, doc.get("embedding", []))
            results.append({
                "id": doc["id"],
                "title": doc["title"],
                "category": doc["category"],
                "content": doc["content"],
                "similarity": round(sim, 4),
                "source_type": doc.get("source_type", "document"),
                "metadata": doc.get("metadata", {})
            })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]


db = DatabaseManager()
