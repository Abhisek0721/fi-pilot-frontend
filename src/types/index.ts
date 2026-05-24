// ─── Enums ────────────────────────────────────────────────────────────────────

export type AccountingMethod = 'CASH' | 'ACCRUAL';
export type OrganizationRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'STAFF' | 'VIEWER';
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type TransactionStatus = 'PENDING' | 'CATEGORIZED' | 'NEEDS_REVIEW' | 'APPROVED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type DocumentType =
  | 'BANK_STATEMENT'
  | 'INVOICE'
  | 'BILL'
  | 'RECEIPT'
  | 'PAYMENT_GATEWAY_EXPORT'
  | 'GST_REPORT'
  | 'OTHER';
export type DocumentStatus =
  | 'UPLOADED'
  | 'EXTRACTING'
  | 'CATEGORIZING'
  | 'NEEDS_REVIEW'
  | 'COMPLETED'
  | 'FAILED';
export type InvoiceStatus =
  | 'DRAFT'
  | 'SENT'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'OVERDUE'
  | 'CANCELLED';
export type BillStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentType =
  | 'RECEIVED'
  | 'MADE'
  | 'OWNER_WITHDRAWAL'
  | 'INTERNAL_TRANSFER'
  | 'REFUND'
  | 'GST_PAYMENT';
export type ReconciliationStatus =
  | 'MATCHED'
  | 'PARTIALLY_MATCHED'
  | 'UNMATCHED'
  | 'DUPLICATE_SUSPECTED'
  | 'NEEDS_REVIEW';
export type InsightType =
  | 'MONTHLY_SUMMARY'
  | 'CASH_FLOW_WARNING'
  | 'RECEIVABLES'
  | 'EXPENSE_ANOMALY'
  | 'PROFITABILITY'
  | 'TAX_ESTIMATE'
  | 'MISSING_DOCUMENTS'
  | 'CONCENTRATION_RISK'
  | 'ACTION_LIST';
export type ChatRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  supabaseId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  country: string;
  currency: string;
  taxRegistrationNumber?: string;
  businessType?: string;
  financialYearStart?: string;
  accountingMethod: AccountingMethod;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  organizationId: string;
  name: string;
  accountNumber?: string;
  bankName?: string;
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  organizationId: string;
  bankAccountId: string;
  date: string;
  description: string;
  debit?: number;
  credit?: number;
  balance?: number;
  reference?: string;
  counterpartyName?: string;
  category?: string;
  categoryConfidence?: number;
  categoryReason?: string;
  status: TransactionStatus;
  approvalStatus: ApprovalStatus;
  sourceDocumentId?: string;
  bankAccount?: BankAccount;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  amount: number;
  hsnSac?: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  customerId: string;
  documentId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  paymentTerms?: string;
  notes?: string;
  customer?: Customer;
  lineItems?: InvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BillLineItem {
  id: string;
  billId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  amount: number;
  hsnSac?: string;
}

export interface Bill {
  id: string;
  organizationId: string;
  vendorId: string;
  documentId?: string;
  billNumber: string;
  billDate: string;
  dueDate?: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: BillStatus;
  notes?: string;
  vendor?: Vendor;
  lineItems?: BillLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  organizationId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  status: DocumentStatus;
  extractedData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AiInsight {
  id: string;
  organizationId: string;
  type: InsightType;
  title: string;
  summary: string;
  details?: Record<string, unknown>;
  isRead: boolean;
  priority: number;
  periodStart?: string;
  periodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiChatMessage {
  id: string;
  organizationId: string;
  userId: string;
  role: ChatRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ReconciliationMatch {
  id: string;
  organizationId: string;
  bankTransactionId: string;
  invoiceId?: string;
  billId?: string;
  paymentId?: string;
  status: ReconciliationStatus;
  matchedAmount: number;
  notes?: string;
  bankTransaction?: BankTransaction;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// ─── Report Types ─────────────────────────────────────────────────────────────

export interface PnLReport {
  period: string;
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  revenueBreakdown: Record<string, number>;
  expenseBreakdown: Record<string, number>;
}

export interface BalanceSheet {
  asOf: string;
  assets: Record<string, number>;
  liabilities: Record<string, number>;
  equity: Record<string, number>;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface CashFlowReport {
  period: string;
  openingBalance: number;
  closingBalance: number;
  netCashFlow: number;
  inflows: Record<string, number>;
  outflows: Record<string, number>;
}

export interface AgingBucket {
  current: number;
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
}

export interface ReconciliationStatus {
  total: number;
  matched: number;
  unmatched: number;
  needsReview: number;
  duplicateSuspected: number;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface CreateInvoiceFormData {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  paymentTerms?: string;
  notes?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    hsnSac?: string;
  }[];
}

export interface CreateOrganizationFormData {
  name: string;
  country: string;
  currency: string;
  taxRegistrationNumber?: string;
  businessType?: string;
  accountingMethod: AccountingMethod;
}
