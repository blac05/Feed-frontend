import { Eye } from "lucide-react";

export default function LiveCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow">
      <div className="h-56 bg-gradient-to-r from-blue-500 to-blue-700" />

      <div className="p-4">
        <h3 className="font-bold">
          Live Stream
        </h3>

        <div className="flex items-center gap-2 text-red-500 mt-2">
          LIVE
        </div>

        <div className="flex gap-2 mt-2">
          <Eye size={16} />
          124 viewers
        </div>
      </div>
    </div>
  );
}