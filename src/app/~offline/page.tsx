import Image from "next/image";

export const metadata = {
  title: "Offline | PEO-PMIS",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="h-1.5 w-full rounded-t-2xl bg-amber-500" />
        <div className="rounded-b-2xl bg-white px-6 py-10 text-center shadow-md">
          <div className="mb-4 flex justify-center">
            <Image
              src="/icons/icon-192.png"
              alt="PEO Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900">You&apos;re offline</h1>
          <p className="mt-2 text-sm text-gray-500">
            PEO-PMIS needs an internet connection. Please check your network
            and try again.
          </p>
          {/* Full page load on purpose: retries the network instead of client-navigating */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            Retry
          </a>
        </div>
      </div>
    </main>
  );
}
