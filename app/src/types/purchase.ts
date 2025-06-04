export enum PurchaseStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  purchasedAt: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    description?: string;
    price: number;
  };
}

export interface RefundRequest {
  reason?: string;
}

export interface RefundResponse {
  refundId: string;
  amount: number;
  status: string;
}

export interface PurchaseStats {
  totalSales: number;
  totalRevenue: number;
  purchasesByStatus: Record<string, number>;
  recentPurchases: Purchase[];
}
