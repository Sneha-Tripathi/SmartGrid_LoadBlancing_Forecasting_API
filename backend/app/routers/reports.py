"""
Reports Module

Generates professional PDF (ReportLab) and Excel (openpyxl) reports.
Supports daily, weekly, monthly, zone, alerts, and efficiency reports.
Includes search, filters, sorting, and pagination.
"""

import io
import uuid
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field

from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

# ── In-Memory Report Store ────────────────────────────

_reports_db: list[dict] = []

def _generate_report_id() -> str:
    return f"RPT-{uuid.uuid4().hex[:8].upper()}"


def _seed_sample_reports():
    if _reports_db:
        return
    now = datetime.utcnow()
    samples = [
        {"id": _generate_report_id(), "title": f"Grid Performance — {now.strftime('%b %d, %Y')}", "type": "daily",
         "date": (now - timedelta(days=0)).isoformat(), "size": "2.4 MB", "status": "Generated"},
        {"id": _generate_report_id(), "title": f"Weekly Energy Consumption — Week {now.isocalendar()[1]}", "type": "weekly",
         "date": (now - timedelta(days=3)).isoformat(), "size": "4.8 MB", "status": "Generated"},
        {"id": _generate_report_id(), "title": f"Monthly Analysis — {now.strftime('%B %Y')}", "type": "monthly",
         "date": (now - timedelta(days=25)).isoformat(), "size": "8.2 MB", "status": "Generated"},
        {"id": _generate_report_id(), "title": f"Zone Distribution — {now.strftime('%B %Y')}", "type": "zones",
         "date": (now - timedelta(days=25)).isoformat(), "size": "3.6 MB", "status": "Generated"},
        {"id": _generate_report_id(), "title": f"Alert History — {now.strftime('%B %Y')}", "type": "alerts",
         "date": (now - timedelta(days=0)).isoformat(), "size": "1.2 MB", "status": "Pending"},
        {"id": _generate_report_id(), "title": f"AI Efficiency Metrics — {now.strftime('%b %Y')}", "type": "efficiency",
         "date": (now - timedelta(days=0)).isoformat(), "size": "5.1 MB", "status": "Generated"},
    ]
    _reports_db.extend(samples)


_seed_sample_reports()


# ── Schemas ────────────────────────────────────────────

class ReportOut(BaseModel):
    id: str
    title: str
    type: str
    date: str
    size: str
    status: str


class PaginatedReports(BaseModel):
    items: List[ReportOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Helper: Generate Report Data ──────────────────────

def _get_report_data(report_type: str) -> dict:
    """Generate report data based on type."""
    from app.data.dummyData import dashboard_cards, meter_data, alerts, activities

    now = datetime.utcnow()
    data = {
        "title": "",
        "generated_at": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "company": "Smart Grid Load Balancing & Forecasting System",
        "type": report_type,
    }

    if report_type == "daily":
        data["title"] = "Daily Grid Performance Summary"
        data["period"] = now.strftime("%B %d, %Y")
        data["summary"] = {
            "total_load_mw": round(sum(float(m.get("load", "0").replace(" MW", "")) for m in meter_data), 2),
            "active_meters": len(meter_data),
            "active_alerts": len(alerts),
            "grid_health": "98%",
            "peak_load": "4.2 MW",
            "avg_voltage": "228 V",
        }
        data["metrics"] = [
            {"label": "Total Load", "value": f'{data["summary"]["total_load_mw"]} MW'},
            {"label": "Active Meters", "value": str(data["summary"]["active_meters"])},
            {"label": "Grid Health", "value": data["summary"]["grid_health"]},
            {"label": "Peak Load", "value": data["summary"]["peak_load"]},
            {"label": "Average Voltage", "value": data["summary"]["avg_voltage"]},
        ]
        data["alerts_summary"] = [
            {"zone": a.get("zone", ""), "type": a.get("type", ""), "time": a.get("time", "")}
            for a in alerts
        ]
        data["zone_loads"] = [
            {"zone": m.get("zone", ""), "load": m.get("load", ""), "status": m.get("status", "")}
            for m in meter_data[:8]
        ]

    elif report_type == "weekly":
        data["title"] = "Weekly Energy Consumption Report"
        data["period"] = f"{now.strftime('%B %d')} - {(now + timedelta(days=6)).strftime('%B %d, %Y')}"
        data["summary"] = {
            "total_consumption_mwh": round(sum(float(m.get("load", "0").replace(" MW", "")) for m in meter_data) * 24 * 7, 2),
            "avg_daily_load": round(sum(float(m.get("load", "0").replace(" MW", "")) for m in meter_data) / max(len(meter_data), 1), 2),
            "peak_day": "Friday",
            "peak_load": "4.8 MW",
            "total_carbon_saved": "18.5 tons",
        }
        data["metrics"] = [
            {"label": "Total Consumption", "value": f'{data["summary"]["total_consumption_mwh"]} MWh'},
            {"label": "Avg Daily Load", "value": f'{data["summary"]["avg_daily_load"]} MW'},
            {"label": "Peak Day", "value": data["summary"]["peak_day"]},
            {"label": "Carbon Saved", "value": data["summary"]["total_carbon_saved"]},
        ]
        data["daily_breakdown"] = [
            {"day": d, "load": round(3.0 + (i * 0.3), 2)}
            for i, d in enumerate(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        ]

    elif report_type == "monthly":
        data["title"] = "Monthly Load Analysis Report"
        data["period"] = now.strftime("%B %Y")
        data["summary"] = {
            "total_consumption_mwh": round(sum(float(m.get("load", "0").replace(" MW", "")) for m in meter_data) * 24 * 30, 2),
            "avg_load_mw": round(sum(float(m.get("load", "0").replace(" MW", "")) for m in meter_data) / max(len(meter_data), 1), 2),
            "peak_load_mw": "6.10 MW",
            "peak_zone": "Central Zone",
            "efficiency_pct": "94.2%",
            "forecast_accuracy": "96.8%",
        }
        data["metrics"] = [
            {"label": "Total Consumption", "value": f'{data["summary"]["total_consumption_mwh"]} MWh'},
            {"label": "Average Load", "value": f'{data["summary"]["avg_load_mw"]} MW'},
            {"label": "Peak Load", "value": data["summary"]["peak_load_mw"]},
            {"label": "Efficiency", "value": data["summary"]["efficiency_pct"]},
            {"label": "Forecast Accuracy", "value": data["summary"]["forecast_accuracy"]},
        ]
        data["zone_summary"] = [
            {"zone": m.get("zone", ""), "load": m.get("load", ""), "status": m.get("status", "")}
            for m in meter_data
        ]

    elif report_type == "zones":
        data["title"] = "Zone Distribution & Performance Report"
        data["period"] = now.strftime("%B %Y")
        zones_data = {}
        for m in meter_data:
            z = m.get("zone", "Unknown")
            if z not in zones_data:
                zones_data[z] = {"meters": 0, "total_load": 0.0, "statuses": []}
            zones_data[z]["meters"] += 1
            load_val = float(m.get("load", "0").replace(" MW", ""))
            zones_data[z]["total_load"] += load_val
            zones_data[z]["statuses"].append(m.get("status", "Normal"))
        data["zones"] = [
            {"name": z, "meters": v["meters"], "total_load": f'{round(v["total_load"], 2)} MW',
             "avg_status": max(set(v["statuses"]), key=v["statuses"].count)}
            for z, v in zones_data.items()
        ]
        data["total_zones"] = len(zones_data)
        data["total_meters"] = len(meter_data)

    elif report_type == "alerts":
        data["title"] = "Alert & Incident History Report"
        data["period"] = now.strftime("%B %Y")
        data["alerts"] = alerts
        data["total_alerts"] = len(alerts)
        data["critical_count"] = sum(1 for a in alerts if a.get("type") in ("Critical Overload", "Critical"))
        data["warning_count"] = sum(1 for a in alerts if a.get("type") == "Warning")
        data["info_count"] = sum(1 for a in alerts if a.get("type") == "Info")

    elif report_type == "efficiency":
        data["title"] = "Grid Efficiency & AI Optimization Report"
        data["period"] = now.strftime("%B %Y")
        data["summary"] = {
            "overall_efficiency": "94.2%",
            "ai_forecast_accuracy": "96.8%",
            "load_balancing_effectiveness": "92.5%",
            "carbon_reduction": "18.5 tons CO2",
            "cost_savings": "$124,500",
            "uptime": "99.97%",
        }
        data["metrics"] = [
            {"label": "Overall Efficiency", "value": data["summary"]["overall_efficiency"]},
            {"label": "AI Forecast Accuracy", "value": data["summary"]["ai_forecast_accuracy"]},
            {"label": "Load Balancing", "value": data["summary"]["load_balancing_effectiveness"]},
            {"label": "Carbon Reduction", "value": data["summary"]["carbon_reduction"]},
            {"label": "Cost Savings", "value": data["summary"]["cost_savings"]},
            {"label": "Uptime", "value": data["summary"]["uptime"]},
        ]

    return data


# ── PDF Generation ────────────────────────────────────

def _generate_pdf(data: dict) -> io.BytesIO:
    """Generate a professional PDF report using ReportLab."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch, mm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        PageBreak, HRFlowable, Image
    )
    from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        topMargin=0.8 * inch, bottomMargin=0.8 * inch,
        leftMargin=0.75 * inch, rightMargin=0.75 * inch
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle', parent=styles['Title'],
        fontSize=22, leading=26, spaceAfter=6,
        textColor=colors.HexColor('#06B6D4'),
        alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', parent=styles['Normal'],
        fontSize=10, leading=14, spaceAfter=20,
        textColor=colors.HexColor('#64748B'),
        alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        'Heading2', parent=styles['Heading2'],
        fontSize=14, leading=18, spaceBefore=16, spaceAfter=10,
        textColor=colors.HexColor('#1E293B'),
    )
    normal_style = ParagraphStyle(
        'CustomNormal', parent=styles['Normal'],
        fontSize=10, leading=14, spaceAfter=6,
        textColor=colors.HexColor('#334155'),
    )
    footer_style = ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontSize=8, leading=10, textColor=colors.HexColor('#94A3B8'),
        alignment=TA_CENTER,
    )

    elements = []

    # ── Header / Company Info ──
    elements.append(Paragraph("Smart Grid Load Balancing & Forecasting", title_style))
    elements.append(Paragraph(data.get("title", "Report"), subtitle_style))
    elements.append(Paragraph(f"Generated: {data.get('generated_at', '')}", subtitle_style))
    elements.append(Paragraph(f"Period: {data.get('period', '')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=12))

    # ── Analytics Summary ──
    metrics = data.get("metrics", [])
    if metrics:
        elements.append(Paragraph("Analytics Summary", heading_style))
        table_data = [[Paragraph(m["label"], normal_style), Paragraph(m["value"], normal_style)] for m in metrics]
        t = Table(table_data, colWidths=[3*inch, 3*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1E293B')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 12))

    # ── Alerts Section ──
    alerts_data = data.get("alerts", []) or data.get("alerts_summary", [])
    if alerts_data:
        elements.append(Paragraph("Alert Summary", heading_style))
        alert_table = [["Zone", "Type", "Time"]]
        for a in alerts_data:
            alert_table.append([a.get("zone", ""), a.get("type", ""), a.get("time", "")])
        t = Table(alert_table, colWidths=[2*inch, 2*inch, 2*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#06B6D4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 12))

    # ── Zone Loads Section ──
    zone_loads = data.get("zone_loads", []) or data.get("zone_summary", [])
    if zone_loads:
        elements.append(Paragraph("Zone Load Analysis", heading_style))
        ztable = [["Zone", "Load", "Status"]]
        for z in zone_loads:
            ztable.append([z.get("zone", ""), z.get("load", ""), z.get("status", "")])
        t = Table(ztable, colWidths=[2.5*inch, 1.5*inch, 2*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#06B6D4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(t)

    # ── Daily Breakdown (for weekly) ──
    daily = data.get("daily_breakdown", [])
    if daily:
        elements.append(Paragraph("Daily Breakdown", heading_style))
        dtable = [["Day", "Load (MW)"]]
        for d in daily:
            dtable.append([d.get("day", ""), str(d.get("load", ""))])
        t = Table(dtable, colWidths=[3*inch, 3*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#06B6D4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(t)

    # ── Zones Detail ──
    zones_detail = data.get("zones", [])
    if zones_detail:
        elements.append(Paragraph("Zone Distribution", heading_style))
        ztable2 = [["Zone", "Meters", "Total Load", "Status"]]
        for z in zones_detail:
            ztable2.append([z.get("name", ""), str(z.get("meters", "")), z.get("total_load", ""), z.get("avg_status", "")])
        t = Table(ztable2, colWidths=[1.5*inch, 1*inch, 1.5*inch, 2*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#06B6D4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(t)

    # ── Footer ──
    elements.append(Spacer(1, 24))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceAfter=6))
    elements.append(Paragraph(
        f"Smart Grid Load Balancing & Forecasting System — Confidential",
        footer_style
    ))
    elements.append(Paragraph(
        f"Generated on {data.get('generated_at', '')} | Page 1 of 1",
        footer_style
    ))

    doc.build(elements)
    buf.seek(0)
    return buf


# ── Excel Generation ──────────────────────────────────

def _generate_excel(data: dict) -> io.BytesIO:
    """Generate a professional Excel report using openpyxl."""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter

    wb = Workbook()
    ws = wb.active
    ws.title = data.get("title", "Report")[:31]

    # ── Colors ──
    header_fill = PatternFill(start_color="06B6D4", end_color="06B6D4", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    title_font = Font(name="Calibri", size=16, bold=True, color="06B6D4")
    subtitle_font = Font(name="Calibri", size=10, color="64748B")
    normal_font = Font(name="Calibri", size=10, color="1E293B")
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0'),
    )

    # ── Row 1: Title ──
    ws.cell(row=1, column=1, value="Smart Grid Load Balancing & Forecasting System").font = title_font
    ws.merge_cells('A1:F1')
    ws.cell(row=1, column=1).alignment = Alignment(horizontal='center')

    # ── Row 2: Report Title ──
    ws.cell(row=2, column=1, value=data.get("title", "")).font = subtitle_font
    ws.merge_cells('A2:F2')
    ws.cell(row=2, column=1).alignment = Alignment(horizontal='center')

    # ── Row 3: Generated date ──
    ws.cell(row=3, column=1, value=f"Generated: {data.get('generated_at', '')}").font = subtitle_font
    ws.merge_cells('A3:F3')
    ws.cell(row=3, column=1).alignment = Alignment(horizontal='center')

    # ── Row 5: Analytics Summary ──
    metrics = data.get("metrics", [])
    if metrics:
        ws.cell(row=5, column=1, value="Analytics Summary").font = Font(name="Calibri", size=12, bold=True, color="1E293B")
        for i, m in enumerate(metrics):
            row = 6 + i
            ws.cell(row=row, column=1, value=m["label"]).font = normal_font
            ws.cell(row=row, column=1).border = thin_border
            ws.cell(row=row, column=2, value=m["value"]).font = Font(name="Calibri", size=10, bold=True, color="06B6D4")
            ws.cell(row=row, column=2).border = thin_border

    # ── Row 6+len(metrics)+2: Tables ──
    start_row = 6 + len(metrics) + 2

    # Alerts table
    alerts_data = data.get("alerts", []) or data.get("alerts_summary", [])
    if alerts_data:
        ws.cell(row=start_row, column=1, value="Alerts").font = Font(name="Calibri", size=12, bold=True, color="1E293B")
        start_row += 1
        headers = list(alerts_data[0].keys()) if alerts_data else []
        for col_idx, h in enumerate(headers, 1):
            cell = ws.cell(row=start_row, column=col_idx, value=h.replace("_", " ").title())
            cell.font = header_font
            cell.fill = header_fill
            cell.border = thin_border
            cell.alignment = Alignment(horizontal='center')
        for row_idx, a in enumerate(alerts_data, start_row + 1):
            for col_idx, h in enumerate(headers, 1):
                cell = ws.cell(row=row_idx, column=col_idx, value=a.get(h, ""))
                cell.font = normal_font
                cell.border = thin_border
        start_row += len(alerts_data) + 2

    # Zone loads table
    zone_loads = data.get("zone_loads", []) or data.get("zone_summary", [])
    if zone_loads:
        ws.cell(row=start_row, column=1, value="Zone Load Analysis").font = Font(name="Calibri", size=12, bold=True, color="1E293B")
        start_row += 1
        headers = ["Zone", "Load", "Status"]
        for col_idx, h in enumerate(headers, 1):
            cell = ws.cell(row=start_row, column=col_idx, value=h)
            cell.font = header_font
            cell.fill = header_fill
            cell.border = thin_border
            cell.alignment = Alignment(horizontal='center')
        for row_idx, z in enumerate(zone_loads, start_row + 1):
            ws.cell(row=row_idx, column=1, value=z.get("zone", "")).font = normal_font
            ws.cell(row=row_idx, column=1).border = thin_border
            ws.cell(row=row_idx, column=2, value=z.get("load", "")).font = normal_font
            ws.cell(row=row_idx, column=2).border = thin_border
            ws.cell(row=row_idx, column=3, value=z.get("status", "")).font = normal_font
            ws.cell(row=row_idx, column=3).border = thin_border

    # ── Auto column width ──
    for col in ws.columns:
        max_length = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            if cell.value:
                max_length = max(max_length, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = min(max_length + 4, 40)

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf


# ── API Endpoints ─────────────────────────────────────

@router.get("/", response_model=PaginatedReports)
def list_reports(
    search: Optional[str] = Query(None, description="Search by title"),
    filter_type: Optional[str] = Query(None, alias="type", description="Filter by report type"),
    sort_by: str = Query("date", description="Sort field (date, title, type)"),
    sort_order: str = Query("desc", description="Sort order (asc, desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
):
    """List reports with search, filter, sorting, and pagination."""
    filtered = list(_reports_db)

    # Search
    if search:
        q = search.lower()
        filtered = [r for r in filtered if q in r.get("title", "").lower()]

    # Filter by type
    if filter_type and filter_type != "all":
        filtered = [r for r in filtered if r.get("type", "").lower() == filter_type.lower()]

    # Sort
    reverse = sort_order.lower() == "desc"
    if sort_by in ("date", "title", "type"):
        filtered.sort(key=lambda r: r.get(sort_by, "").lower(), reverse=reverse)
    else:
        # Default sort by date descending
        filtered.sort(key=lambda r: r.get("date", ""), reverse=True)

    # Pagination
    total = len(filtered)
    total_pages = max(1, (total + page_size - 1) // page_size)
    start = (page - 1) * page_size
    page_items = filtered[start:start + page_size]

    return {
        "items": [ReportOut(**r) for r in page_items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.post("/generate/{report_type}", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def generate_report(report_type: str):
    """Generate a new report of the specified type."""
    valid_types = ["daily", "weekly", "monthly", "zones", "alerts", "efficiency"]
    if report_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid report type. Must be one of: {', '.join(valid_types)}")

    type_labels = {
        "daily": "Daily Summary",
        "weekly": "Weekly Report",
        "monthly": "Monthly Report",
        "zones": "Zone Analysis",
        "alerts": "Alert Log",
        "efficiency": "Efficiency Report",
    }

    now = datetime.utcnow()
    report = {
        "id": _generate_report_id(),
        "title": f"{type_labels.get(report_type, report_type)} — {now.strftime('%b %d, %Y')}",
        "type": report_type,
        "date": now.isoformat(),
        "size": f"{round(1.0 + 7.0 * __import__('random').random(), 1)} MB",
        "status": "Generated",
    }
    _reports_db.insert(0, report)
    # Note: Report generation notifications are handled on the frontend
    # since this endpoint doesn't require authentication to identify the user

    return ReportOut(**report)


@router.get("/{report_id}/download-pdf")
def download_report_pdf(report_id: str):
    """Download a report as a professional PDF."""
    report = next((r for r in _reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    data = _get_report_data(report["type"])
    data["title"] = report.get("title", data.get("title", "Report"))

    pdf_buf = _generate_pdf(data)
    filename = f"smartgrid_{report['type']}_report_{datetime.utcnow().strftime('%Y%m%d')}.pdf"

    return StreamingResponse(
        iter([pdf_buf.getvalue()]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/pdf",
        }
    )


@router.get("/{report_id}/download-excel")
def download_report_excel(report_id: str):
    """Download a report as a formatted Excel file."""
    report = next((r for r in _reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    data = _get_report_data(report["type"])
    data["title"] = report.get("title", data.get("title", "Report"))

    excel_buf = _generate_excel(data)
    filename = f"smartgrid_{report['type']}_report_{datetime.utcnow().strftime('%Y%m%d')}.xlsx"

    return StreamingResponse(
        iter([excel_buf.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
    )


@router.delete("/{report_id}")
def delete_report(report_id: str):
    """Delete a report by ID."""
    idx = next((i for i, r in enumerate(_reports_db) if r["id"] == report_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Report not found")
    removed = _reports_db.pop(idx)
    return {"message": f"Report {removed['id']} deleted successfully"}
