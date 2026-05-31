import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HIPAA_DATA } from '../data/hipaa';
import { type OrgInfo, type SpecResponse, STATUS_META, getSpecResponse } from '../store/useHipaaStore';
import { getCategoryStats, getOverallStats } from './stats';

export function exportPDF(
  orgInfo: OrgInfo,
  responses: Record<string, SpecResponse>
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const stats = getOverallStats(responses);
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 0;

  const addPage = () => { doc.addPage(); y = margin; };
  const checkBreak = (needed = 40) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage();
  };
  const tableY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  // ── Cover ──────────────────────────────────────────────────────────────
  doc.setFillColor(26, 58, 92);
  doc.rect(0, 0, W, 200, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.text('HIPAA Security Rule', margin, 80);
  doc.setFontSize(16); doc.setFont('helvetica', 'normal');
  doc.text('Compliance Assessment Report', margin, 104);
  doc.setFontSize(11);
  if (orgInfo.name) doc.text(orgInfo.name, margin, 140);
  const dateStr = orgInfo.date
    ? new Date(orgInfo.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Assessment Date: ${dateStr}`, margin, 158);
  if (orgInfo.assessor) {
    const who = orgInfo.assessorTitle ? `${orgInfo.assessor}, ${orgInfo.assessorTitle}` : orgInfo.assessor;
    doc.text(`Assessed by: ${who}`, margin, 176);
  }
  doc.setTextColor(0, 0, 0);
  y = 240;

  // ── Executive Summary ──────────────────────────────────────────────────
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, y); y += 28;

  const scoreColor: [number, number, number] =
    stats.score >= 80 ? [22, 163, 74] : stats.score >= 50 ? [217, 119, 6] : [220, 38, 38];
  doc.setFillColor(...scoreColor);
  doc.roundedRect(margin, y, 100, 56, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28); doc.setFont('helvetica', 'bold');
  doc.text(`${stats.score}%`, margin + 50, y + 28, { align: 'center' });
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Compliance Score', margin + 50, y + 44, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  const summaryRows = [
    ['Compliant',           stats.counts.compliant,    pct(stats.counts.compliant, stats.total)],
    ['Partially Compliant', stats.counts.partial,      pct(stats.counts.partial, stats.total)],
    ['Non-Compliant',       stats.counts.noncompliant, pct(stats.counts.noncompliant, stats.total)],
    ['Not Applicable',      stats.counts.na,           pct(stats.counts.na, stats.total)],
    ['Not Assessed',        stats.counts[''],          pct(stats.counts[''], stats.total)],
    ['Total Controls',      stats.total,               '100%'],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin + 116, right: margin },
    head: [['Status', 'Count', 'Percentage']],
    body: summaryRows,
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [26, 58, 92], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    tableWidth: W - margin * 2 - 116,
  });
  y = tableY() + 30;

  // ── Category Breakdown ─────────────────────────────────────────────────
  checkBreak(80);
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('Results by Category', margin, y); y += 16;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Category', 'CFR', 'Compliant', 'Partial', 'Non-Comp.', 'N/A', 'Not Assessed', 'Score']],
    body: HIPAA_DATA.categories.map(cat => {
      const cs = getCategoryStats(responses, cat.id);
      return [cat.title, cat.cfr, cs.counts.compliant, cs.counts.partial, cs.counts.noncompliant, cs.counts.na, cs.counts[''], `${cs.pct}%`];
    }),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [26, 58, 92], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 60 },
      2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' },
      5: { halign: 'center' }, 6: { halign: 'center' }, 7: { halign: 'center', fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
  });
  y = tableY() + 30;

  // ── Issues Requiring Attention ─────────────────────────────────────────
  const issues = HIPAA_DATA.allSpecs
    .filter(sp => ['noncompliant', 'partial'].includes(getSpecResponse(responses, sp.id).status))
    .sort((a, b) => {
      const order: Record<string, number> = { noncompliant: 0, partial: 1 };
      return order[getSpecResponse(responses, a.id).status] - order[getSpecResponse(responses, b.id).status];
    });

  if (issues.length > 0) {
    addPage();
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Items Requiring Attention', margin, y); y += 16;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Status', 'Control', 'Type', 'Category', 'Notes']],
      body: issues.map(sp => {
        const r = getSpecResponse(responses, sp.id);
        const cat = HIPAA_DATA.categories.find(c => c.id === sp.categoryId);
        return [
          STATUS_META[r.status].label,
          sp.title,
          sp.type === 'R' ? 'Required' : 'Addressable',
          cat?.title ?? '',
          r.notes || '',
        ];
      }),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 120 },
        2: { cellWidth: 60, halign: 'center' },
        3: { cellWidth: 110 },
      },
      alternateRowStyles: { fillColor: [254, 226, 226] },
      didParseCell: (data) => {
        if (data.column.index === 0 && data.section === 'body') {
          if (data.cell.raw === 'Non-Compliant') (data.cell.styles as { textColor: number[] }).textColor = [220, 38, 38];
          if (data.cell.raw === 'Partially Compliant') (data.cell.styles as { textColor: number[] }).textColor = [217, 119, 6];
        }
      },
    });
    y = tableY() + 30;
  }

  // ── Detailed Findings ──────────────────────────────────────────────────
  HIPAA_DATA.categories.forEach(cat => {
    addPage();
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 58, 92);
    doc.text(`${cat.title} (${cat.cfr})`, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 8;

    cat.standards.forEach(std => {
      checkBreak(50);
      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [[`${std.title} (${std.cfr})`, 'Type', 'Status', 'Notes']],
        body: std.specs.map(sp => {
          const r = getSpecResponse(responses, sp.id);
          return [sp.title, sp.type === 'R' ? 'Required' : 'Addressable', STATUS_META[r.status].label, r.notes || ''];
        }),
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 160 },
          1: { cellWidth: 60, halign: 'center' },
          2: { cellWidth: 90, halign: 'center' },
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell: (data) => {
          if (data.column.index === 2 && data.section === 'body') {
            const statusColors: Record<string, number[]> = {
              'Compliant':           [22, 163, 74],
              'Partially Compliant': [217, 119, 6],
              'Non-Compliant':       [220, 38, 38],
              'Not Applicable':      [107, 114, 128],
              'Not Assessed':        [148, 163, 184],
            };
            const color = statusColors[data.cell.raw as string];
            if (color) (data.cell.styles as { textColor: number[] }).textColor = color;
          }
        },
      });
      y = tableY() + 14;
    });
  });

  // ── Page footers ───────────────────────────────────────────────────────
  const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    const pageH = doc.internal.pageSize.getHeight();
    doc.text(
      `HIPAA Security Rule Compliance Assessment · Page ${i} of ${pageCount}`,
      W / 2, pageH - 20, { align: 'center' }
    );
    if (orgInfo.name) doc.text(orgInfo.name, margin, pageH - 20);
  }

  const filename = `HIPAA_Assessment_${(orgInfo.name || 'Report').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

function pct(n: number, total: number): string {
  return total ? `${Math.round((n / total) * 100)}%` : '0%';
}
