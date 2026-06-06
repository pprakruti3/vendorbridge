// ============================================================
// VendorBridge AI — Type Definitions
// ============================================================

export type UserRole = 'ADMIN' | 'PROCUREMENT' | 'MANAGER' | 'VENDOR' | 'CEO';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED' | 'PENDING';

export interface Vendor {
  id: string;
  companyName: string;
  vendorCode: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  category: string;
  rating: number;
  status: VendorStatus;
  userId?: string;
  healthScore: number;
  reliabilityScore: number;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorContact {
  id: string;
  vendorId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  isPrimary: boolean;
}

export type RFQStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
export type RFQPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: RFQStatus;
  createdById: string;
  priority: RFQPriority;
  category: string;
  items: RFQItem[];
  vendors: RFQVendor[];
  attachments: RFQAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface RFQItem {
  id: string;
  rfqId: string;
  itemName: string;
  description: string;
  unit: string;
  quantity: number;
  specifications: string;
}

export interface RFQVendor {
  id: string;
  rfqId: string;
  vendorId: string;
  vendor?: Vendor;
  status: 'INVITED' | 'VIEWED' | 'RESPONDED' | 'DECLINED';
  invitedAt: string;
  respondedAt?: string;
}

export interface RFQAttachment {
  id: string;
  rfqId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export type QuotationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface Quotation {
  id: string;
  quotationNumber: string;
  rfqId: string;
  rfq?: RFQ;
  vendorId: string;
  vendor?: Vendor;
  totalAmount: number;
  taxAmount: number;
  gstAmount: number;
  deliveryTime: string;
  warranty: string;
  paymentTerms: string;
  supportDetails: string;
  status: QuotationStatus;
  aiExtractedData?: Record<string, unknown>;
  aiScore?: number;
  items: QuotationItem[];
  attachments: QuotationAttachment[];
  submittedAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  rfqItemId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  gst: number;
  specifications: string;
}

export interface QuotationAttachment {
  id: string;
  quotationId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface AIComparison {
  id: string;
  rfqId: string;
  vendorScores: VendorScore[];
  recommendedVendorId: string;
  recommendedVendor?: Vendor;
  confidenceScore: number;
  reasons: string[];
  potentialSavings: number;
  comparisonMatrix: ComparisonRow[];
  negotiationSuggestions: string[];
  generatedAt: string;
}

export interface VendorScore {
  vendorId: string;
  vendorName: string;
  priceScore: number;
  deliveryScore: number;
  historyScore: number;
  warrantyScore: number;
  riskScore: number;
  overallScore: number;
}

export interface ComparisonRow {
  parameter: string;
  vendors: { vendorId: string; vendorName: string; value: string; score: number }[];
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalEntityType = 'RFQ' | 'QUOTATION' | 'PO' | 'INVOICE';

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  entityType: ApprovalEntityType;
  entityId: string;
  status: ApprovalStatus;
  requestedById: string;
  requestedBy?: User;
  steps: ApprovalStep[];
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  requestId: string;
  level: number;
  approverId: string;
  approver?: User;
  status: ApprovalStatus | 'SKIPPED';
  comments: string;
  actionAt?: string;
}

export type POStatus = 'DRAFT' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'COMPLETED' | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqId: string;
  quotationId: string;
  vendorId: string;
  vendor?: Vendor;
  totalAmount: number;
  taxAmount: number;
  status: POStatus;
  approvalRef: string;
  digitalSignature?: string;
  items: POItem[];
  createdAt: string;
}

export interface POItem {
  id: string;
  poId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  gst: number;
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  vendorId: string;
  vendor?: Vendor;
  subtotal: number;
  taxAmount: number;
  gstAmount: number;
  totalAmount: number;
  taxBreakdown: Record<string, number>;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export type NotificationType = 'RFQ' | 'QUOTATION' | 'APPROVAL' | 'PO' | 'INVOICE' | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type FraudAlertType = 'DUPLICATE_INVOICE' | 'FAKE_GST' | 'COLLUSION' | 'ABNORMAL_PRICING' | 'SUSPICIOUS_QUOTE';
export type FraudSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FraudAlert {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  alertType: FraudAlertType;
  description: string;
  severity: FraudSeverity;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  evidence: Record<string, unknown>;
  detectedAt: string;
}

export interface DashboardStats {
  totalVendors: number;
  activeRFQs: number;
  pendingApprovals: number;
  purchaseOrders: number;
  invoices: number;
  monthlySpend: number;
  savingsGenerated: number;
  procurementTrends: TrendData[];
}

export interface TrendData {
  month: string;
  spend: number;
  savings: number;
  orders: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
