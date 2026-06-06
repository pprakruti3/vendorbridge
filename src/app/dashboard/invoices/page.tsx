"use client";

import { useState, useCallback } from "react";
import {
  Download, Eye, Mail, MoreHorizontal, Receipt, Printer,
  Building2, FileText, Loader2, CheckCircle2, Send,
  IndianRupee, Calendar, Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockInvoices, mockPurchaseOrders, mockVendors } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";
import { toast } from "sonner";
import type { Invoice } from "@/types";

type ActiveModal = "generate" | "view" | "email" | null;

const VENDOR_OPTIONS = mockVendors.filter(v => v.status === "ACTIVE");
const PO_OPTIONS = mockPurchaseOrders;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [focusedInvoice, setFocusedInvoice] = useState<Invoice | null>(null);

  // Generate form
  const [selectedVendorId, setSelectedVendorId] = useState(VENDOR_OPTIONS[0]?.id ?? "");
  const [selectedPoId, setSelectedPoId] = useState(PO_OPTIONS[0]?.id ?? "");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [gstRate, setGstRate] = useState(18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email
  const [emailBody, setEmailBody] = useState("");

  const openModal = useCallback((modal: ActiveModal, inv?: Invoice) => {
    if (inv) setFocusedInvoice(inv);
    if (modal === "email" && inv) {
      setEmailBody(
        `Dear ${inv.vendor?.companyName} Team,\n\nPlease find attached Invoice ${inv.invoiceNumber}.\n\nAmount Due: ${formatCurrency(inv.totalAmount)}\nDue Date: ${formatDate(inv.dueDate)}\n\nKindly process the payment at your earliest convenience.\n\nRegards,\nAccounts Team`
      );
    }
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTimeout(() => {
      setFocusedInvoice(null);
      setEmailBody("");
    }, 300);
  }, []);

  const selectedPO = PO_OPTIONS.find(p => p.id === selectedPoId);
  const selectedVendor = VENDOR_OPTIONS.find(v => v.id === selectedVendorId);
  const baseAmount = selectedPO?.totalAmount ?? 0;
  const gstAmount = Math.round(baseAmount * (gstRate / 100));
  const totalAmount = baseAmount + gstAmount;

  const handleGenerateInvoice = useCallback(async () => {
    if (!selectedVendor || !selectedPO) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    const now = Date.now();
    const newInvoice: Invoice = {
      id: `inv${now}`,
      invoiceNumber: `INV-2025-${String(invoices.length + 1).padStart(3, "0")}`,
      poId: selectedPO.id,
      vendorId: selectedVendor.id,
      vendor: selectedVendor,
      subtotal: baseAmount,
      taxAmount: gstAmount,
      gstAmount,
      totalAmount,
      taxBreakdown: { CGST: gstAmount / 2, SGST: gstAmount / 2 },
      status: "SENT",
      dueDate: new Date(dueDate).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setIsSubmitting(false);
    closeModal();
    toast.success("Invoice generated!", {
      description: `${newInvoice.invoiceNumber} sent to ${selectedVendor.companyName}.`,
    });
  }, [selectedVendor, selectedPO, baseAmount, gstAmount, totalAmount, dueDate, invoices.length, closeModal]);

  const buildInvoiceHTML = useCallback((inv: Invoice) => {
    const cgst = inv.taxBreakdown?.CGST ?? inv.gstAmount / 2;
    const sgst = inv.taxBreakdown?.SGST ?? inv.gstAmount / 2;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${inv.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
    .brand { font-size: 22px; font-weight: 700; color: #6c47ff; }
    .brand-sub { font-size: 11px; color: #888; margin-top: 2px; }
    .inv-meta { text-align: right; }
    .inv-meta h2 { font-size: 28px; font-weight: 800; color: #6c47ff; letter-spacing: -1px; }
    .inv-meta p { font-size: 12px; color: #555; margin-top: 4px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
      background: ${ inv.status === 'PAID' ? '#dcfce7' : inv.status === 'OVERDUE' ? '#fee2e2' : '#eff6ff' };
      color: ${ inv.status === 'PAID' ? '#166534' : inv.status === 'OVERDUE' ? '#991b1b' : '#1d4ed8' };
      margin-top: 6px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .party-box { background: #f8f8fb; border-radius: 10px; padding: 16px; }
    .party-box h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
    .party-box p { font-size: 13px; line-height: 1.6; }
    .party-box .name { font-weight: 700; font-size: 15px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { background: #6c47ff; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f5; }
    tbody td:last-child { text-align: right; font-weight: 600; }
    tbody tr:nth-child(even) { background: #fafafa; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .totals-row.divider { border-top: 1px solid #e5e7eb; margin-top: 4px; padding-top: 10px; }
    .totals-row.grand { font-size: 16px; font-weight: 800; color: #6c47ff; }
    .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #f0f0f5; padding-top: 16px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">VendorBridge AI</div>
      <div class="brand-sub">AI-Powered Procurement Platform</div>
    </div>
    <div class="inv-meta">
      <h2>${inv.invoiceNumber}</h2>
      <p>Issued: ${new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      <p>Due: ${new Date(inv.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      <span class="badge">${inv.status}</span>
    </div>
  </div>

  <div class="parties">
    <div class="party-box">
      <h4>Bill From</h4>
      <p class="name">${inv.vendor?.companyName ?? 'Vendor'}</p>
      <p>${inv.vendor?.address ?? ''}, ${inv.vendor?.city ?? ''}</p>
      <p>${inv.vendor?.state ?? ''} — ${inv.vendor?.pincode ?? ''}</p>
      <p>GST: ${inv.vendor?.gstNumber ?? '—'}</p>
      <p>${inv.vendor?.email ?? ''}</p>
    </div>
    <div class="party-box">
      <h4>Bill To</h4>
      <p class="name">VendorBridge AI Ltd.</p>
      <p>Procurement Department</p>
      <p>PO Ref: ${inv.poId}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Goods / Services as per PO ${inv.poId}</td><td>₹${inv.subtotal.toLocaleString('en-IN')}</td></tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>₹${inv.subtotal.toLocaleString('en-IN')}</span></div>
    <div class="totals-row"><span>CGST</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
    <div class="totals-row"><span>SGST</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
    <div class="totals-row divider grand"><span>Total Amount</span><span>₹${inv.totalAmount.toLocaleString('en-IN')}</span></div>
    ${inv.paidAt ? `<div class="totals-row" style="color:#166534"><span>✓ Paid on</span><span>${new Date(inv.paidAt).toLocaleDateString('en-IN')}</span></div>` : ''}
  </div>

  <div class="footer">This is a computer-generated invoice. No signature required. · VendorBridge AI · GST-compliant</div>
</body>
</html>`;
  }, []);

  const printViaIframe = useCallback((html: string) => {
    // Remove any previous print iframe
    const prev = document.getElementById("__invoice_print_frame");
    if (prev) prev.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "__invoice_print_frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.opacity = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) {
      toast.error("Unable to create print frame");
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for content to render then trigger print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 300);
    };
    // Fallback if onload already fired (some browsers)
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 600);
  }, []);

  const handleDownload = useCallback((inv: Invoice) => {
    const html = buildInvoiceHTML(inv);
    printViaIframe(html);
    toast.success("Opening PDF dialog…", { description: `${inv.invoiceNumber} — select "Save as PDF" in the print dialog.` });
  }, [buildInvoiceHTML, printViaIframe]);

  const handlePrint = useCallback((inv: Invoice) => {
    const html = buildInvoiceHTML(inv);
    printViaIframe(html);
    toast.success("Print dialog opened", { description: inv.invoiceNumber });
  }, [buildInvoiceHTML, printViaIframe]);

  const handleSendEmail = useCallback(() => {
    toast.success("Invoice emailed!", {
      description: `Sent to ${focusedInvoice?.vendor?.companyName}.`,
    });
    closeModal();
  }, [focusedInvoice, closeModal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground text-sm mt-1">GST-compliant invoicing with tax breakdown</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={() => openModal("generate")}>
          <Receipt className="w-4 h-4 mr-2" /> Generate Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: invoices.length },
          { label: "Paid",           value: invoices.filter(i => i.status === "PAID").length },
          { label: "Pending",        value: invoices.filter(i => i.status === "SENT").length },
          { label: "Total Value",    value: formatCurrency(invoices.reduce((s, i) => s + i.totalAmount, 0)) },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(inv => (
              <TableRow key={inv.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                <TableCell className="font-medium">{inv.vendor?.companyName}</TableCell>
                <TableCell>{formatCurrency(inv.subtotal)}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(inv.gstAmount)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(inv.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(inv.status)}`}>{inv.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(inv.dueDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openModal("view", inv)}>
                        <Eye className="w-3.5 h-3.5 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(inv)}>
                        <Download className="w-3.5 h-3.5 mr-2" /> Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrint(inv)}>
                        <Printer className="w-3.5 h-3.5 mr-2" /> Print
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal("email", inv)}>
                        <Mail className="w-3.5 h-3.5 mr-2" /> Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── Generate Invoice Modal ── */}
      <Dialog open={activeModal === "generate"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Generate Invoice
            </DialogTitle>
            <DialogDescription>
              Create a GST-compliant invoice from a purchase order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Vendor */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Vendor
              </label>
              <select
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedVendorId}
                onChange={e => setSelectedVendorId(e.target.value)}
              >
                {VENDOR_OPTIONS.map(v => (
                  <option key={v.id} value={v.id}>{v.companyName}</option>
                ))}
              </select>
            </div>

            {/* PO Reference */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Purchase Order
              </label>
              <select
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedPoId}
                onChange={e => setSelectedPoId(e.target.value)}
              >
                {PO_OPTIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.poNumber} — {formatCurrency(p.totalAmount)}</option>
                ))}
              </select>
            </div>

            {/* GST Rate & Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" /> GST Rate (%)
                </label>
                <select
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={gstRate}
                  onChange={e => setGstRate(Number(e.target.value))}
                >
                  {[5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Due Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Tax preview */}
            {selectedPO && (
              <div className="bg-muted/40 rounded-lg p-3 border border-border/40 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Invoice Preview
                </p>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: "Subtotal",   value: formatCurrency(baseAmount) },
                    { label: `GST (${gstRate}%)`, value: formatCurrency(gstAmount) },
                    { label: "CGST",       value: formatCurrency(gstAmount / 2) },
                    { label: "SGST",       value: formatCurrency(gstAmount / 2) },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium">{r.value}</span>
                    </div>
                  ))}
                  <Separator className="my-1" />
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
            <Button
              className="gradient-primary border-0 text-white"
              onClick={handleGenerateInvoice}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
                : <><CheckCircle2 className="w-4 h-4 mr-2" /> Generate Invoice</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Invoice Modal ── */}
      <Dialog open={activeModal === "view"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {focusedInvoice?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>{focusedInvoice?.vendor?.companyName}</DialogDescription>
          </DialogHeader>

          {focusedInvoice && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Subtotal",    value: formatCurrency(focusedInvoice.subtotal)     },
                  { label: "GST",         value: formatCurrency(focusedInvoice.gstAmount)     },
                  { label: "Total",       value: formatCurrency(focusedInvoice.totalAmount)   },
                  { label: "Due Date",    value: formatDate(focusedInvoice.dueDate)            },
                ].map(f => (
                  <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-bold text-sm mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="outline" className={`text-xs ${getStatusColor(focusedInvoice.status)}`}>
                  {focusedInvoice.status}
                </Badge>
              </div>

              {Object.keys(focusedInvoice.taxBreakdown).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">GST Breakdown</p>
                    {Object.entries(focusedInvoice.taxBreakdown).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{formatCurrency(val)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {focusedInvoice.paidAt && (
                <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Paid on {formatDate(focusedInvoice.paidAt)}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Close</Button>
            <Button className="gradient-primary border-0 text-white" onClick={() => { if (focusedInvoice) { handleDownload(focusedInvoice); } closeModal(); }}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Email Modal ── */}
      <Dialog open={activeModal === "email"} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email Invoice
            </DialogTitle>
            <DialogDescription>
              Send {focusedInvoice?.invoiceNumber} to {focusedInvoice?.vendor?.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground">
              To: <span className="text-foreground font-medium">{focusedInvoice?.vendor?.email}</span>
            </div>
            <textarea
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[180px] resize-none font-mono"
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button className="gradient-primary border-0 text-white" onClick={handleSendEmail}>
              <Send className="w-4 h-4 mr-2" /> Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
