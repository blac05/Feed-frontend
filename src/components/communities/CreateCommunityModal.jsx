import { useState } from "react";
import { createCommunity } from "../../services/communityService";

export default function CreateCommunityModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createCommunity({ name, description });
      onClose();
    } catch (err) {
      setError("Failed to create community. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[500px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Create Community</h2>

        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Community Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Community Name"
              className="border p-3 w-full rounded-xl"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border p-3 w-full rounded-xl"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl w-full disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}