// ============================================================
// VendorBridge AI — Utility Functions
// ============================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getRelativeTime(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Common
    ACTIVE: 'bg-success/15 text-success border-success/20',
    INACTIVE: 'bg-muted text-muted-foreground border-muted',
    PENDING: 'bg-warning/15 text-warning border-warning/20',
    
    // RFQ
    DRAFT: 'bg-muted text-muted-foreground border-muted',
    PUBLISHED: 'bg-info/15 text-info border-info/20',
    CLOSED: 'bg-muted text-muted-foreground border-muted',
    AWARDED: 'bg-success/15 text-success border-success/20',
    CANCELLED: 'bg-destructive/15 text-destructive border-destructive/20',
    
    // Quotation
    SUBMITTED: 'bg-info/15 text-info border-info/20',
    UNDER_REVIEW: 'bg-warning/15 text-warning border-warning/20',
    SHORTLISTED: 'bg-primary/15 text-primary border-primary/20',
    ACCEPTED: 'bg-success/15 text-success border-success/20',
    REJECTED: 'bg-destructive/15 text-destructive border-destructive/20',
    
    // Approval
    APPROVED: 'bg-success/15 text-success border-success/20',
    
    // PO
    SENT: 'bg-info/15 text-info border-info/20',
    ACKNOWLEDGED: 'bg-primary/15 text-primary border-primary/20',
    COMPLETED: 'bg-success/15 text-success border-success/20',
    
    // Invoice
    PAID: 'bg-success/15 text-success border-success/20',
    OVERDUE: 'bg-destructive/15 text-destructive border-destructive/20',
    
    // Vendor
    BLACKLISTED: 'bg-destructive/15 text-destructive border-destructive/20',
    
    // Fraud
    OPEN: 'bg-destructive/15 text-destructive border-destructive/20',
    INVESTIGATING: 'bg-warning/15 text-warning border-warning/20',
    RESOLVED: 'bg-success/15 text-success border-success/20',
    DISMISSED: 'bg-muted text-muted-foreground border-muted',
  };
  return colors[status] || 'bg-muted text-muted-foreground border-muted';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-info/15 text-info border-info/20',
    MEDIUM: 'bg-warning/15 text-warning border-warning/20',
    HIGH: 'bg-destructive/15 text-destructive border-destructive/20',
    CRITICAL: 'bg-destructive/20 text-destructive border-destructive/30',
  };
  return colors[severity] || 'bg-muted text-muted-foreground border-muted';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-muted text-muted-foreground',
    MEDIUM: 'bg-info/15 text-info',
    HIGH: 'bg-warning/15 text-warning',
    URGENT: 'bg-destructive/15 text-destructive',
  };
  return colors[priority] || 'bg-muted text-muted-foreground';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
