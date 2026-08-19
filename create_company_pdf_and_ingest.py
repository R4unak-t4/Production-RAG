import os
import sys
import uuid

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from db import db

def create_company_pdf():
    pdf_filename = r"e:\Production RAG\Company_Overview_and_Knowledge_Base.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Colors
    title_color = colors.HexColor("#0d121d")
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
        textColor=title_color,
        spaceBefore=12,
        spaceAfter=6
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

    # Title & Subtitle
    story.append(Paragraph("LEROY AI TECHNOLOGIES // COMPANY KNOWLEDGE BASE", title_style))
    story.append(Paragraph("Enterprise Profile, Product Tiering, Financial Benchmarks & Sales Strategy PDF", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=amber_color, spaceAfter=15))

    # 1. Company Profile
    story.append(Paragraph("1. Company Background & Mission", h1_style))
    sec1_text = (
        "Leroy AI Technologies Inc. is a high-growth B2B enterprise software provider specializing in AI-driven "
        "Revenue Optimization and Human Capital Intelligence. Founded in 2024, Leroy AI combines real-time financial telemetry "
        "with vector retrieval augmented generation (RAG) to help executive leadership teams maximize Annual Recurring Revenue (ARR) "
        "and optimize employee performance."
    )
    story.append(Paragraph(sec1_text, body_style))

    # 2. Products & Pricing
    story.append(Paragraph("2. Product Offerings & Monetization Model", h1_style))
    pricing_data = [
        [Paragraph("<b>Product Tier</b>", body_style), Paragraph("<b>Monthly Pricing</b>", body_style), Paragraph("<b>Core Features</b>", body_style)],
        [Paragraph("Standard Tier", body_style), Paragraph("$99 / seat / mo", body_style), Paragraph("Core Revenue dashboard, basic telemetry, ARR metrics tracking.", body_style)],
        [Paragraph("Pro Vector Tier", body_style), Paragraph("$249 / seat / mo", body_style), Paragraph("Includes Supabase pgvector search, automated RAG copilot, vector document ingestion.", body_style)],
        [Paragraph("Enterprise Tier", body_style), Paragraph("$499 / seat / mo", body_style), Paragraph("Dedicated Supabase pgvector DB, custom LangGraph multi-agent workflows, executive SLAs.", body_style)]
    ]
    t = Table(pricing_data, colWidths=[110, 110, 310])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # 3. Financial Performance & Targets
    story.append(Paragraph("3. Financial Telemetry & Target Benchmarks", h1_style))
    sec3_text = (
        "As of FY26 Q2, Leroy AI achieved $4,850,000 in Annual Recurring Revenue (ARR) and $404,166 in Monthly Recurring Revenue (MRR). "
        "Target ARR for FY26 Q4 is $6,500,000 (+34% growth). Current Customer Lifetime Value (LTV) is $125,000 against a Customer "
        "Acquisition Cost (CAC) of $8,500, producing a healthy LTV/CAC ratio of 14.7x. Net Revenue Retention (NRR) stands at 118.5%, "
        "while Gross Churn remains low at 1.8%."
    )
    story.append(Paragraph(sec3_text, body_style))

    # 4. Human Capital Intel
    story.append(Paragraph("4. Key Executive Team & Revenue Impact", h1_style))
    emp_data = [
        [Paragraph("<b>Name & Title</b>", body_style), Paragraph("<b>Department</b>", body_style), Paragraph("<b>Revenue Generated ($ ARR)</b>", body_style), Paragraph("<b>Key Achievement</b>", body_style)],
        [Paragraph("Sarah Jenkins (VP Sales)", body_style), Paragraph("Sales", body_style), Paragraph("$2,450,000.00", body_style), Paragraph("Closed Fortune 500 multi-year expansion contracts.", body_style)],
        [Paragraph("Marcus Vance (Revenue Architect)", body_style), Paragraph("Strategy & Ops", body_style), Paragraph("$1,800,000.00", body_style), Paragraph("Designed usage pricing that lowered churn by 2.4%.", body_style)],
        [Paragraph("Elena Rostova (Head of CS)", body_style), Paragraph("Customer Success", body_style), Paragraph("$1,200,000.00", body_style), Paragraph("Maintained 118.5% Net Retention Rate (NRR).", body_style)],
        [Paragraph("David Chen (Principal AI Eng)", body_style), Paragraph("Engineering", body_style), Paragraph("$950,000.00", body_style), Paragraph("Engineered LangGraph copilot driving 35% upsell conversion.", body_style)]
    ]
    t2 = Table(emp_data, colWidths=[140, 90, 120, 180])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    story.append(Spacer(1, 10))

    # 5. Strategic Directives
    story.append(Paragraph("5. Q3-Q4 Growth Strategy & Sales Directives", h1_style))
    sec5_text = (
        "1. Transition 25% of monthly recurring subscribers to annual prepaid contracts with a 10% discount to unlock $650K ARR in predictable cash flow.<br/>"
        "2. Co-selling Protocol: Pair David Chen (Principal AI Engineer) with Sarah Jenkins on enterprise deals over $250K ARR to showcase custom vector RAG integrations.<br/>"
        "3. Churn Early Warning System: Trigger automated onboarding check-in when customer seat activity falls below 40% threshold."
    )
    story.append(Paragraph(sec5_text, body_style))

    doc.build(story)
    print(f"[PDF Generator] Company PDF created: {pdf_filename}")

    # --- AUTO-INGEST CONTENT INTO VECTOR KNOWLEDGE BASE ---
    print("[RAG Ingestion] Auto-embedding Company PDF sections into Supabase pgvector knowledge base...")

    knowledge_chunks = [
        {
            "title": "Company Overview - Leroy AI Technologies Profile",
            "category": "company_info",
            "content": sec1_text,
            "source_type": "company_pdf"
        },
        {
            "title": "Leroy AI Product Tiering & Pricing Matrix",
            "category": "pricing_policy",
            "content": "Leroy AI Offerings: Standard Tier ($99/seat/mo for basic telemetry), Pro Vector Tier ($249/seat/mo with Supabase pgvector search & RAG copilot), Enterprise Tier ($499/seat/mo with custom LangGraph multi-agent workflows and dedicated Supabase DB instances).",
            "source_type": "company_pdf"
        },
        {
            "title": "Financial Telemetry & ARR Growth Targets",
            "category": "revenue_strategy",
            "content": sec3_text,
            "source_type": "company_pdf"
        },
        {
            "title": "Executive Human Capital Impact Matrix",
            "category": "employee_intel",
            "content": "Top Executive Contributor: Sarah Jenkins (VP Sales) closed $2.45M ARR in Fortune 500 accounts. Marcus Vance (Lead Revenue Architect) generated $1.8M ARR by optimizing pricing tiers. Elena Rostova (Head of CS) maintains 118.5% NRR with $1.2M ARR. David Chen (Principal AI Engineer) drove $950K ARR via LangGraph copilot features.",
            "source_type": "company_pdf"
        },
        {
            "title": "Q3-Q4 Growth Strategy & Enterprise Co-selling",
            "category": "revenue_strategy",
            "content": sec5_text,
            "source_type": "company_pdf"
        }
    ]

    for chunk in knowledge_chunks:
        db.add_knowledge_document(
            title=chunk["title"],
            category=chunk["category"],
            content=chunk["content"],
            metadata={"source_file": "Company_Overview_and_Knowledge_Base.pdf"},
            source_type=chunk["source_type"]
        )

    print("[RAG Ingestion] Successfully ingested Company PDF chunks into Vector Store!")

if __name__ == "__main__":
    create_company_pdf()
