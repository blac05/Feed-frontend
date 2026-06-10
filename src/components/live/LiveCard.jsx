import { Eye } from "lucide-react";

export default function LiveCard({ title = "Live Stream", viewers = 124 }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:scale-105 transform transition-transform duration-200 cursor-pointer">
      <div className="h-56 bg-gradient-to-r from-blue-500 to-blue-700 relative">
        {/* Optional: Add a live badge at the top corner */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
          LIVE
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>

        <div className="flex items-center gap-2 text-red-500 mt-2">
          <div className="flex items-center gap-1">
            <Eye size={16} aria-hidden="true" />
            <span className="text-sm">{viewers} viewers</span>
          </div>
        </div>
      </div>
    </div>
  );
}