"use client";

import { useMemo, useState } from "react";
import { Check, CircleCheck, Pencil, Trash2, X } from "lucide-react";
import {
    computeSlippage,
    formatSlippage,
    getSlippageStageConfig,
} from "~/lib/slippage";
import {
    SCurveCard,
    StageLegendStrip,
    TrendIcon,
    type SCurveProject,
} from "~/app/admin/_components/admin-charts/physical-progress-section";

// ── Types ──────────────────────────────────────────────────────

export type ProgressEntry = {
    id: string;
    /** A Date from the server, or `yyyy-mm-dd` for rows queued on the Add form. */
    date: Date | string;
    target: number;
    revisedTarget: number | null;
    actual: number;
    revision: number;
    remarks: string | null;
};

export type ProgressEntryInput = {
    /** `yyyy-mm-dd`, as the date input gives it. */
    date: string;
    target: number;
    revisedTarget: number | null;
    actual: number;
    remarks: string;
};

type DateLike = Date | string | null | undefined;

// ── Helpers ────────────────────────────────────────────────────

// A `yyyy-mm-dd` string is read as a local calendar day; `new Date(string)`
// would read it as UTC midnight, a day early west of Greenwich.
const toDate = (d: Date | string) => {
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const [y, m, day] = d.split("-").map(Number);
        return new Date(y!, m! - 1, day);
    }
    return new Date(d);
};
const toDateOrNull = (d: DateLike) => (d ? toDate(d) : null);

const toInputDate = (d: Date | string) => {
    const date = toDate(d);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};
const todayInputDate = () => toInputDate(new Date());

const fullDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });

// Anything that is not a 0–100 percentage reads as "not entered".
const parsePercent = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return null;
    return parsed;
};

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Try again.");

// ── Form pieces ────────────────────────────────────────────────

const fieldLabel = "mb-1.5 block text-[13px] font-semibold text-slate-600";
const filledInput =
    "h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-[15px] text-slate-800 shadow-inner placeholder:text-slate-400 focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20";
const cellInput =
    "h-8 w-full rounded-sm border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20";

const PercentInput = ({
    value,
    onChange,
    placeholder = "0.00",
    invalid,
    className = filledInput,
    label,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    invalid?: boolean;
    className?: string;
    label: string;
}) => (
    <div className="relative">
        <input
            type="text"
            inputMode="decimal"
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${className} pr-8 ${invalid ? "border-red-400 ring-2 ring-red-200" : ""}`}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-500">%</span>
    </div>
);

const emptyDraft = () => ({ date: todayInputDate(), target: "", revised: "", actual: "", remarks: "" });
type Draft = ReturnType<typeof emptyDraft>;

// Validates a draft into the values the parent files. Returns an error
// message instead when a required field is missing or out of range.
const readDraft = (draft: Draft): ProgressEntryInput | string => {
    if (!draft.date) return "Enter the date recorded.";
    const target = parsePercent(draft.target);
    const actual = parsePercent(draft.actual);
    if (target === null || actual === null) return "Target and actual must each be between 0 and 100.";
    const revisedTarget = draft.revised.trim() === "" ? null : parsePercent(draft.revised);
    if (draft.revised.trim() !== "" && revisedTarget === null) return "Revised target must be between 0 and 100.";
    return { date: draft.date, target, revisedTarget, actual, remarks: draft.remarks.trim() };
};

// ── Panel ──────────────────────────────────────────────────────
// Physical Progress & Slippage Overview for one project: the stage legend,
// the S-curve, the history of recorded entries (edit / delete per row) and
// the form that records the next one. Storage is the parent's: the edit page
// files straight to the server, the Add form queues rows until the project
// is created. Each handler may return a promise; a rejection is shown here.
// `readOnly` (the view page) drops the Actions column and the record form.
export const ProgressSlippagePanel = ({
    entries,
    dateStarted,
    targetCompletionDate,
    revisedCompletionDate,
    onRecord,
    onUpdate,
    onDelete,
    readOnly = false,
}: {
    entries: ProgressEntry[];
    dateStarted: DateLike;
    targetCompletionDate: DateLike;
    revisedCompletionDate: DateLike;
    onRecord?: (input: ProgressEntryInput) => unknown;
    onUpdate?: (id: string, input: ProgressEntryInput) => unknown;
    onDelete?: (id: string) => unknown;
    readOnly?: boolean;
}) => {
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [formError, setFormError] = useState<string | null>(null);
    const [recording, setRecording] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [rowDraft, setRowDraft] = useState<Draft>(emptyDraft);
    const [rowError, setRowError] = useState<string | null>(null);
    const [busyRowId, setBusyRowId] = useState<string | null>(null);

    // Newest first in the table, oldest first on the chart. The sort is
    // stable, so same-day rows keep the order they were filed in.
    const rows = useMemo(
        () => [...entries].sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime()),
        [entries],
    );
    const curveProject = useMemo<SCurveProject>(
        () => ({
            id: "project",
            projectCode: "",
            title: "this project",
            cityMunicipality: null,
            dateStarted: toDateOrNull(dateStarted),
            targetCompletionDate: toDateOrNull(targetCompletionDate),
            revisedCompletionDate: toDateOrNull(revisedCompletionDate),
            slippageAssessments: [...rows].reverse().map((e) => ({
                id: e.id,
                date: toDate(e.date),
                target: e.target,
                revisedTarget: e.revisedTarget,
                actual: e.actual,
                revision: e.revision,
            })),
        }),
        [rows, dateStarted, targetCompletionDate, revisedCompletionDate],
    );

    // Live reading of what Record would file, with the stage's prescribed action.
    const previewTarget = parsePercent(draft.target);
    const previewActual = parsePercent(draft.actual);
    const preview =
        previewTarget !== null && previewActual !== null ? computeSlippage(previewTarget, previewActual) : null;
    const previewStage = preview !== null ? getSlippageStageConfig(preview) : null;

    const handleRecord = async () => {
        const input = readDraft(draft);
        if (typeof input === "string") {
            setFormError(input);
            return;
        }
        setFormError(null);
        setRecording(true);
        try {
            await onRecord?.(input);
            // The date stays, so a run of back-dated entries is quick to file.
            setDraft((d) => ({ ...emptyDraft(), date: d.date }));
        } catch (e) {
            setFormError(errorMessage(e));
        } finally {
            setRecording(false);
        }
    };

    const startEdit = (entry: ProgressEntry) => {
        setEditingId(entry.id);
        setRowError(null);
        setRowDraft({
            date: toInputDate(entry.date),
            target: entry.target.toFixed(2),
            revised: entry.revisedTarget !== null ? entry.revisedTarget.toFixed(2) : "",
            actual: entry.actual.toFixed(2),
            remarks: entry.remarks ?? "",
        });
    };

    const saveEdit = async (id: string) => {
        const input = readDraft(rowDraft);
        if (typeof input === "string") {
            setRowError(input);
            return;
        }
        setRowError(null);
        setBusyRowId(id);
        try {
            await onUpdate?.(id, input);
            setEditingId(null);
        } catch (e) {
            setRowError(errorMessage(e));
        } finally {
            setBusyRowId(null);
        }
    };

    const remove = async (entry: ProgressEntry) => {
        if (!window.confirm(`Delete the progress entry recorded on ${fullDate.format(toDate(entry.date))}?`)) return;
        setRowError(null);
        setBusyRowId(entry.id);
        try {
            await onDelete?.(entry.id);
        } catch (e) {
            setRowError(errorMessage(e));
        } finally {
            setBusyRowId(null);
        }
    };

    const th = "px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-slate-600";

    return (
        <section className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-4">
                <TrendIcon />
                <h2 className="text-[17px] font-bold text-slate-800">Physical Progress &amp; Slippage Overview</h2>
            </div>

            <div className="mb-6">
                <StageLegendStrip />
            </div>

            <SCurveCard project={curveProject} />

            {/* ── History ── */}
            <div className="mt-6 mb-3">
                <span className="inline-block rounded-sm border border-slate-200 bg-slate-100 px-4 py-2 text-[14px] font-bold text-[#1e3a8a]">
                    Physical Progress &amp; Slippage History
                </span>
            </div>
            <div className="overflow-x-auto rounded-sm border border-slate-200">
                <table className="w-full min-w-[760px] text-sm">
                    <thead className="border-b border-slate-200">
                        <tr>
                            <th className={`${th} text-left`}>Date Recorded</th>
                            <th className={`${th} text-right`}>Planned %</th>
                            <th className={`${th} text-right`}>Revised Target %</th>
                            <th className={`${th} text-right`}>Actual %</th>
                            <th className={`${th} text-right`}>Slippage (%)</th>
                            <th className={`${th} text-left`}>Remarks / Scope Completed</th>
                            {!readOnly && <th className={`${th} text-right`}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={readOnly ? 6 : 7} className="px-4 py-8 text-center text-slate-400">
                                    No progress has been recorded yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((entry) => {
                                const isEditing = editingId === entry.id;
                                const busy = busyRowId === entry.id;
                                const slippage = computeSlippage(entry.target, entry.actual);
                                const cfg = getSlippageStageConfig(slippage);
                                if (isEditing) {
                                    return (
                                        <tr key={entry.id} className="bg-blue-50/40 align-top">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="date"
                                                    aria-label="Date recorded"
                                                    value={rowDraft.date}
                                                    onChange={(e) => setRowDraft((d) => ({ ...d, date: e.target.value }))}
                                                    className={cellInput}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <PercentInput label="Planned %" className={cellInput} value={rowDraft.target} onChange={(v) => setRowDraft((d) => ({ ...d, target: v }))} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <PercentInput label="Revised target %" className={cellInput} placeholder="—" value={rowDraft.revised} onChange={(v) => setRowDraft((d) => ({ ...d, revised: v }))} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <PercentInput label="Actual %" className={cellInput} value={rowDraft.actual} onChange={(v) => setRowDraft((d) => ({ ...d, actual: v }))} />
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-400">—</td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    aria-label="Remarks"
                                                    value={rowDraft.remarks}
                                                    onChange={(e) => setRowDraft((d) => ({ ...d, remarks: e.target.value }))}
                                                    className={cellInput}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => void saveEdit(entry.id)}
                                                        disabled={busy}
                                                        aria-label="Save changes"
                                                        className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setRowError(null);
                                                        }}
                                                        disabled={busy}
                                                        aria-label="Cancel editing"
                                                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                                return (
                                    <tr key={entry.id} className="hover:bg-slate-50/60">
                                        <td className="px-4 py-4 whitespace-nowrap text-slate-700">{fullDate.format(toDate(entry.date))}</td>
                                        <td className="px-4 py-4 text-right tabular-nums text-slate-700">{entry.target.toFixed(2)}%</td>
                                        <td className={`px-4 py-4 text-right tabular-nums ${entry.revisedTarget !== null ? "text-blue-600" : "text-slate-400"}`}>
                                            {entry.revisedTarget !== null ? `${entry.revisedTarget.toFixed(2)}%` : "—"}
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold tabular-nums text-[#1e3a8a]">{entry.actual.toFixed(2)}%</td>
                                        <td className="px-4 py-4 text-right">
                                            <span
                                                title={cfg.label}
                                                className={`inline-block rounded-sm border px-2 py-0.5 text-[13px] font-bold tabular-nums ${cfg.tile} ${cfg.text}`}
                                            >
                                                {formatSlippage(slippage)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-700">{entry.remarks?.trim() ? entry.remarks : <span className="text-slate-400">—</span>}</td>
                                        {!readOnly && (
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(entry)}
                                                        disabled={editingId !== null || busy}
                                                        aria-label="Edit progress entry"
                                                        className="text-[#1e3a8a] hover:text-blue-700 disabled:opacity-40"
                                                    >
                                                        <Pencil className="h-4.5 w-4.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => void remove(entry)}
                                                        disabled={editingId !== null || busy}
                                                        aria-label="Delete progress entry"
                                                        className="text-red-600 hover:text-red-700 disabled:opacity-40"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {rowError && <p className="mt-2 text-xs text-red-500">{rowError}</p>}

            {/* ── Record form ── */}
            {!readOnly && (
                <div className="mt-6 rounded-sm border border-slate-200 p-4 sm:p-6">
                    <h3 className="mb-4 text-[16px] font-bold text-slate-800">Record Progress &amp; Slippage</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
                        <div>
                            <label className={fieldLabel} htmlFor="progress-date">Date Recorded</label>
                            <input
                                id="progress-date"
                                type="date"
                                value={draft.date}
                                onChange={(e) => {
                                    setDraft((d) => ({ ...d, date: e.target.value }));
                                    setFormError(null);
                                }}
                                className={`${filledInput} bg-white shadow-sm`}
                            />
                        </div>
                        <div>
                            <span className={fieldLabel}>Target %</span>
                            <PercentInput
                                label="Target %"
                                value={draft.target}
                                invalid={draft.target.trim() !== "" && previewTarget === null}
                                onChange={(v) => {
                                    setDraft((d) => ({ ...d, target: v }));
                                    setFormError(null);
                                }}
                            />
                        </div>
                        <div>
                            <span className={fieldLabel}>Revised Target %</span>
                            <PercentInput
                                label="Revised target %"
                                placeholder="Optional"
                                value={draft.revised}
                                invalid={draft.revised.trim() !== "" && parsePercent(draft.revised) === null}
                                onChange={(v) => {
                                    setDraft((d) => ({ ...d, revised: v }));
                                    setFormError(null);
                                }}
                            />
                        </div>
                        <div>
                            <span className={fieldLabel}>Actual %</span>
                            <PercentInput
                                label="Actual %"
                                value={draft.actual}
                                invalid={draft.actual.trim() !== "" && previewActual === null}
                                onChange={(v) => {
                                    setDraft((d) => ({ ...d, actual: v }));
                                    setFormError(null);
                                }}
                            />
                        </div>
                        <div>
                            <label className={fieldLabel} htmlFor="progress-remarks">Remarks / Milestone</label>
                            <input
                                id="progress-remarks"
                                type="text"
                                value={draft.remarks}
                                onChange={(e) => setDraft((d) => ({ ...d, remarks: e.target.value }))}
                                placeholder="Enter remarks..."
                                className={filledInput}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => void handleRecord()}
                            disabled={recording}
                            className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#0b1f6b] px-6 text-[15px] font-bold text-white shadow-md transition hover:bg-[#1e3a8a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CircleCheck className="h-5 w-5" />
                            {recording ? "Recording..." : "Record"}
                        </button>
                    </div>
                    {formError ? (
                        <p className="mt-3 text-xs text-red-500">{formError}</p>
                    ) : previewStage && preview !== null ? (
                        <p className="mt-3 text-xs text-slate-500">
                            Slippage <span className={`font-bold ${previewStage.text}`}>{formatSlippage(preview)}%</span>
                            {" · "}
                            <span className="font-semibold text-slate-700">{previewStage.label}:</span> {previewStage.action}
                        </p>
                    ) : null}
                </div>
            )}
        </section>
    );
};
