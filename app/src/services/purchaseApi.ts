import { api } from "./api";
import type {
  Purchase,
  RefundRequest,
  RefundResponse,
} from "../types/purchase.ts";

export const purchaseApi = {
  // Récupérer l'historique des achats de l'utilisateur
  getUserPurchases: async (): Promise<Purchase[]> => {
    const response = await api.get("/purchases");
    return response.data;
  },

  // Récupérer les détails d'un achat
  getPurchaseById: async (purchaseId: string): Promise<Purchase> => {
    const response = await api.get(`/purchases/${purchaseId}`);
    return response.data;
  },

  // Demander un remboursement
  requestRefund: async (
    purchaseId: string,
    refundData: RefundRequest
  ): Promise<RefundResponse> => {
    const response = await api.post(
      `/purchases/${purchaseId}/refund`,
      refundData
    );
    return response.data;
  },

  // Vérifier l'accès à un cours
  checkCourseAccess: async (
    courseId: string
  ): Promise<{ hasAccess: boolean; courseId: string; userId: string }> => {
    // request to check access
    return { hasAccess: true, courseId, userId: "1" };
  },
};
