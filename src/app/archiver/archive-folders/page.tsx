"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { formatPeso } from "~/helper/formatter";

type ArchiveEntry = RouterOutputs["archive"]["getAll"][number];

type ViewMode = "grid" | "list";

// Folder depth: [] = root, [label], [label, range], [label, range, boxNumber].
// Entries (projects) are the "files" that live at the deepest level.
type FolderPath = string[];

const VIEW_STORAGE_KEY = "archiver-folders-view";
const UNASSIGNED = "Unassigned";

const LABEL_TITLE: Record<string, string> = {
  COMPLETED: "Completed",
  OTHERS: "Others",
};

const districtLabel = (d: string) =>
  d === "DISTRICT_I" ? "District I" : d === "DISTRICT_II" ? "District II" : d;

// `boxNumbers` is stored as a comma-joined string; a project may sit in more
// than one box, so it shows up inside each of those box folders.
const boxNumbersOf = (e: ArchiveEntry) => {
  const parts = (e.boxNumbers ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [UNASSIGNED];
};

const segmentOf = (e: ArchiveEntry, depth: number): string[] => {
  if (depth === 0) return [e.boxLabel];
  if (depth === 1) return [e.boxRange];
  return boxNumbersOf(e);
};

const matchesPath = (e: ArchiveEntry, path: FolderPath) => {
  if (path[0] && e.boxLabel !== path[0]) return false;
  if (path[1] && e.boxRange !== path[1]) return false;
  if (path[2] && !boxNumbersOf(e).includes(path[2])) return false;
  return true;
};

const folderTitle = (name: string, depth: number) => {
  if (depth === 0) return LABEL_TITLE[name] ?? name;
  if (depth === 1) return `Box Range ${name}`;
  return name === UNASSIGNED ? "Unassigned Box" : `Box ${name}`;
};

// Ranges sort by their lower bound ("1-15" before "16-30"); box numbers sort
// numerically with the unassigned bucket pinned last.
const sortSegments = (names: string[], depth: number) => {
  if (depth === 0) {
    return [...names].sort((a, b) =>
      a === b ? 0 : a === "COMPLETED" ? -1 : b === "COMPLETED" ? 1 : a.localeCompare(b),
    );
  }
  return [...names].sort((a, b) => {
    if (a === UNASSIGNED) return 1;
    if (b === UNASSIGNED) return -1;
    const na = Number(a.split("-")[0]);
    const nb = Number(b.split("-")[0]);
    if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
    return a.localeCompare(b);
  });
};

const ArchiveBoxIcon = ({ className = "h-full w-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
    />
  </svg>
);

const FileIcon = ({ className = "h-full w-full" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const BoxLabelPill = ({ label }: { label: string }) =>
  label === "COMPLETED" ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-800">
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
      Others
    </span>
  );

const ArchiveFoldersPage = () => {
  const [path, setPath] = useState<FolderPath>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<ArchiveEntry | null>(null);

  const { data: entries, isLoading } = api.archive.getAll.useQuery();

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "grid" || stored === "list") setView(stored);
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setView(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const term = search.trim().toLowerCase();
  const searching = term.length > 0;

  // Search cuts across the whole archive, the way Drive's search leaves the
  // current folder behind.
  const searchResults = useMemo(() => {
    if (!searching) return [];
    return (entries ?? []).filter((e) =>
      [
        e.project.title,
        e.project.projectCode,
        e.project.budgetYear ?? "",
        LABEL_TITLE[e.boxLabel] ?? e.boxLabel,
        e.boxRange,
        e.boxNumbers ?? "",
        e.createdBy.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [entries, searching, term]);

  const scoped = useMemo(
    () => (entries ?? []).filter((e) => matchesPath(e, path)),
    [entries, path],
  );

  // Sub-folders of the current level, each with the number of projects beneath.
  const folders = useMemo(() => {
    if (path.length >= 3) return [];
    const counts = new Map<string, number>();
    scoped.forEach((e) =>
      segmentOf(e, path.length).forEach((name) =>
        counts.set(name, (counts.get(name) ?? 0) + 1),
      ),
    );
    return sortSegments([...counts.keys()], path.length).map((name) => ({
      name,
      count: counts.get(name) ?? 0,
    }));
  }, [scoped, path]);

  // Files only surface in the deepest folder, so a project appears once.
  const files = useMemo(
    () =>
      path.length >= 3
        ? [...scoped].sort((a, b) => a.project.title.localeCompare(b.project.title))
        : [],
    [scoped, path],
  );

  const open = (name: string) => {
    setPath((p) => [...p, name]);
    setSelected(null);
  };
  const goTo = (depth: number) => {
    setPath((p) => p.slice(0, depth));
    setSelected(null);
  };

  const totalProjects = new Set(scoped.map((e) => e.projectId)).size;
  const showEmpty =
    !isLoading &&
    (searching ? searchResults.length === 0 : folders.length + files.length === 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        <button
          onClick={() => goTo(0)}
          className={`transition hover:text-amber-600 ${path.length === 0 ? "text-gray-600" : ""}`}
        >
          Archive Boxes
        </button>
        {path.map((seg, i) => (
          <span key={`${seg}-${i}`} className="flex items-center gap-1.5">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <button
              onClick={() => goTo(i + 1)}
              className={`transition hover:text-amber-600 ${i === path.length - 1 ? "text-gray-600" : ""}`}
            >
              {folderTitle(seg, i)}
            </button>
          </span>
        ))}
      </nav>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {path.length === 0
              ? "Archive Projects"
              : folderTitle(path[path.length - 1]!, path.length - 1)}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse the physical archive by box label, range, and box number.
          </p>
        </div>
        {path.length > 0 && (
          <button
            onClick={() => goTo(path.length - 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm sm:p-4">
        <div className="relative min-w-0 flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archive by project, code, or box..."
            className="block w-full rounded-lg border border-gray-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>

        {!searching && (
          <p className="hidden text-[11px] font-semibold uppercase tracking-wider text-gray-500 sm:block">
            {folders.length > 0 && `${folders.length} box${folders.length === 1 ? "" : "es"} · `}
            {totalProjects} project{totalProjects === 1 ? "" : "s"}
          </p>
        )}

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid view"
            aria-label="Grid view"
            className={`rounded-md p-1.5 transition ${view === "grid" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            title="List view"
            aria-label="List view"
            className={`rounded-md p-1.5 transition ${view === "list" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Browser */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-400">Loading archive...</p>
        ) : showEmpty ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ArchiveBoxIcon className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">
              {searching ? "No matches found" : "This box is empty"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {searching
                ? "Try a different project title, code, or box number."
                : "Archive a project from the Projects page to file it here."}
            </p>
          </div>
        ) : searching ? (
          <>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              {searchResults.length} result{searchResults.length === 1 ? "" : "s"} in the archive
            </p>
            {view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((e) => (
                  <FileCard key={e.id} entry={e} showLocation onOpen={() => setSelected(e)} />
                ))}
              </div>
            ) : (
              <ItemList
                folders={[]}
                files={searchResults}
                depth={path.length}
                showLocation
                onOpenFolder={open}
                onOpenFile={setSelected}
              />
            )}
          </>
        ) : view === "grid" ? (
          <div className="space-y-6">
            {folders.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Boxes
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {folders.map((f) => (
                    <FolderCard
                      key={f.name}
                      name={f.name}
                      depth={path.length}
                      count={f.count}
                      onOpen={() => open(f.name)}
                    />
                  ))}
                </div>
              </div>
            )}
            {files.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Projects
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {files.map((e) => (
                    <FileCard key={e.id} entry={e} onOpen={() => setSelected(e)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <ItemList
            folders={folders}
            files={files}
            depth={path.length}
            onOpenFolder={open}
            onOpenFile={setSelected}
          />
        )}
      </div>

      {selected && (
        <ArchiveEntryModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const FolderCard = ({
  name,
  depth,
  count,
  onOpen,
}: {
  name: string;
  depth: number;
  count: number;
  onOpen: () => void;
}) => {
  const tone =
    depth === 0
      ? name === "COMPLETED"
        ? "text-green-500"
        : "text-slate-400"
      : "text-amber-500";

  return (
    <button
      onClick={onOpen}
      onDoubleClick={onOpen}
      className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-slate-50/60 p-3 text-left transition hover:border-amber-200 hover:bg-amber-50/60"
    >
      <span className={`h-9 w-9 shrink-0 ${tone}`}>
        <ArchiveBoxIcon />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-gray-900">
          {folderTitle(name, depth)}
        </span>
        <span className="mt-0.5 block text-xs text-gray-500">
          {count} project{count === 1 ? "" : "s"}
        </span>
      </span>
    </button>
  );
};

const FileCard = ({
  entry,
  showLocation = false,
  onOpen,
}: {
  entry: ArchiveEntry;
  showLocation?: boolean;
  onOpen: () => void;
}) => (
  <button
    onClick={onOpen}
    onDoubleClick={onOpen}
    className="flex w-full flex-col rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm transition hover:border-amber-200 hover:shadow-md"
  >
    <div className="flex items-start gap-2.5">
      <span className="h-8 w-8 shrink-0 text-[#1e3a5f]">
        <FileIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900" title={entry.project.title}>
          {entry.project.title}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[11px] text-gray-400">
          {entry.project.projectCode}
        </span>
      </span>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <BoxLabelPill label={entry.boxLabel} />
      {showLocation && (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          {entry.boxRange} · Box {entry.boxNumbers ?? "—"}
        </span>
      )}
      {entry.project.budgetYear && (
        <span className="text-[11px] text-gray-500">FY {entry.project.budgetYear}</span>
      )}
    </div>
  </button>
);

const ItemList = ({
  folders,
  files,
  depth,
  showLocation = false,
  onOpenFolder,
  onOpenFile,
}: {
  folders: { name: string; count: number }[];
  files: ArchiveEntry[];
  depth: number;
  showLocation?: boolean;
  onOpenFolder: (name: string) => void;
  onOpenFile: (entry: ArchiveEntry) => void;
}) => (
  <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
    <table className="w-full min-w-175 text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Name</th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Box Label</th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Location</th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Archived By</th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Archive Date</th>
        </tr>
      </thead>
      <tbody>
        {folders.map((f) => (
          <tr
            key={`folder-${f.name}`}
            onClick={() => onOpenFolder(f.name)}
            className="cursor-pointer border-b border-gray-50 hover:bg-amber-50/50"
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className={`h-5 w-5 shrink-0 ${depth === 0 && f.name === "COMPLETED" ? "text-green-500" : depth === 0 ? "text-slate-400" : "text-amber-500"}`}>
                  <ArchiveBoxIcon />
                </span>
                <span className="font-medium text-gray-900">{folderTitle(f.name, depth)}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-gray-400">Box</td>
            <td className="px-4 py-3 text-gray-600">
              {f.count} project{f.count === 1 ? "" : "s"}
            </td>
            <td className="px-4 py-3 text-gray-400">—</td>
            <td className="px-4 py-3 text-gray-400">—</td>
          </tr>
        ))}
        {files.map((e) => (
          <tr
            key={e.id}
            onClick={() => onOpenFile(e)}
            className="cursor-pointer border-b border-gray-50 hover:bg-gray-50"
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 shrink-0 text-[#1e3a5f]">
                  <FileIcon />
                </span>
                <div className="min-w-0">
                  <p className="max-w-80 truncate font-medium text-gray-900" title={e.project.title}>
                    {e.project.title}
                  </p>
                  <p className="font-mono text-xs text-gray-400">{e.project.projectCode}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <BoxLabelPill label={e.boxLabel} />
            </td>
            <td className="px-4 py-3 font-mono text-xs text-gray-600">
              {showLocation || depth < 3
                ? `${e.boxRange} · Box ${e.boxNumbers ?? "—"}`
                : `Box ${e.boxNumbers ?? "—"}`}
            </td>
            <td className="px-4 py-3 text-gray-600">{e.createdBy.name ?? "—"}</td>
            <td className="px-4 py-3 text-gray-600">
              {new Date(e.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ArchiveEntryModal = ({
  entry,
  onClose,
}: {
  entry: ArchiveEntry;
  onClose: () => void;
}) => {
  const p = entry.project;

  const rows: [string, string][] = [
    ["Project Code", p.projectCode],
    ["Budget Year", p.budgetYear ?? "—"],
    ["Status", p.status.replaceAll("_", " ")],
    ["District", districtLabel(p.locationImplementation)],
    ["City / Municipality", p.cityMunicipality ?? "—"],
    ["Contractor", p.contractorName ?? "—"],
    ["Project Engineer", p.projectEngineer ?? "—"],
    ["Project Cost", formatPeso(p.projectCost)],
    ["Contract Cost", formatPeso(p.contractCost)],
    [
      "Date Started",
      p.dateStarted ? new Date(p.dateStarted).toLocaleDateString() : "—",
    ],
    [
      "Date Completed",
      p.dateCompleted ? new Date(p.dateCompleted).toLocaleDateString() : "—",
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="h-9 w-9 shrink-0 text-[#1e3a5f]">
              <FileIcon />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Archived Project
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-gray-900">{p.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl bg-amber-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Physical Location
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Box Label
                </dt>
                <dd className="mt-1">
                  <BoxLabelPill label={entry.boxLabel} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Box Range
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">{entry.boxRange}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Box Number
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">{entry.boxNumbers ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Archived By
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {entry.createdBy.name ?? "—"} ·{" "}
                  {new Date(entry.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
            {entry.remarks && (
              <p className="mt-3 border-t border-amber-100 pt-3 text-sm text-gray-600">
                {entry.remarks}
              </p>
            )}
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1e3a5f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#16304f]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveFoldersPage;
