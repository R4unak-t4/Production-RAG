-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Employees Table (Integrated Platform & RAG Vector Feed)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary NUMERIC(12, 2) NOT NULL,
    performance_score NUMERIC(4, 2) DEFAULT 8.5,
    revenue_generated NUMERIC(14, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active',
    skills TEXT[] DEFAULT '{}',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Revenue Metrics Table
CREATE TABLE IF NOT EXISTS revenue_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period VARCHAR(50) NOT NULL, -- e.g., '2026-Q1', '2026-Q2'
    arr NUMERIC(14, 2) NOT NULL,
    mrr NUMERIC(14, 2) NOT NULL,
    churn_rate NUMERIC(5, 2) NOT NULL,
    net_retention NUMERIC(5, 2) NOT NULL,
    cac NUMERIC(10, 2) NOT NULL,
    ltv NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vector Knowledge Base Table (pgvector)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'revenue_strategy', 'employee_intel', 'pricing_policy', 'market_benchmarks'
    content TEXT NOT NULL,
    embedding vector(384), -- 384 dimensions for all-MiniLM-L6-v2 embeddings
    metadata JSONB DEFAULT '{}'::jsonb,
    source_type VARCHAR(50) DEFAULT 'document', -- 'document', 'employee_profile', 'revenue_report'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on tables to allow direct public API access with anon key
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents DISABLE ROW LEVEL SECURITY;

-- Index for Fast Cosine Vector Distance Search
CREATE INDEX IF NOT EXISTS knowledge_docs_embedding_idx 
ON knowledge_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Match Documents RPC Function for RAG Queries
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(384),
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  category VARCHAR(100),
  content TEXT,
  similarity float,
  metadata JSONB,
  source_type VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kd.id,
    kd.title,
    kd.category,
    kd.content,
    1 - (kd.embedding <=> query_embedding) AS similarity,
    kd.metadata,
    kd.source_type
  FROM knowledge_documents kd
  WHERE (filter_category IS NULL OR kd.category = filter_category)
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
