import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    BG_LIGHT = RGBColor(248, 250, 252)       # Slate 50
    CARD_BG = RGBColor(255, 255, 255)        # Pure White
    CARD_ALT = RGBColor(241, 245, 249)       # Slate 100
    BORDER_COLOR = RGBColor(226, 232, 240)   # Slate 200
    NAVY_DARK = RGBColor(15, 23, 42)         # Slate 900
    NAVY_MUTED = RGBColor(51, 65, 85)        # Slate 700
    SLATE_BODY = RGBColor(71, 85, 105)       # Slate 600
    SLATE_LIGHT = RGBColor(148, 163, 184)    # Slate 400
    PRIMARY_BLUE = RGBColor(37, 99, 235)     # Blue 600
    PRIMARY_DARK = RGBColor(29, 78, 216)     # Blue 700
    PRIMARY_LIGHT = RGBColor(239, 246, 255)  # Blue 50
    EMERALD_GREEN = RGBColor(16, 185, 129)   # Emerald 500
    EMERALD_LIGHT = RGBColor(236, 253, 245)  # Emerald 50
    EMERALD_DARK = RGBColor(4, 120, 87)      # Emerald 700
    AMBER_DARK = RGBColor(180, 83, 9)        # Amber 700
    AMBER_LIGHT = RGBColor(254, 243, 199)    # Amber 100

    def set_slide_bg(slide, color=BG_LIGHT):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(5.0), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.bold = True
        p_tag.font.size = Pt(10)
        p_tag.font.color.rgb = PRIMARY_BLUE

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.bold = True
        p_title.font.size = Pt(22)
        p_title.font.color.rgb = NAVY_DARK

        # Subtitle
        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(0.4))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = SLATE_BODY

    # ==========================================
    # SLIDE 1: TITLE SLIDE (Clean Executive Cover)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1, RGBColor(255, 255, 255))

    # Top accent bar
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_BLUE
    top_bar.line.fill.background()

    # Title Card container
    c_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.333), Inches(4.5))
    tf1 = c_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "EXECUTIVE BUSINESS CASE  |  OPERATIONAL INTELLIGENCE"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = PRIMARY_BLUE
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "Meter Intelligence Platform"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = NAVY_DARK
    p1.space_after = Pt(10)

    p2 = tf1.add_paragraph()
    p2.text = "From Anomaly Detection to Confident Action: Unlocking Operational Efficiency and Revenue Protection"
    p2.font.size = Pt(18)
    p2.font.color.rgb = NAVY_MUTED
    p2.space_after = Pt(24)

    p3 = tf1.add_paragraph()
    p3.text = "An explainable triage engine with automated evidence assembly, human-governed resolution, and rapid ROI."
    p3.font.size = Pt(13)
    p3.font.color.rgb = SLATE_BODY
    p3.space_after = Pt(36)

    # 3 Pill Value Drivers on Cover
    drivers = [
        ("66% Triage Reduction", "Cuts manual investigation from 30m to 10m"),
        ("Avoided Field Dispatches", "Prevents unnecessary, costly truck rolls"),
        ("100% Audit Compliance", "Transparent, human-owned accountability")
    ]
    for i, (head, desc) in enumerate(drivers):
        left = Inches(1.0 + i * 3.85)
        shape = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(5.1), Inches(3.6), Inches(1.2))
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_ALT
        shape.line.color.rgb = BORDER_COLOR
        shape.line.width = Pt(1)
        
        tb = s1.shapes.add_textbox(left + Inches(0.15), Inches(5.2), Inches(3.3), Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = head
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = PRIMARY_DARK
        
        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = SLATE_BODY

    # Footer note
    f_box = s1.shapes.add_textbox(Inches(1.0), Inches(6.7), Inches(11.3), Inches(0.4))
    f_tf = f_box.text_frame
    p_f = f_tf.paragraphs[0]
    p_f.text = "Prepared for Executive Leadership  •  Business Case & 90-Day Pilot Proposal"
    p_f.font.size = Pt(10)
    p_f.font.color.rgb = SLATE_LIGHT

    # ==========================================
    # SLIDE 2: EXECUTIVE SUMMARY
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, "01 / Executive Summary", 
               "Transforming Smart Meter Alert Spikes into Decisive Business Value", 
               "Moving from unmanageable alert queues to automated, evidence-backed human review.")

    cards_s2 = [
        ("The Current Bottleneck", 
         "Operations face high volumes of raw meter flags with fragmented context. Analysts spend up to 30 minutes per ticket manually pulling history, weather, and billing records.",
         AMBER_LIGHT, AMBER_DARK),
        ("The Meter Intelligence Solution", 
         "An automated screening and evidence assembly platform. Synthesizes 90-day peer baselines and pre-populates actionable case dossiers in seconds—leaving final judgment to associates.",
         PRIMARY_LIGHT, PRIMARY_DARK),
        ("The Expected Business ROI", 
         "Returns ~333 operational hours per 1,000 cases, eliminates avoidable field dispatches ($150-$250/truck roll), accelerates dispute resolution, and secures unbilled revenue.",
         EMERALD_LIGHT, EMERALD_DARK)
    ]

    for i, (title, desc, fill_col, text_col) in enumerate(cards_s2):
        left = Inches(0.8 + i * 3.98)
        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(3.75), Inches(4.7))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        # Top banner within card
        banner = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.2), Inches(2.3), Inches(3.35), Inches(0.7))
        banner.fill.solid()
        banner.fill.fore_color.rgb = fill_col
        banner.line.fill.background()
        
        b_tb = s2.shapes.add_textbox(left + Inches(0.3), Inches(2.4), Inches(3.15), Inches(0.5))
        b_tf = b_tb.text_frame
        b_tf.word_wrap = True
        bp = b_tf.paragraphs[0]
        bp.text = title
        bp.font.bold = True
        bp.font.size = Pt(13)
        bp.font.color.rgb = text_col

        # Body text
        b_body = s2.shapes.add_textbox(left + Inches(0.25), Inches(3.2), Inches(3.25), Inches(3.3))
        tf_body = b_body.text_frame
        tf_body.word_wrap = True
        p_b = tf_body.paragraphs[0]
        p_b.text = desc
        p_b.font.size = Pt(12)
        p_b.font.color.rgb = NAVY_MUTED
        p_b.space_after = Pt(12)

        # Key takeaway
        p_takeaway = tf_body.add_paragraph()
        if i == 0:
            p_takeaway.text = "• 30 min avg. triage time\n• Backlog risks and alert fatigue\n• High cost of false truck rolls"
        elif i == 1:
            p_takeaway.text = "• 3σ peer-slot baseline filter\n• Automated evidence collation\n• 100% human-governed action"
        else:
            p_takeaway.text = "• 66% triage efficiency gain\n• Capacity returned: ~333 hrs/1k\n• Rapid 90-day pilot validation"
        p_takeaway.font.size = Pt(11)
        p_takeaway.font.color.rgb = SLATE_BODY

    # ==========================================
    # SLIDE 3: PROBLEM & BUSINESS DRIVERS
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, "02 / Business Problem & Drivers", 
               "The High Cost of Inaction in Smart Meter Anomaly Handling", 
               "Unfiltered meter signals create severe operational drag, unnecessary truck rolls, and billing exposure.")

    p_cards = [
        ("1. Operational Drag & Triage Fatigue",
         "30+ minutes wasted per anomaly",
         "Analysts juggle 4-5 legacy portals (AMI data, CIS billing, CRM, weather) just to determine if a spike is legitimate or benign."),
        ("2. Avoidable Field Dispatches",
         "$150 – $250 per wasted truck roll",
         "Prematurely escalating unvalidated meter anomalies to field teams wastes substantial fleet budget on non-faulty meters."),
        ("3. Delayed Dispute & Billing Resolution",
         "Customer dissatisfaction & bill shock",
         "Undetected anomalies fester until monthly billing, generating high-friction customer complaints and ombudsman escalations."),
        ("4. Scalability Bottleneck",
         "Alert volume outpaces headcount",
         "As smart meter rollouts expand, manual investigation cannot scale linearly without ballooning back-office labor expenditure.")
    ]

    for i, (title, stat, desc) in enumerate(p_cards):
        col = i % 2
        row = i // 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(2.1 + row * 2.4)
        
        c = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.75), Inches(2.2))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        tb = s3.shapes.add_textbox(left + Inches(0.3), top + Inches(0.2), Inches(5.15), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = NAVY_DARK

        p_stat = tf.add_paragraph()
        p_stat.text = stat
        p_stat.font.bold = True
        p_stat.font.size = Pt(12)
        p_stat.font.color.rgb = PRIMARY_BLUE
        p_stat.space_after = Pt(6)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = SLATE_BODY

    # ==========================================
    # SLIDE 4: THE SOLUTION OVERVIEW
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, "03 / Strategic Solution", 
               "An Explainable, Closed-Loop Intelligence Platform", 
               "Automating raw data synthesis so operations teams make faster, higher-confidence decisions.")

    pillars = [
        ("DETECT", "Transparent Screening", 
         "Filters raw 4-hour telemetry using a 90-day same-slot peer baseline (mean + 3σ).\n\nEliminates seasonal & time-of-day bias before alerts ever hit the queue.",
         PRIMARY_LIGHT, PRIMARY_DARK),
        ("INVESTIGATE", "AI-Assisted Dossier", 
         "Automatically synthesizes peer baseline, continuity checks, meter status, and billing markers into an explainable case summary.\n\nZeros out manual prep time.",
         CARD_ALT, NAVY_DARK),
        ("RESOLVE", "Human-in-the-Loop", 
         "Associates review enriched evidence, confirm root cause, and dispatch field actions or billing adjustments.\n\nMaintains 100% human accountability.",
         EMERALD_LIGHT, EMERALD_DARK)
    ]

    for i, (step, subtitle, text, fill_c, text_c) in enumerate(pillars):
        left = Inches(0.8 + i * 3.98)
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(3.75), Inches(4.7))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        # Header Pill
        hp = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.3), Inches(2.4), Inches(3.15), Inches(0.8))
        hp.fill.solid()
        hp.fill.fore_color.rgb = fill_c
        hp.line.fill.background()

        tb = s4.shapes.add_textbox(left + Inches(0.4), Inches(2.45), Inches(2.95), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = step
        p.font.bold = True
        p.font.size = Pt(14)
        p.font.color.rgb = text_c
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = text_c

        # Content
        tb2 = s4.shapes.add_textbox(left + Inches(0.3), Inches(3.4), Inches(3.15), Inches(3.2))
        tf2 = tb2.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = text
        p2.font.size = Pt(12)
        p2.font.color.rgb = NAVY_MUTED

    # ==========================================
    # SLIDE 5: WORKFLOW ARCHITECTURE & GOVERNANCE
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, "04 / Enterprise Architecture & Governance", 
               "Governed, Secure, and Audit-Ready from Day One", 
               "Clear separation between system evidence, automated reasoning, and associate-owned resolution.")

    # Top flow diagram boxes
    steps = [
        ("1. INGEST", "4-hour meter reads & consumption logs"),
        ("2. SCREEN", "Statistical 3σ peer-slot baseline filter"),
        ("3. ENRICH", "Billing, meter health & continuity checks"),
        ("4. PRESENT", "Unified case dossier in analyst queue"),
        ("5. RESOLVE", "Associate decision, audit trail & ERP update")
    ]
    for i, (title, sub) in enumerate(steps):
        left = Inches(0.8 + i * 2.38)
        s_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.0), Inches(2.25), Inches(1.3))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = PRIMARY_LIGHT if i < 4 else EMERALD_LIGHT
        s_box.line.color.rgb = PRIMARY_BLUE if i < 4 else EMERALD_DARK
        s_box.line.width = Pt(1)

        t_box = s5.shapes.add_textbox(left + Inches(0.1), Inches(2.1), Inches(2.05), Inches(1.1))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = PRIMARY_DARK if i < 4 else EMERALD_DARK

        p_desc = tf.add_paragraph()
        p_desc.text = sub
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = NAVY_MUTED

    # Governance Cards Bottom
    gov_cards = [
        ("No Black-Box Hallucinations", 
         "Rules are strictly data-grounded, deterministic, and version-controlled. If a data source is missing, the system explicitly reports 'needs-data' rather than guessing.",
         PRIMARY_BLUE),
        ("Immutable Audit Trail", 
         "Raw meter telemetry, system calculations, and associate notes remain strictly partitioned. Every status update, override, and disposition is logged for compliance.",
         NAVY_DARK),
        ("Role-Based Security", 
         "Built with enterprise security in mind: Row-Level Security (RLS), server-side protected credentials, and feature-gated write workflows.",
         EMERALD_DARK)
    ]
    for i, (title, desc, accent) in enumerate(gov_cards):
        left = Inches(0.8 + i * 3.98)
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(3.6), Inches(3.75), Inches(3.2))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        # accent strip on left
        strip = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(3.6), Inches(0.15), Inches(3.2))
        strip.fill.solid()
        strip.fill.fore_color.rgb = accent
        strip.line.fill.background()

        tb = s5.shapes.add_textbox(left + Inches(0.3), Inches(3.8), Inches(3.2), Inches(2.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = NAVY_DARK
        p.space_after = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = SLATE_BODY

    # ==========================================
    # SLIDE 6: BUSINESS VALUE & ROI MODEL
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, "05 / Quantified Business Value", 
               "Measurable ROI: Labor Optimization, Field Savings & Revenue Protection", 
               "Tangible capacity returned to operations and substantial hard cost avoidance.")

    # 4 Key Value Metric Cards
    metrics = [
        ("333 HOURS", "Labor Returned / 1k Cases", "20 minutes saved per anomaly investigation (from 30m down to 10m).", PRIMARY_BLUE),
        ("~2.0 FTE", "Operational Capacity Unlocked", "Equivalent to freeing 2 dedicated staff for every 10k alerts handled annually.", NAVY_DARK),
        ("15% - 25%", "Avoided Truck Rolls", "Pre-validation stops unnecessary field dispatches, saving $150-$250 per run.", EMERALD_DARK),
        ("< 24 HOURS", "Accelerated Dispute Cycle", "Proactive anomaly detection resolves billing friction before customer invoices generate.", PRIMARY_BLUE)
    ]

    for i, (stat, label, detail, color) in enumerate(metrics):
        left = Inches(0.8 + i * 2.98)
        c = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(2.8), Inches(2.0))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        tb = s6.shapes.add_textbox(left + Inches(0.15), Inches(2.2), Inches(2.5), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p_stat = tf.paragraphs[0]
        p_stat.text = stat
        p_stat.font.bold = True
        p_stat.font.size = Pt(22)
        p_stat.font.color.rgb = color

        p_lbl = tf.add_paragraph()
        p_lbl.text = label
        p_lbl.font.bold = True
        p_lbl.font.size = Pt(11)
        p_lbl.font.color.rgb = NAVY_MUTED
        p_lbl.space_after = Pt(4)

        p_det = tf.add_paragraph()
        p_det.text = detail
        p_det.font.size = Pt(9.5)
        p_det.font.color.rgb = SLATE_BODY

    # Financial Impact Summary Table Card
    c_bot = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.733), Inches(2.6))
    c_bot.fill.solid()
    c_bot.fill.fore_color.rgb = CARD_BG
    c_bot.line.color.rgb = BORDER_COLOR
    c_bot.line.width = Pt(1)

    tb_bot = s6.shapes.add_textbox(Inches(1.1), Inches(4.5), Inches(11.1), Inches(2.2))
    tf_b = tb_bot.text_frame
    tf_b.word_wrap = True
    
    p_title = tf_b.paragraphs[0]
    p_title.text = "EXECUTIVE VALUE FRAMEWORK: THREE LEVERS OF IMPACT"
    p_title.font.bold = True
    p_title.font.size = Pt(12)
    p_title.font.color.rgb = PRIMARY_BLUE
    p_title.space_after = Pt(8)

    framework = [
        ("1. Direct Labor Savings", "Automated evidence aggregation reduces investigative drag by 66%, allowing existing headcount to absorb smart meter fleet expansion without adding staff."),
        ("2. Fleet Cost Avoidance", "Filtering false alarms stops unnecessary truck rolls. Eliminating just 100 unwarranted field visits recovers $18,000–$25,000 in direct fleet expenses."),
        ("3. Revenue Protection & Brand Trust", "Rapid identification of faulty meters or under-registration prevents unbilled revenue leakage while averting high-conflict customer billing disputes.")
    ]
    for head, desc in framework:
        p_f = tf_b.add_paragraph()
        p_f.text = f"• {head}: {desc}"
        p_f.font.size = Pt(11)
        p_f.font.color.rgb = NAVY_MUTED
        p_f.space_after = Pt(6)

    # ==========================================
    # SLIDE 7: ASSOCIATE CASE DOSSIER & WORKSPACE
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header(s7, "06 / Operational User Experience", 
               "What the Operations Team Sees: The Unified Case Dossier", 
               "Replacing 5 disconnected systems with one clear, evidence-rich decision screen.")

    # Left Container: Case Dossier Mockup Card
    c_left = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(6.5), Inches(4.8))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = CARD_BG
    c_left.line.color.rgb = BORDER_COLOR
    c_left.line.width = Pt(1)

    # Dossier Header
    dh = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.3), Inches(6.1), Inches(0.6))
    dh.fill.solid()
    dh.fill.fore_color.rgb = PRIMARY_LIGHT
    dh.line.fill.background()
    tb_dh = s7.shapes.add_textbox(Inches(1.15), Inches(2.4), Inches(5.8), Inches(0.4))
    tf_dh = tb_dh.text_frame
    p_dh = tf_dh.paragraphs[0]
    p_dh.text = "HIGH PRIORITY ALERT: MTR-9824 • USAGE SPIKE (+4.2σ)"
    p_dh.font.bold = True
    p_dh.font.size = Pt(11)
    p_dh.font.color.rgb = PRIMARY_DARK

    tb_dl = s7.shapes.add_textbox(Inches(1.0), Inches(3.0), Inches(6.1), Inches(3.7))
    tf_dl = tb_dl.text_frame
    tf_dl.word_wrap = True
    
    sections = [
        ("Statistical Trigger:", "Read: 18.4 kWh @ 16:00 | 90-day baseline: 4.2 kWh (Threshold: 11.8 kWh)"),
        ("Continuity Check:", "PASS — Continuous telemetry received for last 273 consecutive days"),
        ("Meter Health Status:", "ACTIVE — Zero hardware tamper or low-battery diagnostic codes"),
        ("Billing Context:", "Within normal budget bracket; previous month paid on time"),
        ("Recommended Action:", "Confirm tenant equipment addition before scheduling field dispatch")
    ]
    for idx, (label, val) in enumerate(sections):
        p_sec = tf_dl.paragraphs[0] if idx == 0 else tf_dl.add_paragraph()
        p_sec.text = f"{label} {val}"
        p_sec.font.size = Pt(10.5)
        p_sec.font.color.rgb = NAVY_MUTED
        p_sec.space_after = Pt(8)

    # Right Container: Business Benefits of the Dossier
    c_right = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.55), Inches(2.1), Inches(4.98), Inches(4.8))
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = CARD_BG
    c_right.line.color.rgb = BORDER_COLOR
    c_right.line.width = Pt(1)

    tb_cr = s7.shapes.add_textbox(Inches(7.8), Inches(2.4), Inches(4.5), Inches(4.2))
    tf_cr = tb_cr.text_frame
    tf_cr.word_wrap = True
    p_rh = tf_cr.paragraphs[0]
    p_rh.text = "OPERATIONAL LIFT FOR ANALYSTS"
    p_rh.font.bold = True
    p_rh.font.size = Pt(13)
    p_rh.font.color.rgb = PRIMARY_BLUE
    p_rh.space_after = Pt(12)

    benefits = [
        ("Single-Pane-of-Glass", "No more toggling between AMI, billing databases, and CRM portals. All relevant context is pre-fetched and packaged."),
        ("Prescriptive Guidance", "The platform surfaces recommended next actions, enabling junior associates to execute with senior-level accuracy."),
        ("Full Associate Ownership", "Associate controls the ticket disposition: Validate, Dispatch Field Tech, Adjust Billing, or Mark Inconclusive."),
        ("Structured Collaboration", "Notes and comments remain attached to the case history, ensuring continuous institutional learning.")
    ]
    for h, b in benefits:
        p_b = tf_cr.add_paragraph()
        p_b.text = f"• {h}: {b}"
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = NAVY_MUTED
        p_b.space_after = Pt(8)

    # ==========================================
    # SLIDE 8: PILOT SCORECARD & SUCCESS METRICS
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header(s8, "07 / Pilot Scorecard", 
               "Targeted KPIs to Validate Lift During 90-Day Pilot", 
               "Rigorous measurement against a baseline cohort before full fleet deployment.")

    kpis = [
        ("TRIAGE SPEED", "< 10 Mins", "Baseline: 30 mins\nReduction of ~66% in analyst handling time per anomaly."),
        ("PRECISION RATE", "> 85%", "Candidate Actionability\n% of flagged reads verified as true operational exceptions."),
        ("AVOIDED TRUCKS", "20% - 30%", "Dispatch Reduction\nReduction in zero-fault truck rolls through pre-investigation."),
        ("FIRST-TOUCH RESOLUTION", "> 75%", "Disposed in 1 Review\nCases resolved without secondary re-opens or customer escalations.")
    ]

    for i, (kpi, target, desc) in enumerate(kpis):
        left = Inches(0.8 + i * 2.98)
        c = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(2.8), Inches(4.7))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        # Top Tag
        tag = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.2), Inches(2.3), Inches(2.4), Inches(0.5))
        tag.fill.solid()
        tag.fill.fore_color.rgb = PRIMARY_LIGHT
        tag.line.fill.background()

        tb_tag = s8.shapes.add_textbox(left + Inches(0.25), Inches(2.35), Inches(2.3), Inches(0.4))
        tf_t = tb_tag.text_frame
        p_t = tf_t.paragraphs[0]
        p_t.text = kpi
        p_t.font.bold = True
        p_t.font.size = Pt(11)
        p_t.font.color.rgb = PRIMARY_DARK

        # Target Value
        tb_val = s8.shapes.add_textbox(left + Inches(0.2), Inches(3.1), Inches(2.4), Inches(0.8))
        tf_v = tb_val.text_frame
        p_v = tf_v.paragraphs[0]
        p_v.text = target
        p_v.font.bold = True
        p_v.font.size = Pt(22)
        p_v.font.color.rgb = EMERALD_DARK

        # Description
        tb_d = s8.shapes.add_textbox(left + Inches(0.2), Inches(4.1), Inches(2.4), Inches(2.4))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = SLATE_BODY

    # ==========================================
    # SLIDE 9: PHASED IMPLEMENTATION ROADMAP
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header(s9, "08 / Implementation Roadmap", 
               "A De-Risked, Staged Rollout Strategy", 
               "Structured milestones ensuring operational stability, user adoption, and verified economics.")

    phases = [
        ("PHASE 1: HARDEN & CONNECT", "Weeks 1 – 4", 
         "• Connect live AMI telemetry & billing feeds\n• Configure enterprise SSO & Row-Level Security\n• Establish pre-pilot operational baselines\n• Deliver 2-hour associate training workshop",
         PRIMARY_LIGHT, PRIMARY_DARK),
        ("PHASE 2: 90-DAY PILOT", "Weeks 5 – 16", 
         "• Deploy with a dedicated cohort of 5–8 analysts\n• Run parallel comparison against standard triage\n• Capture override rates, actual time-to-disposition, and truck roll deferrals\n• Weekly sprint reviews with operations leadership",
         AMBER_LIGHT, AMBER_DARK),
        ("PHASE 3: ENTERPRISE SCALE", "Weeks 17+", 
         "• Roll out across full utility meter footprint\n• Automate bidirectional ERP/CRM work orders\n• Expand weather & external grid enrichment feeds\n• Transition to ongoing operations & SLA tracking",
         EMERALD_LIGHT, EMERALD_DARK)
    ]

    for i, (p_title, timing, details, fill_c, text_c) in enumerate(phases):
        left = Inches(0.8 + i * 3.98)
        c = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(3.75), Inches(4.7))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = BORDER_COLOR
        c.line.width = Pt(1)

        # Header box
        hdr = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.2), Inches(2.3), Inches(3.35), Inches(0.9))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = fill_c
        hdr.line.fill.background()

        tb_h = s9.shapes.add_textbox(left + Inches(0.3), Inches(2.35), Inches(3.15), Inches(0.8))
        tf_h = tb_h.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = p_title
        p_h.font.bold = True
        p_h.font.size = Pt(12)
        p_h.font.color.rgb = text_c
        p_time = tf_h.add_paragraph()
        p_time.text = timing
        p_time.font.size = Pt(10.5)
        p_time.font.color.rgb = text_c

        # Body details
        tb_b = s9.shapes.add_textbox(left + Inches(0.25), Inches(3.4), Inches(3.25), Inches(3.2))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = details
        p_b.font.size = Pt(11.5)
        p_b.font.color.rgb = NAVY_MUTED

    # ==========================================
    # SLIDE 10: EXECUTIVE DECISION & NEXT STEPS
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10)
    add_header(s10, "09 / Executive Decision & Next Steps", 
               "Decision Request: Sponsor the 90-Day Operational Pilot", 
               "Clear mandate, defined resource commitments, and zero operational disruption.")

    # Left Container: The Ask & Commitment
    c10_l = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(6.0), Inches(4.8))
    c10_l.fill.solid()
    c10_l.fill.fore_color.rgb = CARD_BG
    c10_l.line.color.rgb = BORDER_COLOR
    c10_l.line.width = Pt(1)

    tb_ask = s10.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.4), Inches(4.4))
    tf_ask = tb_ask.text_frame
    tf_ask.word_wrap = True
    
    p_ask_title = tf_ask.paragraphs[0]
    p_ask_title.text = "THE DECISION ASK"
    p_ask_title.font.bold = True
    p_ask_title.font.size = Pt(13)
    p_ask_title.font.color.rgb = PRIMARY_BLUE
    p_ask_title.space_after = Pt(10)

    ask_points = [
        ("Sponsor a 90-Day Pilot Cohort:", "Authorize a controlled pilot with 5–8 operations analysts focusing on a designated smart meter district."),
        ("Approve Data Access Connections:", "Grant read-only API access to AMI telemetry, CIS billing markers, and existing CRM ticketing."),
        ("Designate an Operations Lead:", "Appoint a single operational point-of-contact to review bi-weekly progress and validate scorecard metrics."),
        ("Zero Disruption Guarantee:", "The platform runs in parallel with existing ticketing. Existing workflows remain untouched until pilot benchmarks are proven.")
    ]
    for h, d in ask_points:
        p = tf_ask.add_paragraph()
        p.text = f"✔ {h} {d}"
        p.font.size = Pt(11)
        p.font.color.rgb = NAVY_MUTED
        p.space_after = Pt(8)

    # Right Container: Value Summary & Sign-off
    c10_r = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(2.1), Inches(5.433), Inches(4.8))
    c10_r.fill.solid()
    c10_r.fill.fore_color.rgb = PRIMARY_LIGHT
    c10_r.line.color.rgb = PRIMARY_BLUE
    c10_r.line.width = Pt(1.5)

    tb_r = s10.shapes.add_textbox(Inches(7.4), Inches(2.4), Inches(4.8), Inches(4.2))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p_rt = tf_r.paragraphs[0]
    p_rt.text = "WHY APPROVE TODAY?"
    p_rt.font.bold = True
    p_rt.font.size = Pt(14)
    p_rt.font.color.rgb = PRIMARY_DARK
    p_rt.space_after = Pt(12)

    why_approve = [
        ("Immediate Capacity Lift", "Relieve front-line alert fatigue and recapture up to 333 hours per 1,000 cases."),
        ("Direct Budget Protection", "Curtail unwarranted field dispatches and stop revenue loss from unaddressed meter anomalies."),
        ("Auditable Governance", "Deliver compliant, human-supervised AI with zero hallucination exposure and complete audit transparency."),
        ("Low-Risk Validation", "Full pilot validation without replacing legacy systems or risking customer operations.")
    ]
    for title, text in why_approve:
        p = tf_r.add_paragraph()
        p.text = f"★ {title}: {text}"
        p.font.size = Pt(11)
        p.font.color.rgb = NAVY_DARK
        p.space_after = Pt(8)

    output_path = r"C:\Users\GenAIKOCVISUSR8\Documents\antigravity\quick-lavoisier\Meter_Intelligence_Business_Case.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    build_presentation()
