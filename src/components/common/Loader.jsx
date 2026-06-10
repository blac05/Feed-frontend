export default function Loader({ size = "h-12 w-12", color = "border-blue-600" }) {
  return (
    <div className="flex justify-center items-center p-10" aria-label="Loading">
      <div
        className={`animate-spin rounded-full ${size} border-b-2 ${color}`}
      />
    </div>
  );
}