import React, { useMemo } from 'react';

// 1. Your projectdata type definition
export type projectdata = {
    id: string;
    projectCode: string;
    title: string;
    subType: string | null; // <--- Allow null here
    program: string;
    projectAccount: string;
    modeOfImplementation: string;
    locationImplementation: string;
    sourceOfFund: string;
    projectCost: number;
    contractCost: number;
    contractorName: string;
    projectEngineer: string;
    budgetYear: string;
    landbankNumber: number | string;
    supplementalBudgetYear: number | string | null; // <--- Also good to loosen if DB allows null
    supplementalBudgetNumber: number | string | null;
    dateStarted: Date;
    targetCompletionDate: Date;
    duration: number;
    revisedCompletionDate: Date;
    dateCompleted: Date;
    daysSuspended: number;
    daysExtended: number;
    numFemale: number;
    numMale: number;
    numPersons: number;
    numManDays: number;
    district: string;
    cityMunicipality: string;
    barangay: string;
    purok: string;
    sitio: string;
    latitude: number;
    longitude: number;
    locationType: string;
    endLatitude: string;
    endLongitude: string;
    description: string;
    status: string;
    preparationStage: string;
    completionPercentage: number;
    slippageTarget: string;
    slippageActual: string;
    slippageRevision: string;
    imageUrl: string;
    imageUrls: string[];
    documentUrl: string;
    documentName: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        id: string;
        name: string | null; // <--- Often null in DB
        email: string;
        image: string | null; // <--- Often null in DB
    };
    activities: {
        id: string;
        projectId: string;
        description: string;
        createdById: string;
        createdAt: Date;
        createdBy: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
    }[];
    disbursements: [];
    slippageAssessments: {
        actual: number;
        date: Date;
    }[];
};

interface SupplementalSlippageChartProps {
    projects: projectdata[];
}

export const SupplementalSlippageChart: React.FC<SupplementalSlippageChartProps> = ({ projects }) => {

    // 2. Filter, Group, and Calculate metrics using useMemo
    const chartData = useMemo(() => {
        // Filter projects that have supplemental budget numbers and years assigned
        const filteredProjects = projects.filter(
            (p) =>
                p.supplementalBudgetYear !== undefined &&
                p.supplementalBudgetYear !== '' &&
                p.supplementalBudgetNumber !== undefined &&
                p.supplementalBudgetNumber !== ''
        );

        // Group by Supplemental Budget (combining Year and Number)
        const groups: Record<string, { totalSlippage: number; assessmentCount: number; projectCount: number }> = {};

        filteredProjects.forEach((project) => {
            const groupKey = `SB #${project.supplementalBudgetNumber} (${project.supplementalBudgetYear})`;

            groups[groupKey] ??= { totalSlippage: 0, assessmentCount: 0, projectCount: 0 };

            // Count the number of projects in this supplemental budget bucket
            groups[groupKey].projectCount += 1;

            // Aggregate actual slippage assessment percentages
            if (project.slippageAssessments && project.slippageAssessments.length > 0) {
                // Cache the reference for type safety inside the callback
                const currentGroup = groups[groupKey];

                project.slippageAssessments.forEach((assessment) => {
                    currentGroup.totalSlippage += assessment.actual;
                    currentGroup.assessmentCount += 1;
                });
            }
        });

        // Format into an array for rendering using Object.entries
        return Object.entries(groups).map(([key, group]) => {
            // Calculate overall average actual slippage percentage
            const avgActualSlippage = group.assessmentCount > 0
                ? group.totalSlippage / group.assessmentCount
                : 0;

            return {
                supplementalBudgetLabel: key,
                projectCount: group.projectCount,
                avgActualSlippage: parseFloat(avgActualSlippage.toFixed(2)),
            };
        });
    }, [projects]);

    // Determine max scale for Y-axis bar sizing
    const maxSlippageValue = useMemo(() => {
        const max = Math.max(...chartData.map((d) => d.avgActualSlippage), 100);
        return max > 0 ? max : 100;
    }, [chartData]);

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Supplemental Budget vs. Actual Slippage Assessment
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Y-Axis: Overall Average Actual Slippage (%) | X-Axis: Supplemental Budget Categories & Project Counts
            </p>

            {chartData.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No projects found matching supplemental budget filters.</p>
            ) : (
                <div className="relative h-72 flex items-end gap-6 border-b border-l border-gray-300 pb-2 pl-4 pt-6">
                    {/* Background Grid Guidelines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
                        <div className="border-b border-gray-500 w-full"></div>
                        <div className="border-b border-gray-500 w-full"></div>
                        <div className="border-b border-gray-500 w-full"></div>
                        <div className="border-b border-gray-500 w-full"></div>
                    </div>

                    {/* Dynamic Bars */}
                    {chartData.map((item, index) => {
                        // Calculate bar height percentage relative to max scale
                        const heightPercentage = Math.min(Math.max((item.avgActualSlippage / maxSlippageValue) * 100, 5), 100);

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                {/* Tooltip on Hover */}
                                <div className="absolute -top-14 bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                    <p className="font-bold">{item.supplementalBudgetLabel}</p>
                                    <p>Avg Slippage: {item.avgActualSlippage}%</p>
                                    <p>Projects: {item.projectCount}</p>
                                </div>

                                {/* Bar */}
                                <div
                                    style={{ height: `${heightPercentage}%` }}
                                    className="w-full max-w-[56px] bg-blue-600 rounded-t-md transition-all duration-300 group-hover:bg-blue-500 flex items-center justify-center shadow-sm"
                                >
                                    <span className="text-xs text-white font-bold">
                                        {item.avgActualSlippage}%
                                    </span>
                                </div>

                                {/* X-Axis Labels & Project Counts */}
                                <div className="mt-3 text-center w-full">
                                    <span className="block text-xs font-semibold text-gray-700 truncate">
                                        {item.supplementalBudgetLabel}
                                    </span>
                                    <span className="block text-[11px] text-blue-600 font-medium">
                                        {item.projectCount} project{item.projectCount > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

