import { useState } from "react";

export default function CreateSpaceModal({ onClose, onCreate }) {
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (spaceName.trim()) {
      onCreate({ name: spaceName, description });
      onClose();
    } else {
      alert("Please enter a space name");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Audio Space</h2>
        <input
          type="text"
          placeholder="Space Name"
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}