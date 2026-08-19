import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def generate_pdf():
    pdf_filename = r"e:\Production RAG\Leroy_AI_Architecture_and_Vector_RAG_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Colors
    primary_color = colors.HexColor("#0d121d")
    amber_color = colors.HexColor("#d97706")
    cyan_color = colors.HexColor("#0284c7")
    text_color = colors.HexColor("#1f2937")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=amber_color,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=cyan_color,
        alignment=TA_CENTER,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=amber_color,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code',
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

    # Title
    story.append(Paragraph("LEROY AI // ARCHITECTURE & VECTOR RAG TECHNICAL GUIDE", title_style))
    story.append(Paragraph("How Embeddings, Knowledge Base Data Collection & Supabase pgvector Work", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=amber_color, spaceAfter=15))

    # Section 1: End to End Architecture
    story.append(Paragraph("1. End-to-End System Execution Flow", h1_style))
    story.append(Paragraph(
        "When an executive types a query into Leroy AI (e.g. <i>'Which sales rep generated the highest ARR?'</i>), "
        "the request travels through a 4-step <b>LangGraph StateGraph Execution Pipeline</b>:<br/>"
        "1. <b>Intent Router Node</b>: Classifies query into <code>EMPLOYEE_HR</code>, <code>REVENUE_OPTIMIZATION</code>, or <code>GREETING</code>.<br/>"
        "2. <b>Vector Retriever Node</b>: Converts query text into a 384-dimensional dense vector and executes Cosine Similarity search over Supabase <code>pgvector</code>.<br/>"
        "3. <b>Telemetry Analytics Node</b>: Aggregates real-time financial metrics ($4.85M ARR, $404K MRR, 118.5% NRR).<br/>"
        "4. <b>Groq LLM Generator Node</b>: Formulates structured Bloomberg-style executive markdown using Groq LLaMA-3.3-70B.",
        body_style
    ))

    # Section 2: Embeddings Generation
    story.append(Paragraph("2. How Vector Embeddings Are Generated", h1_style))
    story.append(Paragraph(
        "<b>Vector embeddings</b> convert unstructured text (sentences, paragraphs, PDFs, employee bios) into a 384-dimensional dense float vector array "
        "where semantically similar concepts sit close together in vector space.<br/><br/>"
        "• <b>Model Used</b>: <code>SentenceTransformer('all-MiniLM-L6-v2')</code><br/>"
        "• <b>Output Vector Dimensions</b>: 384 floats per text chunk (e.g. <code>[-0.0245, 0.0812, 0.0394, ...]</code>)<br/>"
        "• <b>Speed & Latency</b>: ~5ms per chunk.",
        body_style
    ))
    story.append(Paragraph("# Python Code (backend/db.py)\nfrom sentence_transformers import SentenceTransformer\nmodel = SentenceTransformer('all-MiniLM-L6-v2')\n\ndef generate_embedding(text: str) -> list[float]:\n    return model.encode(text).tolist() # Returns 384-d vector", code_style))

    # Section 3: Knowledge Base Collection
    story.append(Paragraph("3. How Knowledge Base Data is Collected & Fed into RAG", h1_style))
    story.append(Paragraph(
        "Leroy AI collects and vectorizes data through <b>three automated pipelines</b>:<br/><br/>"
        "• <b>Pipeline 1: Integrated Employee Platform</b> — Creating or updating employees auto-generates a profile summary vector doc (role, salary, $ ARR impact, skills, bio) inserted into Supabase.<br/>"
        "• <b>Pipeline 2: Direct Document Upload API</b> — Uploading strategy playbooks via <code>/api/knowledge</code> converts text into 384-d vector chunks.<br/>"
        "• <b>Pipeline 3: Corporate PDF Ingestion</b> — Corporate strategy PDFs (ReportLab/PyPDF) are parsed into chunks and embedded into Supabase <code>knowledge_documents</code> table.",
        body_style
    ))

    # Section 4: Supabase pgvector Mechanics
    story.append(Paragraph("4. How Things Work in Supabase pgvector", h1_style))
    story.append(Paragraph(
        "Supabase operates on <b>PostgreSQL</b> with the official <b><code>pgvector</code> extension</b> enabled.<br/><br/>"
        "1. <b>Vector Column</b>: <code>knowledge_documents</code> table includes an <code>embedding vector(384)</code> column.<br/>"
        "2. <b>IVFFlat Indexing</b>: Fast cosine distance search (<code>USING ivfflat (embedding vector_cosine_ops)</code>).<br/>"
        "3. <b>Cosine Similarity Search</b>: Stored function <code>match_documents(query_embedding, match_count)</code> calculates similarity score as <code>1 - (embedding <=> query_embedding)</code>.<br/>"
        "4. <b>Row Level Security (RLS)</b>: Disabled on dev tables (<code>ALTER TABLE ... DISABLE ROW LEVEL SECURITY</code>) to allow anon API access.",
        body_style
    ))

    # Summary Table
    story.append(Paragraph("5. Leroy AI Core Concepts Matrix", h1_style))
    summary_data = [
        [Paragraph("<b>Concept</b>", body_style), Paragraph("<b>Implementation</b>", body_style)],
        [Paragraph("LLM Engine", body_style), Paragraph("Groq API (LLaMA-3.3-70B-Versatile)", body_style)],
        [Paragraph("Agentic Pipeline", body_style), Paragraph("LangGraph StateGraph Workflow (Router -> Retriever -> Analytics -> Gen)", body_style)],
        [Paragraph("Embedding Model", body_style), Paragraph("SentenceTransformer ('all-MiniLM-L6-v2') 384-D", body_style)],
        [Paragraph("Vector Database", body_style), Paragraph("Supabase PostgreSQL + pgvector extension", body_style)],
        [Paragraph("Similarity Operator", body_style), Paragraph("Cosine Similarity via <=> operator (1 - distance)", body_style)],
        [Paragraph("UI Design System", body_style), Paragraph("Bloomberg Terminal theme (React + Vite + JetBrains Mono)", body_style)]
    ]
    t = Table(summary_data, colWidths=[150, 380])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)

    doc.build(story)
    print(f"Architecture PDF generated at: {pdf_filename}")

if __name__ == "__main__":
    generate_pdf()
