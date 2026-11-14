import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const dataOf = (response) => response.data?.data ?? response.data;

export const mediaService = {
  async uploadFile(file, purpose) {
    const intent = dataOf(await axiosInstance.post(API_PATHS.MEDIA.UPLOAD_INTENTS, {
      purpose,
      fileName: file.name,
      contentType: file.type,
      byteSize: file.size,
    }));

    await axios.put(intent.uploadUrl, file, {
      headers: { "Content-Type": file.type },
      withCredentials: false,
    });

    const completion = dataOf(await axiosInstance.post(API_PATHS.MEDIA.COMPLETE(intent.mediaId)));
    return { mediaId: completion.mediaId ?? intent.mediaId };
  },

  async getUrl(mediaId) {
    const result = dataOf(await axiosInstance.get(API_PATHS.MEDIA.URL(mediaId)));
    return result.url;
  },
  async remove(mediaId) {
    await axiosInstance.delete(API_PATHS.MEDIA.DELETE(mediaId));
  },
};

export default mediaService;
