import { useState, useEffect } from "react";

export default function ImageUploader({ onSelect }) {
  const [preview, setPreview] = useState("");

  const change = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onSelect(file);
    } else {
      setPreview("");
    }
  };

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={change}
        className="mb-3"
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="rounded-xl max-h-64 object-cover"
        />
      ) : (
        <p className="text-gray-500">Select an image to preview</p>
      )}
    </div>
  );
}