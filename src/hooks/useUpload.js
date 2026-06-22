import { useState, useCallback } from "react";
import api from "../api/axios";

// Compress image before upload
const compressImage = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          // Only use compressed if it's smaller
          if (blob.size < file.size) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
};

export default function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file, { compress = true, maxWidth = 1200 } = {}) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const toUpload = compress ? await compressImage(file, maxWidth) : file;
      const formData = new FormData();
      formData.append("image", toUpload);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      return res.data.url;
    } catch (err) {
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const compressed = await compressImage(file, 400, 0.9);
      const formData = new FormData();
      formData.append("avatar", compressed);
      const res = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      return res.data.url;
    } catch (err) {
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const uploadVideo = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be under 100MB");
        return null;
      }
      const formData = new FormData();
      formData.append("video", file);
      const res = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      return res.data.url;
    } catch (err) {
      setError("Video upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const uploadStoryMedia = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const isVideo = file.type.startsWith("video/");
      const toUpload = isVideo ? file : await compressImage(file, 1080, 0.9);
      const formData = new FormData();
      formData.append("media", toUpload);
      const res = await api.post("/upload/story", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      return { url: res.data.url, type: res.data.type };
    } catch (err) {
      setError("Story upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  return { uploadImage, uploadAvatar, uploadVideo, uploadStoryMedia, uploading, progress, error };
}
