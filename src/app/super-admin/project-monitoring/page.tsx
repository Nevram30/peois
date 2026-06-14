"use client";

import React from 'react';
import { useState } from "react";
import { api } from "~/trpc/react";

const ProjectMonitoring: React.FC = () => {
    const { data: budgetYears } = api.project.getBudgetYears.useQuery();
    const [budgetYear, setBudgetYear] = useState<string>("");
    const { data: overview } = api.project.getOverviewStats.useQuery({
        budgetYear: budgetYear || undefined,
    });

    const yearOptions = budgetYears && budgetYears.length > 0
        ? budgetYears
        : [new Date().getFullYear().toString()];
    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Project Monitoring</h1>
                <p className="text-gray-600">This is the Project Monitoring page. Here you can monitor project activities and progress.</p>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fiscal Year Period</span>
                <div className="relative">
                    <select
                        value={budgetYear}
                        onChange={(e) => setBudgetYear(e.target.value)}
                        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">All Years</option>
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
            {/* Project Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 border-l-4 border-l-green-500 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed Projects</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{overview?.completed ?? 0}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 border-l-4 border-l-indigo-700 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                        <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-1.813a.75.75 0 0 1 0 1.302l-6.364 3.682a.75.75 0 0 1-1.125-.651V8.48a.75.75 0 0 1 1.125-.651l6.364 3.682Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">On-going Projects</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{overview?.ongoing ?? 0}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 border-l-4 border-l-orange-400 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">For Implemention</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{overview?.forImplementation ?? 0}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 border-l-4 border-l-red-600 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-3a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5A.75.75 0 0 0 8.25 9Zm7.5 0a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5A.75.75 0 0 0 15.75 9Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Suspended Projects</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{overview?.suspended ?? 0}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 border-l-4 border-l-slate-300 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Re-aligned Projects</p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{overview?.realigned ?? 0}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectMonitoring;
