export default function ViewerCounter({ count }) {
  return (
    <div
      className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-2"
      aria-label={`${count} viewers watching`}
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M10 3C5 3 1.73 7.11 1 12c.73 4.89 4 9 9 9s8.27-4.11 9-9c-.73-4.89-4-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-12a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
      <span className="font-semibold">{count} viewers</span>
    </div>
  );
}