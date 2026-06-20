
export type Segment = {
    value: number;
    color: string;
}

export type DonutChartProps = {
    segments: Segment[];
    size?: number;
    thickness?: number;
    centerLabel?: string;
}

export type StatCard = {
    label: string;
    value: string | number;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    icon: string;
}

export type UserCard = {
    label: string;
    value: string | number;
    border: string;
    iconBg: string;
    iconColor: string;
    type: "group" | "single" | "slash" | "plus";
}

export type DistrictEntry = {
    label: string;
    value: number;
    color: string;
}

export type AllocationEntry = {
    label: string;
    pct: string;
    amount: string | number;
    color: string;
}

export type LegendEntry = {
    label: string;
    amount: string;
    color: string;
}

export type UserIconProps = {
    type: "group" | "single" | "slash" | "plus";
    color: string;
}

export type DistrictCardProps = {
    title: string;
    data: DistrictEntry[];
}

export type MiniLegendProps = {
    data: LegendEntry[];
    negative?: boolean;
}

export type DistrictCardItem = {
    label: string;
    value: number;
    color: string;
}

