export default function CommunitySidebar() {
  return (
    <aside
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "
      aria-labelledby="community-rules-title"
    >
      <h3 id="community-rules-title" className="font-bold text-lg mb-4">
        Community Rules
      </h3>

      <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700">
        <li className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
          </svg>
          Be respectful
        </li>
        <li className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 2a8 8 0 00-8 8v4a4 4 0 004 4h4v-4H6v-4a6 6 0 1112 0v4h-4v4h4a4 4 0 004-4v-4a8 8 0 00-8-8z" />
          </svg>
          No hate speech
        </li>
        <li className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9 12h2v2H9v-2zm0-4h2v2H9V8zm-1 4h4v4H8v-4z" />
          </svg>
          No spam
        </li>
        <li className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M17 8h-1V6a5 5 0 00-10 0v2H3a1 1 0 00-1 1v9a1 1 0 001 1h14a1 1 0 001-1v-9a1 1 0 00-1-1zM7 6a3 3 0 116 0v2H7V6zm8 12H5v-7h10v7z" />
          </svg>
          Stay on topic
        </li>
      </ul>
    </aside>
  );
}