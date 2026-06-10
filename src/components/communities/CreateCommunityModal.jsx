import { useState } from "react";
import { createCommunity }
from "../../services/communityService";

export default function CreateCommunityModal({
  open,
  onClose,
}) {
  const [name,setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const handleSubmit =
    async () => {

      await createCommunity({
        name,
        description,
      });

      onClose();
    };

  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0
      bg-black/50
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        bg-white
        rounded-2xl
        p-6
        w-[500px]
        "
      >
        <h2
          className="
          text-2xl
          font-bold
          mb-4
          "
        >
          Create Community
        </h2>

        <input
          value={name}
          onChange={e =>
            setName(e.target.value)
          }
          placeholder="Community Name"
          className="
          border
          p-3
          w-full
          rounded-xl
          mb-3
          "
        />

        <textarea
          value={description}
          onChange={e =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          className="
          border
          p-3
          w-full
          rounded-xl
          "
        />

        <button
          onClick={handleSubmit}
          className="
          mt-4
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          Create
        </button>
      </div>
    </div>
  );
}