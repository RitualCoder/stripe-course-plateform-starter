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
    return response;
  },

  // Récupérer les détails d'un achat
  getPurchaseById: async (purchaseId: string): Promise<Purchase> => {
    const response = await api.get(`/purchases/${purchaseId}`);
    return response;
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
    return response;
  },

  // Vérifier l'accès à un cours
  checkCourseAccess: async (
    courseId: string
  ): Promise<{ hasAccess: boolean }> => {
    const response = await api.get(`/courses/${courseId}/access`);
    console.log("Response from checkCourseAccess:", response);
    return { hasAccess: response };
  },

  /**
   * Récupère une session Stripe par son ID
   * @param sessionId L'ID de la session Stripe (ex: "cs_test_123…")
   */
  getCheckoutSession: async (
    sessionId: string
  ): Promise<{ url: string; [key: string]: any }> => {
    const response = await api.get(`/stripe/session/${sessionId}`);
    console.log("Response from getCheckoutSession:", response);
    return response;
  },
};
