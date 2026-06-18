import { useState } from "react";
import api from "../api/axios";

export default function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch (err) {
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadAvatar = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch (err) {
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploadAvatar, uploading, error };
}
