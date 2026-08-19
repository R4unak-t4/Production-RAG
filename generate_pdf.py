import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def generate_pdf():
    pdf_filename = r"e:\Production RAG\Leroy_AI_Documentation_and_Setup_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    primary_color = colors.HexColor("#0d121d")
    amber_color = colors.HexColor("#d97706")
    cyan_color = colors.HexColor("#0284c7")
    green_color = colors.HexColor("#059669")
    text_color = colors.HexColor("#1f2937")

    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=amber_color,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=cyan_color,
        alignment=TA_CENTER,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=amber_color,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#111827"),
        backColor=colors.HexColor("#f3f4f6"),
        borderColor=colors.HexColor("#d1d5db"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("LEROY AI // SYSTEM DOCUMENTATION & SETUP GUIDE", title_style))
    story.append(Paragraph("Revenue Optimization & Employee Knowledge Platform (FastAPI + React + LangGraph + Supabase pgvector)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=amber_color, spaceAfter=15))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview", h1_style))
    story.append(Paragraph(
        "<b>Leroy AI</b> is an enterprise executive copilot platform designed for real-time revenue strategy optimization and human capital intelligence. "
        "Built with a high-density <b>Bloomberg Terminal UI</b>, it orchestrates multi-agent RAG pipelines using <b>LangGraph</b>, <b>LangChain</b>, "
        "<b>Groq LLaMA-3.3 LLM Engine</b>, and <b>Supabase pgvector</b>.",
        body_style
    ))

    # Technical Architecture Table
    story.append(Paragraph("2. Technical Stack Specifications", h1_style))
    stack_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology / Library</b>", body_style), Paragraph("<b>Role / Purpose</b>", body_style)],
        [Paragraph("Frontend UI", body_style), Paragraph("React 18, Vite, Lucide Icons, Recharts", body_style), Paragraph("Bloomberg Terminal theme with dark slate grid & live marquee", body_style)],
        [Paragraph("Backend Framework", body_style), Paragraph("FastAPI (Python 3.13), Uvicorn", body_style), Paragraph("REST API endpoints for chat, revenue, employees, knowledge", body_style)],
        [Paragraph("Agentic RAG", body_style), Paragraph("LangChain, LangGraph, Groq LLaMA-3.3-70B", body_style), Paragraph("Router, vector retriever, telemetry calculator & response generator", body_style)],
        [Paragraph("Vector Database", body_style), Paragraph("Supabase PostgreSQL + pgvector extension", body_style), Paragraph("384-dimensional vector similarity store with match_documents RPC", body_style)],
        [Paragraph("Embeddings Engine", body_style), Paragraph("SentenceTransformers (all-MiniLM-L6-v2)", body_style), Paragraph("384-d dense vector embeddings generation for RAG documents", body_style)]
    ]
    t = Table(stack_data, colWidths=[110, 190, 230])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Supabase Setup Guide
    story.append(Paragraph("3. Step-by-Step Supabase Setup Guide", h1_style))
    story.append(Paragraph("<b>Step 3.1: Create a Free Supabase Project</b>", h2_style))
    story.append(Paragraph("1. Go to <font color='#0284c7'><u>https://supabase.com</u></font> and sign in.<br/>2. Click <b>New Project</b>, select your organization, set a database password, and create the project.", body_style))
    
    story.append(Paragraph("<b>Step 3.2: Obtain Supabase Credentials</b>", h2_style))
    story.append(Paragraph("1. In your project dashboard, navigate to <b>Project Settings &gt; API</b>.<br/>2. Copy your <b>Project URL</b> (e.g., <code>https://xyz.supabase.co</code>).<br/>3. Copy your <b>anon public API Key</b> (starts with <code>eyJ...</code>).", body_style))

    story.append(Paragraph("<b>Step 3.3: Execute pgvector SQL Migration</b>", h2_style))
    story.append(Paragraph("1. In Supabase Dashboard, click <b>SQL Editor</b> on the left menu.<br/>2. Open the project file <code>backend/supabase_schema.sql</code> and paste its contents into the SQL Editor.<br/>3. Click <b>Run</b>. This will enable the <code>pgvector</code> extension, create tables (<code>employees</code>, <code>revenue_metrics</code>, <code>knowledge_documents</code>), and register the vector search function <code>match_documents</code>.", body_style))

    story.append(Paragraph("-- Supabase SQL Schema Snippet --<br/>CREATE EXTENSION IF NOT EXISTS vector;<br/>CREATE TABLE IF NOT EXISTS knowledge_documents (<br/>  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),<br/>  title VARCHAR(255) NOT NULL,<br/>  category VARCHAR(100) NOT NULL,<br/>  content TEXT NOT NULL,<br/>  embedding vector(384)<br/>);", code_style))

    # Groq Setup Guide
    story.append(Paragraph("4. Step-by-Step Groq API Setup Guide", h1_style))
    story.append(Paragraph("<b>Step 4.1: Get a Free Groq API Key</b>", h2_style))
    story.append(Paragraph("1. Go to <font color='#0284c7'><u>https://console.groq.com</u></font> and log in.<br/>2. Click <b>API Keys</b> in the sidebar menu.<br/>3. Click <b>Create API Key</b>, give it a name (e.g. <code>leroy-ai</code>), and copy the generated key (starts with <code>gsk_...</code>).", body_style))

    # Environment Setup
    story.append(Paragraph("5. Environment Configuration (.env)", h1_style))
    story.append(Paragraph("Open <code>e:\\Production RAG\\backend\\.env</code> and populate your credentials:", body_style))
    story.append(Paragraph("# Leroy AI Production Credentials<br/>GROQ_API_KEY=gsk_your_actual_groq_api_key_here<br/>GROQ_MODEL=llama-3.3-70b-versatile<br/><br/>SUPABASE_URL=https://your-project.supabase.co<br/>SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_supabase_anon_key<br/><br/>PORT=8000<br/>HOST=0.0.0.0", code_style))

    # Running Application
    story.append(Paragraph("6. Launching Leroy AI", h1_style))
    story.append(Paragraph("<b>Run Backend Server:</b>", h2_style))
    story.append(Paragraph("<code>cd \"e:\\Production RAG\\backend\"<br/>python -m uvicorn main:app --port 8000 --reload</code>", code_style))

    story.append(Paragraph("<b>Run Frontend UI:</b>", h2_style))
    story.append(Paragraph("<code>cd \"e:\\Production RAG\\frontend\"<br/>npx vite --port 3000</code>", code_style))

    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb"), spaceBefore=15, spaceAfter=10))
    story.append(Paragraph("Generated automatically for Leroy AI Enterprise Platform // Version 2.4", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=9, textColor=colors.HexColor("#9ca3af"), alignment=TA_CENTER)))

    doc.build(story)
    print(f"PDF generated successfully at: {pdf_filename}")

if __name__ == "__main__":
    generate_pdf()
