/**
 * Fixed footer pinned to the bottom of the viewport across all shells.
 * Sits above page content; shells add matching bottom padding so nothing
 * is hidden behind it. Hidden when printing.
 */
export const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-8 items-center justify-center border-t border-gray-200 bg-white px-4 print:hidden">
      <p className="truncate text-center text-[11px] leading-none text-gray-500">
        Copyright © 2026 Provincial Engineering Office Project Management Information System
      </p>
    </footer>
  );
};
