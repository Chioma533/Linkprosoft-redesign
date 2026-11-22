import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const dataOf = (response) => response.data?.data ?? response.data;

export const disputeService = {
  /**
   * Submit uploaded media as dispute evidence
   * POST /api/disputes/:id/evidence
   */
  async submitEvidence(disputeId, { mediaId, caption, sortOrder }) {
    const response = await axiosInstance.post(API_PATHS.DISPUTES.EVIDENCE(disputeId), {
      mediaId,
      caption,
      sortOrder,
    });
    return dataOf(response);
  },

  /**
   * Retrieve all evidence for a dispute with signed URLs
   * GET /api/disputes/:id/evidence
   */
  async getEvidence(disputeId) {
    const response = await axiosInstance.get(API_PATHS.DISPUTES.EVIDENCE(disputeId));
    return dataOf(response);
  },

  /**
   * Delete own evidence from a dispute
   * DELETE /api/disputes/:id/evidence/:mediaId
   */
  async deleteEvidence(disputeId, mediaId) {
    const response = await axiosInstance.delete(API_PATHS.DISPUTES.EVIDENCE_ITEM(disputeId, mediaId));
    return dataOf(response);
  },

  /**
   * Get an expiring download link with audit trail
   * GET /api/disputes/:id/evidence/:mediaId/download
   */
  async getDownloadUrl(disputeId, mediaId) {
    const response = await axiosInstance.get(API_PATHS.DISPUTES.EVIDENCE_DOWNLOAD(disputeId, mediaId));
    return dataOf(response);
  },

  /**
   * Link existing assignment gallery or chat attachment as referenced evidence
   * POST /api/disputes/:id/evidence/reference
   */
  async linkReference(disputeId, { mediaId, type }) {
    const response = await axiosInstance.post(API_PATHS.DISPUTES.LINK_REFERENCE(disputeId), {
      mediaId,
      type,
    });
    return dataOf(response);
  },
};

export default disputeService;
