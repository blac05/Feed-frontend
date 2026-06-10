import { useState } from "react";

export default function ImageUploader({
  onSelect,
}) {
  const [preview, setPreview] =
    useState("");

  const change = e => {
    const file =
      e.target.files[0];

    setPreview(
      URL.createObjectURL(file)
    );

    onSelect(file);
  };

  return (
    <div>
      <input
        type="file"
        onChange={change}
      />

      {preview && (
        <img
          src={preview}
          className="mt-3 rounded-xl max-h-64"
        />
      )}
    </div>
  );
}