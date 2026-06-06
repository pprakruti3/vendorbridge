"use client";

import { useState, useRef, useCallback } from "react";
import { Eye, MoreHorizontal, Upload, ClipboardList, GitCompare, FileUp, CheckCircle2, Sparkles, X, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { mockQuotations, mockVendors } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/helpers";
import { toast } from "sonner";
import Link from "next/link";
import type { Quotation } from "@/types";

type UploadStep = "select" | "uploading" | "extracting" | "complete";

export default function QuotationsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadStep>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUpload = useCallback(() => {
    setUploadStep("select");
    setSelectedFile(null);
    setUploadProgress(0);
    setExtractionProgress(0);
    setIsDragging(false);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsUploadOpen(open);
    if (!open) {
      setTimeout(resetUpload, 300);
    }
  }, [resetUpload]);

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", { description: "Please upload a PDF file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum file size is 10MB." });
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUploadAndExtract = useCallback(() => {
    if (!selectedFile) return;

    // Phase 1: Upload
    setUploadStep("uploading");
    setUploadProgress(0);

    let uploadDone = false;
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev < 100) return prev + Math.random() * 15 + 5;
        // Only transition once (guards against Strict Mode double-invoke)
        if (!uploadDone) {
          uploadDone = true;
          clearInterval(uploadInterval);
          setUploadStep("extracting");
          setExtractionProgress(0);

          let extractDone = false;
          const extractInterval = setInterval(() => {
            setExtractionProgress(prev2 => {
              if (prev2 < 100) return prev2 + Math.random() * 12 + 3;
              if (!extractDone) {
                extractDone = true;
                clearInterval(extractInterval);

                // Build new quotation outside the updater so it is created once
                const now = Date.now();
                const quotationId = `q${now}`;
                const newQuotation: Quotation = {
                  id: quotationId,
                  quotationNumber: `QT-2025-${String(quotations.length + 1).padStart(3, "0")}`,
                  rfqId: "rfq1",
                  vendorId: "v1",
                  vendor: mockVendors[0],
                  totalAmount: 9735000,
                  taxAmount: 1485000,
                  gstAmount: 1485000,
                  deliveryTime: "15 business days",
                  warranty: "3 years onsite",
                  paymentTerms: "Net 30",
                  supportDetails: "24/7 phone + onsite support",
                  status: "SUBMITTED",
                  aiScore: 89,
                  aiExtractedData: {
                    extracted: true,
                    fileName: selectedFile.name,
                    extractedAt: new Date().toISOString(),
                    confidence: 0.96,
                  },
                  items: [
                    {
                      id: `qi${now}`,
                      quotationId,
                      rfqItemId: "ri1",
                      productName: "Dell Latitude 5540",
                      unitPrice: 68500,
                      quantity: 100,
                      totalPrice: 6850000,
                      gst: 18,
                      specifications: "i7-1365U, 16GB, 512GB SSD",
                    },
                  ],
                  attachments: [
                    {
                      id: `qa${now}`,
                      quotationId,
                      fileName: selectedFile.name,
                      fileUrl: `/uploads/${selectedFile.name}`,
                      fileType: "application/pdf",
                      fileSize: selectedFile.size,
                    },
                  ],
                  submittedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                // Safe: setQuotations updater is pure — newQuotation is already built
                setQuotations(prev3 => {
                  if (prev3.some(q => q.id === quotationId)) return prev3;
                  return [newQuotation, ...prev3];
                });
                setUploadStep("complete");
              }
              return 100;
            });
          }, 200);
        }
        return 100;
      });
    }, 100);
  }, [selectedFile, quotations.length]);

  const handleComplete = useCallback(() => {
    setIsUploadOpen(false);
    toast.success("Quotation uploaded successfully!", {
      description: `AI extracted data from "${selectedFile?.name}" with 96% confidence.`,
    });
    setTimeout(resetUpload, 300);
  }, [selectedFile, resetUpload]);

  const extractionSteps = [
    { label: "Parsing PDF structure...", threshold: 15 },
    { label: "Extracting vendor details...", threshold: 30 },
    { label: "Reading line items & pricing...", threshold: 50 },
    { label: "Validating GST & tax data...", threshold: 70 },
    { label: "Computing AI confidence score...", threshold: 85 },
    { label: "Finalizing extraction...", threshold: 95 },
  ];

  const currentExtractionStep = extractionSteps.findLast(s => extractionProgress >= s.threshold)?.label || "Initializing AI engine...";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotation Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and compare vendor quotations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={handleOpenChange}>
            <Button variant="outline" onClick={() => setIsUploadOpen(true)} id="upload-pdf-btn">
              <Upload className="w-4 h-4 mr-2" /> Upload PDF
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-primary" />
                  Upload Quotation PDF
                </DialogTitle>
                <DialogDescription>
                  Upload a vendor quotation PDF. Our AI will automatically extract key data.
                </DialogDescription>
              </DialogHeader>

              {/* Step 1: File Selection */}
              {uploadStep === "select" && (
                <div className="space-y-4">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : selectedFile
                        ? "border-success bg-success/5"
                        : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />

                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-success" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB • PDF Document
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors mt-1"
                        >
                          <X className="w-3 h-3" /> Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {isDragging ? "Drop your PDF here" : "Drag & drop your PDF here"}
                        </p>
                        <p className="text-xs text-muted-foreground">or click to browse • Max 10MB</p>
                      </div>
                    )}
                  </div>

                  {selectedFile && (
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">AI-Powered Extraction: </span>
                          Our engine will automatically extract vendor info, line items, pricing, GST details, and delivery terms.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Uploading */}
              {uploadStep === "uploading" && (
                <div className="space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold">Uploading document...</p>
                    <p className="text-xs text-muted-foreground">{selectedFile?.name}</p>
                  </div>
                  <Progress value={Math.min(uploadProgress, 100)} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.min(Math.round(uploadProgress), 100)}% complete
                  </p>
                </div>
              )}

              {/* Step 3: AI Extraction */}
              {uploadStep === "extracting" && (
                <div className="space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold">AI Extracting Data...</p>
                    <p className="text-xs text-primary font-medium">{currentExtractionStep}</p>
                  </div>
                  <Progress value={Math.min(extractionProgress, 100)} className="h-2" />
                  <div className="space-y-2 bg-muted/30 rounded-lg p-3 border border-border/30">
                    {extractionSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {extractionProgress >= step.threshold + 10 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        ) : extractionProgress >= step.threshold ? (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-border/50 flex-shrink-0" />
                        )}
                        <span className={extractionProgress >= step.threshold ? "text-foreground" : "text-muted-foreground/50"}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {uploadStep === "complete" && (
                <div className="space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold">Extraction Complete!</p>
                    <p className="text-xs text-muted-foreground">AI processed the document with 96% confidence</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 border border-border/30 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Vendor:</span>
                        <p className="font-semibold">Dell Technologies</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-semibold">₹97,35,000</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Items Detected:</span>
                        <p className="font-semibold">5 line items</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Score:</span>
                        <p className="font-semibold text-primary">89/100</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">GST:</span>
                        <p className="font-semibold">₹14,85,000 (18%)</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Delivery:</span>
                        <p className="font-semibold">15 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter showCloseButton={uploadStep === "select" && !selectedFile}>
                {uploadStep === "select" && selectedFile && (
                  <>
                    <Button variant="outline" onClick={() => { setIsUploadOpen(false); setTimeout(resetUpload, 300); }}>
                      Cancel
                    </Button>
                    <Button className="gradient-primary border-0 text-white" onClick={simulateUploadAndExtract}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upload & Extract
                    </Button>
                  </>
                )}
                {uploadStep === "complete" && (
                  <Button className="gradient-primary border-0 text-white w-full" onClick={handleComplete}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Done — View Quotation
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href="/dashboard/compare">
            <Button className="gradient-primary border-0 text-white"><GitCompare className="w-4 h-4 mr-2" /> AI Compare</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Quotations", value: quotations.length },
          { label: "Under Review", value: quotations.filter(q => q.status === "UNDER_REVIEW").length },
          { label: "Shortlisted", value: quotations.filter(q => q.status === "SHORTLISTED").length },
          { label: "Avg. AI Score", value: Math.round(quotations.reduce((s, q) => s + (q.aiScore || 0), 0) / quotations.length) },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Quotation #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>RFQ</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map(q => (
              <TableRow key={q.id} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{q.quotationNumber}</TableCell>
                <TableCell className="font-medium">{q.vendor?.companyName}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{q.rfqId}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(q.totalAmount)}</TableCell>
                <TableCell className="text-sm">{q.deliveryTime}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    (q.aiScore || 0) >= 90 ? "bg-success/15 text-success" : (q.aiScore || 0) >= 80 ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"
                  }`}>
                    {q.aiScore}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(q.status)}`}>{q.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><ClipboardList className="w-3.5 h-3.5 mr-2" /> Review</DropdownMenuItem>
                      <DropdownMenuItem><GitCompare className="w-3.5 h-3.5 mr-2" /> Compare</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
