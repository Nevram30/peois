export default function DocumentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="rounded-full bg-yellow-100 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Under Development</h1>
      <p className="text-gray-500 max-w-md">
        The <span className="font-semibold">Documents</span> page is currently
        under development. Please check back later.
      </p>
    </div>
  );
}
