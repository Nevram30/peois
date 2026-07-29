/**
 * Shared IT Help Desk page content, rendered under each role's route
 * (/admin, /user, /archiver, /super-admin) so it inherits that role's shell.
 * NOTE: update the contact details below with the real IT support channels.
 */
export const ItHelpDesk = () => {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">IT Help Desk</h1>
          <p className="text-sm text-gray-500">
            Need assistance with the system? Reach out to the IT support team.
          </p>
        </div>
      </div>

      {/* Contact channels */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Email Support</h2>
          <p className="mt-1 text-xs text-gray-500">
            Send us a detailed description of your issue.
          </p>
          {/* <a
            href="mailto:it-support@davaodelnorte.gov.ph"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            it-support@davaodelnorte.gov.ph
          </a> */}
        </div>

        <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Phone / Local</h2>
          <p className="mt-1 text-xs text-gray-500">
            Call the IT office during working hours (8:00 AM – 5:00 PM).
          </p>
          <p className="mt-3 text-sm font-medium text-gray-900">Local 101 — IT Division</p>
        </div>

        <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Visit the IT Office</h2>
          <p className="mt-1 text-xs text-gray-500">
            For hardware or account concerns, visit us in person.
          </p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Provincial Engineer&apos;s Office, Capitol Compound
          </p>
        </div>
      </div>

      {/* Tips before contacting */}
      <div className="mt-6 rounded-sm border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Before contacting support</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          {[
            "Note the exact error message or take a screenshot of the issue.",
            "Include the page you were on and what you were trying to do.",
            "Try refreshing the page or logging out and back in first.",
            "For login problems, verify your email and password are correct before requesting a reset.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Ticketing note */}
      <div className="mt-6 flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 p-4">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-sm text-amber-700">
          An online ticketing system is under development. For now, please use the
          channels above to reach the IT team.
        </p>
      </div>
    </div>
  );
}
