from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn

from config import settings
from db import db, generate_embedding
from rag_agent import execute_leroy_agent

app = FastAPI(
    title="Leroy AI API Engine",
    description="Bloomberg-grade Revenue Optimization & Employee Knowledge Platform API",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST / RESPONSE MODELS ---
class ChatRequest(BaseModel):
    query: str = Field(..., example="Which employee drives the highest revenue in Sales?")

class EmployeeCreate(BaseModel):
    name: str = Field(..., example="Alexander Vance")
    role: str = Field(..., example="Director of Sales")
    department: str = Field(..., example="Sales")
    salary: float = Field(..., example=165000.0)
    performance_score: float = Field(default=8.5, example=9.0)
    revenue_generated: float = Field(default=0.0, example=1500000.0)
    status: str = Field(default="Active", example="Active")
    skills: List[str] = Field(default_factory=list, example=["Enterprise SaaS", "Deal Closing"])
    bio: Optional[str] = Field(default="", example="10+ years closing strategic ARR contracts.")

class KnowledgeCreate(BaseModel):
    title: str = Field(..., example="Q3 Upsell Strategy")
    category: str = Field(..., example="revenue_strategy")
    content: str = Field(..., example="Target enterprise accounts using automated RAG demo workflows.")
    source_type: str = Field(default="document", example="strategy_doc")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


# --- ROUTE ENDPOINTS ---

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "title": "Leroy AI Platform Engine",
        "groq_configured": settings.is_groq_configured,
        "supabase_configured": settings.is_supabase_configured,
        "active_db": "Supabase pgvector" if db.use_supabase else "Resilient In-Memory Vector Store",
        "embedding_dimensions": 384
    }

@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = execute_leroy_agent(payload.query)
    return result

@app.get("/api/employees")
def get_employees():
    employees = db.get_employees()
    return {"employees": employees, "count": len(employees)}

@app.post("/api/employees")
def create_employee(emp: EmployeeCreate):
    emp_dict = emp.model_dump()
    created = db.add_employee(emp_dict, auto_embed=True)
    return {
        "message": "Employee created and auto-indexed into RAG Vector Knowledge Base successfully!",
        "employee": created
    }

@app.put("/api/employees/{emp_id}")
def update_employee(emp_id: str, updates: Dict[str, Any]):
    updated = db.update_employee(emp_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return {"message": "Employee updated successfully.", "employee": updated}

@app.delete("/api/employees/{emp_id}")
def delete_employee(emp_id: str):
    success = db.delete_employee(emp_id)
    return {"message": "Employee deleted successfully.", "success": success}

@app.get("/api/revenue")
def get_revenue():
    metrics = db.get_revenue_metrics()
    latest = metrics[0] if metrics else {}
    return {
        "metrics": metrics,
        "summary": {
            "arr": latest.get("arr", 4850000),
            "mrr": latest.get("mrr", 404166),
            "churn_rate": latest.get("churn_rate", 1.8),
            "net_retention": latest.get("net_retention", 118.5),
            "cac": latest.get("cac", 8500),
            "ltv": latest.get("ltv", 125000)
        }
    }

@app.get("/api/knowledge")
def get_knowledge_documents():
    docs = db.get_all_knowledge_documents()
    return {"documents": docs, "count": len(docs)}

@app.post("/api/knowledge")
def create_knowledge_document(doc: KnowledgeCreate):
    created = db.add_knowledge_document(
        title=doc.title,
        category=doc.category,
        content=doc.content,
        metadata=doc.metadata,
        source_type=doc.source_type
    )
    return {
        "message": "Document uploaded and embedded into pgvector knowledge base!",
        "document": {
            "id": created["id"],
            "title": created["title"],
            "category": created["category"],
            "content": created["content"]
        }
    }

@app.post("/api/seed")
def reseed_data():
    db.seed_initial_data()
    return {"message": "Initial enterprise dataset reseeded successfully!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
