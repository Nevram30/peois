export const SOURCE_OF_FUND_VALUES = [
  "GENERAL_FUND",
  "SEF",
  "TRUST_FUND",
  "TWENTY_PERCENT_DEV_FUND",
  "AID",
  "LOAN",
  "OTHERS",
  "FIVE_PERCENT_CONFIDENTIAL_FUND",
  "PPOC",
  "LDRRM",
  "MOOE",
  "NCDC",
  "PRDP",
  "MIADP",
  "CONFIDENTIAL",
  "FIVE_PERCENT_CALAMITY_FUND",
] as const;

export type SourceOfFundValue = (typeof SOURCE_OF_FUND_VALUES)[number];

export const PROJECT_SUB_TYPE_VALUES = [
  "WATER_SYSTEMS",
  "GOVERNMENT_BUILDINGS",
  "ELECTRIFICATION",
  "RESPONSE_CAMP_MGMT",
  "SUPPLEMENTAL_BUDGET_2",
  "PARK_AND_DEVELOPMENT",
  "DOH",
  "PROVINCIAL_GOVT_OFFICE",
  "VARIOUS_WATER_SYSTEM_DEV",
  "RURAL_ELECTRIFICATION",
  "SLOPE_PROTECTION_LAND_DEV",
  "INFRA_DEV_GOVT_BUILDINGS",
  "LOCAL_ROADS_DRAINAGE",
  "PROVINCIAL_ROADS_BRIDGES",
  "SUPPLEMENTAL_BUDGET_1",
  "SUPPLEMENTAL_BUDGET_3",
  "SUPPLEMENTAL_BUDGET_4",
  "SUPPLEMENTAL_BUDGET_5",
  "PDRRMO_RESPONSE_CAMP_MGMT",
  "PDRRMO_REHAB_RECOVERY",
  "PDRRMO_PREVENTION_MITIGATION",
  "PDRRMO_DISASTER_PREPAREDNESS",
  "PAMANA",
  "NCDC",
  "REPAIR_PROV_ROADS_DISTRICT_I",
  "REPAIR_PROV_ROADS_DISTRICT_II",
  "ROAD_OPENING",
  "PRDP_PROVINCIAL_COUNTERPART",
  "BARANGAY_PROJECTS_DISTRICT_I",
  "BARANGAY_PROJECTS_DISTRICT_II",
  "STIMULUS_BARANGAYS_DISTRICT_I",
  "STIMULUS_BARANGAYS_DISTRICT_II",
  "CONFLICT_INSURGENCY_ANTI_TERRORISM",
  "ANTI_CRIMINALITY_LAWLESSNESS",
  "FLOOD_CONTROL_SLOPE_PROTECTION_MOOE",
  "FLOOD_CONTROL_SLOPE_PROTECTION_PPE",
  "DRR_CCA_PROMOTION_AWARENESS_ADVOCACY",
  "BUILDING_BACK_BETTER",
  "QUICK_RESPONSE_FUND",
  "CONST_CHILD_DEV_CENTERS",
  "CONST_IMPVT_COMPL_SCHOOL_BLDGS",
  "CONSTRUCTION_SCHOOL_BUILDINGS",
  "CONSTRUCTION_SCHOOL_BUILDINGS_FACILITIES",
  "REPAIR_MAINT_BUILDINGS_STRUCTURES",
  "OTHER_MAINT_OPERATING_EXPENSES",
] as const;

export type ProjectSubTypeValue = (typeof PROJECT_SUB_TYPE_VALUES)[number];

export const SOURCE_OF_FUND_LABEL: Record<SourceOfFundValue, string> = {
  TWENTY_PERCENT_DEV_FUND: "20% Development Fund",
  FIVE_PERCENT_CALAMITY_FUND: "5% Calamity Fund",
  FIVE_PERCENT_CONFIDENTIAL_FUND: "5% Confidential Fund",
  SEF: "SEF (Special Education Fund)",
  PPOC: "PPOC (Provincial Peace and Order Council)",
  LDRRM: "LDRRM (Local Disaster Risk Reduction Management Fund)",
  MOOE: "Maintenance and Other Operating Expenses (MOOE)",
  TRUST_FUND: "Trust Fund",
  GENERAL_FUND: "General Fund",
  NCDC: "NCDC (National Child Development Center)",
  PRDP: "PRDP (Philippine Rural Development Project)",
  MIADP: "MIADP (Mindanao Inclusive Agriculture Development Project)",
  AID: "Aid",
  LOAN: "Loan",
  OTHERS: "Others",
  CONFIDENTIAL: "5% Confidential Fund",
};

export const PROJECT_SUB_TYPE_LABEL: Record<ProjectSubTypeValue, string> = {
  VARIOUS_WATER_SYSTEM_DEV: "Various Water System Development Project",
  RURAL_ELECTRIFICATION: "Rural Electrification Project",
  PARK_AND_DEVELOPMENT: "Park and Development",
  SLOPE_PROTECTION_LAND_DEV: "Slope Protection and Land Development Project",
  INFRA_DEV_GOVT_BUILDINGS:
    "Various Government Buildings and Facilities Development Project",
  LOCAL_ROADS_DRAINAGE: "Various Local Roads and Drainage Development Project",
  PROVINCIAL_ROADS_BRIDGES: "Improvement of Provincial Roads and Bridges",
  REPAIR_PROV_ROADS_DISTRICT_I: "Repair/Maintenance of Provincial Roads - District I",
  REPAIR_PROV_ROADS_DISTRICT_II: "Repair/Maintenance of Provincial Roads - District II",
  ROAD_OPENING: "Road Opening Project",
  PRDP_PROVINCIAL_COUNTERPART: "(PRDP) Provincial Counterpart",
  BARANGAY_PROJECTS_DISTRICT_I: "Projects for Various Barangays - District I",
  BARANGAY_PROJECTS_DISTRICT_II: "Projects for Various Barangays - District II",
  STIMULUS_BARANGAYS_DISTRICT_I: "Stimulus Projects for Barangays - District I",
  STIMULUS_BARANGAYS_DISTRICT_II: "Stimulus Projects for Barangays - District II",
  CONFLICT_INSURGENCY_ANTI_TERRORISM: "Conflict, Insurgency, and Anti-Terrorism Project",
  ANTI_CRIMINALITY_LAWLESSNESS: "Anti-Criminality and Lawlessness Project",
  FLOOD_CONTROL_SLOPE_PROTECTION_MOOE: "Flood Control and Slope Protection Project (MOOE)",
  FLOOD_CONTROL_SLOPE_PROTECTION_PPE:
    "Flood Control and Slope Protection Project (Property, Plant, and Equipment)",
  DRR_CCA_PROMOTION_AWARENESS_ADVOCACY: "DRR/CCA Promotion, Awareness and Advocacy Project",
  BUILDING_BACK_BETTER: "Building Back Better Project",
  QUICK_RESPONSE_FUND: "Quick Response Fund",
  CONST_CHILD_DEV_CENTERS: "Const. of Various Child Development Centers",
  CONST_IMPVT_COMPL_SCHOOL_BLDGS:
    "Const./Impvt./Compl. of School Bldgs., Structures & Facilities",
  CONSTRUCTION_SCHOOL_BUILDINGS: "Construction of School Buildings",
  CONSTRUCTION_SCHOOL_BUILDINGS_FACILITIES: "Construction of School Buildings & Facilities",
  REPAIR_MAINT_BUILDINGS_STRUCTURES: "Repair and Maintenance - Buildings and Other Structures",
  OTHER_MAINT_OPERATING_EXPENSES: "Other Maintenance and Operating Expenses",
  SUPPLEMENTAL_BUDGET_1: "Supplemental Budget #1",
  SUPPLEMENTAL_BUDGET_2: "Supplemental Budget #2",
  SUPPLEMENTAL_BUDGET_3: "Supplemental Budget #3",
  SUPPLEMENTAL_BUDGET_4: "Supplemental Budget #4",
  SUPPLEMENTAL_BUDGET_5: "Supplemental Budget #5",
  PROVINCIAL_GOVT_OFFICE: "Provincial Government Office",
  PDRRMO_RESPONSE_CAMP_MGMT: "PDRRMO - Response Camp Management",
  PDRRMO_REHAB_RECOVERY: "PDRRMO - Rehabilitation and Recovery",
  PDRRMO_PREVENTION_MITIGATION: "PDRRMO - Prevention and Mitigation",
  PDRRMO_DISASTER_PREPAREDNESS: "PDRRMO - Disaster Preparedness",
  PAMANA: "PAMANA",
  DOH: "DOH (Department of Health)",
  NCDC: "NCDC (National Child Development Center)",
  WATER_SYSTEMS: "Water Systems",
  GOVERNMENT_BUILDINGS: "Government Buildings",
  ELECTRIFICATION: "Electrification",
  RESPONSE_CAMP_MGMT: "Response Camp Management",
};

export const SOURCE_TO_SUB_TYPES: Record<SourceOfFundValue, ProjectSubTypeValue[]> = {
  TWENTY_PERCENT_DEV_FUND: [
    "VARIOUS_WATER_SYSTEM_DEV",
    "RURAL_ELECTRIFICATION",
    "PARK_AND_DEVELOPMENT",
    "SLOPE_PROTECTION_LAND_DEV",
    "INFRA_DEV_GOVT_BUILDINGS",
    "LOCAL_ROADS_DRAINAGE",
    "PROVINCIAL_ROADS_BRIDGES",
  ],
  SEF: [
    "SUPPLEMENTAL_BUDGET_1",
    "SUPPLEMENTAL_BUDGET_2",
    "SUPPLEMENTAL_BUDGET_3",
    "SUPPLEMENTAL_BUDGET_4",
    "SUPPLEMENTAL_BUDGET_5",
  ],
  PPOC: ["PROVINCIAL_GOVT_OFFICE"],
  LDRRM: [
    "PDRRMO_RESPONSE_CAMP_MGMT",
    "PDRRMO_REHAB_RECOVERY",
    "PDRRMO_PREVENTION_MITIGATION",
    "PDRRMO_DISASTER_PREPAREDNESS",
  ],
  TRUST_FUND: ["PAMANA", "DOH", "NCDC"],
  FIVE_PERCENT_CALAMITY_FUND: [],
  FIVE_PERCENT_CONFIDENTIAL_FUND: [],
  MOOE: [],
  GENERAL_FUND: [],
  NCDC: [],
  PRDP: [],
  MIADP: [],
  AID: [],
  LOAN: [],
  OTHERS: [],
  CONFIDENTIAL: [],
};

export const DISBURSEMENT_TYPE_VALUES = [
  "BILL_OF_LADING",
  "CONTINGENCIES",
  "EQUIPMENT_MAINTENANCE",
  "EQUIPMENT_POL",
  "EQUIPMENT_RENTAL",
  "FERRY_LADING",
  "LABOR",
  "MATERIALS",
  "MOBILIZATION_DEMOBILIZATION",
  "BILLING_ACCOMPLISHMENT",
  "MOBILIZATION_15_PERCENT",
  // Legacy value kept for existing records; not selectable in the UI.
  "FUEL",
] as const;

export type DisbursementTypeValue = (typeof DISBURSEMENT_TYPE_VALUES)[number];

export const DISBURSEMENT_TYPE_LABEL: Record<DisbursementTypeValue, string> = {
  BILL_OF_LADING: "Bill of Lading",
  CONTINGENCIES: "Contingencies",
  EQUIPMENT_MAINTENANCE: "Equipment Maintenance",
  EQUIPMENT_POL: "Equipment POL",
  EQUIPMENT_RENTAL: "Equipment Rental",
  FERRY_LADING: "Ferry Lading",
  LABOR: "Labor",
  MATERIALS: "Materials",
  MOBILIZATION_DEMOBILIZATION: "Mobilization / Demobilization",
  BILLING_ACCOMPLISHMENT: "Billing (Accomplishment)",
  MOBILIZATION_15_PERCENT: "15% Mobilization",
  FUEL: "Fuel",
};

export const MODE_TO_DISBURSEMENT_TYPES: Record<
  "BY_ADMINISTRATION" | "BY_CONTRACT" | "UNASSIGNED_FOR_DETERMINATION",
  DisbursementTypeValue[]
> = {
  // No disbursement types apply until the implementation mode is determined.
  UNASSIGNED_FOR_DETERMINATION: [],
  BY_ADMINISTRATION: [
    "BILL_OF_LADING",
    "CONTINGENCIES",
    "EQUIPMENT_MAINTENANCE",
    "EQUIPMENT_POL",
    "EQUIPMENT_RENTAL",
    "FERRY_LADING",
    "LABOR",
    "MATERIALS",
    "MOBILIZATION_DEMOBILIZATION",
  ],
  BY_CONTRACT: ["BILLING_ACCOMPLISHMENT", "MOBILIZATION_15_PERCENT"],
};

export const PROJECT_STATUS_VALUES = [
  "NOT_YET_STARTED",
  "ON_GOING",
  "COMPLETED",
  "SUSPENDED",
  "FOR_IMPLEMENTATION",
  "RE_ALIGNMENT",
  "OTHERS",
] as const;

export type ProjectStatusValue = (typeof PROJECT_STATUS_VALUES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatusValue, string> = {
  COMPLETED: "Completed",
  SUSPENDED: "Suspended",
  FOR_IMPLEMENTATION: "For Implementation",
  ON_GOING: "On-going",
  RE_ALIGNMENT: "Re-alignment",
  OTHERS: "Others",
  NOT_YET_STARTED: "Not Yet Started",
};

export const PROJECT_STATUS_ORDER: ProjectStatusValue[] = [
  "COMPLETED",
  "SUSPENDED",
  "FOR_IMPLEMENTATION",
  "ON_GOING",
  "RE_ALIGNMENT",
  "OTHERS",
  "NOT_YET_STARTED",
];

export const SOURCE_OF_FUND_ORDER: SourceOfFundValue[] = [
  "TWENTY_PERCENT_DEV_FUND",
  "GENERAL_FUND",
  "FIVE_PERCENT_CALAMITY_FUND",
  "FIVE_PERCENT_CONFIDENTIAL_FUND",
  "SEF",
  "PPOC",
  "LDRRM",
  "MOOE",
  "TRUST_FUND",
  "NCDC",
  "PRDP",
  "MIADP",
];

// Sources selectable when creating a new project (Funding Information).
export const SOURCE_OF_FUND_SELECTABLE: SourceOfFundValue[] = [
  "TWENTY_PERCENT_DEV_FUND",
  "GENERAL_FUND",
  "FIVE_PERCENT_CALAMITY_FUND",
  "SEF",
  "MOOE",
  "TRUST_FUND",
  "NCDC",
  "PRDP",
  "MIADP",
];

// ─── Funding Information cascade (Source of Fund → Program → Project) ────
// Selecting a Source of Fund filters its Programs; selecting a Program then
// filters its related Projects. Programs are uniquely tied to a Source of
// Fund, but Projects can overlap between the 20% Development Fund and the
// General Fund depending on the Program selected.

export const FUNDING_PROGRAM_VALUES = [
  // 20% Development Fund
  "INFRA_DEV_PROGRAM_3918",
  "PEACE_ORDER_PROGRAM_3918",
  "INFRA_DEV_PROGRAM_8918",
  "PEACE_ORDER_PROGRAM_8918",
  "HEALTH_DEV_PROGRAM_4918",
  // General Fund
  "INFRA_DEV_PROGRAM_1999",
  "PEACE_ORDER_PROGRAM_1999",
  "INFRA_DEV_PROGRAM_4918",
  // 5% Calamity Fund
  "DISASTER_PREVENTION_MITIGATION_9943",
  "DISASTER_PREVENTION_MITIGATION_9942",
  "DISASTER_PREPAREDNESS_9942",
  "DISASTER_REHAB_RECOVERY_9941",
  // SEF (Special Education Fund)
  "ELEM_SECONDARY_EDUCATION_3311",
  // MOOE
  "ALL_OFFICES",
  // Trust Fund
  "PAMANA",
  "DOH",
  "NCDC",
  "LGSF",
  "PRDP",
  "MIADP",
  "LDRRM",
] as const;

export type FundingProgramValue = (typeof FUNDING_PROGRAM_VALUES)[number];

export const FUNDING_PROGRAM_LABEL: Record<FundingProgramValue, string> = {
  INFRA_DEV_PROGRAM_3918: "(3918) Infrastructure Development Program",
  PEACE_ORDER_PROGRAM_3918: "(3918) Peace and Order Program",
  INFRA_DEV_PROGRAM_8918: "(8918) Infrastructure Development Program",
  PEACE_ORDER_PROGRAM_8918: "(8918) Peace and Order Program",
  HEALTH_DEV_PROGRAM_4918: "(4918) Health Development Program",
  INFRA_DEV_PROGRAM_1999: "(1999) Infrastructure Development Program",
  PEACE_ORDER_PROGRAM_1999: "(1999) Peace and Order Program",
  INFRA_DEV_PROGRAM_4918: "(4918) Infrastructure Development Program",
  DISASTER_PREVENTION_MITIGATION_9943: "(9943) Disaster Prevention and Mitigation Program",
  DISASTER_PREVENTION_MITIGATION_9942: "(9942) Disaster Prevention and Mitigation Program",
  DISASTER_PREPAREDNESS_9942: "(9942) Disaster Preparedness Program",
  DISASTER_REHAB_RECOVERY_9941: "(9941) Disaster Rehabilitation and Recovery Program",
  ELEM_SECONDARY_EDUCATION_3311: "(3311) Elementary/Secondary Education",
  ALL_OFFICES: "All Offices",
  PAMANA: "(PAMANA) PAyapa at MAsaganang PamayaNAn",
  DOH: "DOH (Department of Health)",
  NCDC: "NCDC (National Child Development Center)",
  LGSF: "(LGSF) Local Government Support Fund",
  PRDP: "(PRDP) Philippine Rural Development Project",
  MIADP: "(MIADP) Mindanao Inclusive Agriculture Development Project",
  LDRRM: "(LDRRM) Local Disaster Risk Reduction and Management",
};

export const SOURCE_TO_PROGRAMS: Record<SourceOfFundValue, FundingProgramValue[]> = {
  TWENTY_PERCENT_DEV_FUND: [
    "INFRA_DEV_PROGRAM_3918",
    "PEACE_ORDER_PROGRAM_3918",
    "INFRA_DEV_PROGRAM_8918",
    "PEACE_ORDER_PROGRAM_8918",
    "HEALTH_DEV_PROGRAM_4918",
  ],
  GENERAL_FUND: [
    "INFRA_DEV_PROGRAM_1999",
    "PEACE_ORDER_PROGRAM_1999",
    "INFRA_DEV_PROGRAM_4918",
  ],
  FIVE_PERCENT_CALAMITY_FUND: [
    "DISASTER_PREVENTION_MITIGATION_9943",
    "DISASTER_PREVENTION_MITIGATION_9942",
    "DISASTER_PREPAREDNESS_9942",
    "DISASTER_REHAB_RECOVERY_9941",
  ],
  SEF: ["ELEM_SECONDARY_EDUCATION_3311"],
  MOOE: ["ALL_OFFICES"],
  TRUST_FUND: ["PAMANA", "DOH", "NCDC", "LGSF", "PRDP", "MIADP", "LDRRM"],
  NCDC: [],
  PRDP: [],
  MIADP: [],
  FIVE_PERCENT_CONFIDENTIAL_FUND: [],
  PPOC: [],
  LDRRM: [],
  AID: [],
  LOAN: [],
  OTHERS: [],
  CONFIDENTIAL: [],
};

// Shared between the 20% Development Fund and General Fund programs —
// identical Projects can be funded by either source depending on the
// specific Program selected.
const DEV_AND_GENERAL_FUND_PROJECTS: ProjectSubTypeValue[] = [
  "INFRA_DEV_GOVT_BUILDINGS",
  "REPAIR_PROV_ROADS_DISTRICT_I",
  "REPAIR_PROV_ROADS_DISTRICT_II",
  "LOCAL_ROADS_DRAINAGE",
  "VARIOUS_WATER_SYSTEM_DEV",
  "ROAD_OPENING",
  "RURAL_ELECTRIFICATION",
  "SLOPE_PROTECTION_LAND_DEV",
  "PROVINCIAL_ROADS_BRIDGES",
  "PARK_AND_DEVELOPMENT",
  "PRDP_PROVINCIAL_COUNTERPART",
  "BARANGAY_PROJECTS_DISTRICT_I",
  "BARANGAY_PROJECTS_DISTRICT_II",
  "STIMULUS_BARANGAYS_DISTRICT_I",
  "STIMULUS_BARANGAYS_DISTRICT_II",
  "CONFLICT_INSURGENCY_ANTI_TERRORISM",
  "ANTI_CRIMINALITY_LAWLESSNESS",
];

const CALAMITY_FUND_PROJECTS: ProjectSubTypeValue[] = [
  "FLOOD_CONTROL_SLOPE_PROTECTION_MOOE",
  "FLOOD_CONTROL_SLOPE_PROTECTION_PPE",
  "DRR_CCA_PROMOTION_AWARENESS_ADVOCACY",
  "BUILDING_BACK_BETTER",
  "QUICK_RESPONSE_FUND",
];

const SEF_PROJECTS: ProjectSubTypeValue[] = [
  "CONST_CHILD_DEV_CENTERS",
  "CONST_IMPVT_COMPL_SCHOOL_BLDGS",
  "CONSTRUCTION_SCHOOL_BUILDINGS",
  "CONSTRUCTION_SCHOOL_BUILDINGS_FACILITIES",
];

const MOOE_PROJECTS: ProjectSubTypeValue[] = [
  "REPAIR_MAINT_BUILDINGS_STRUCTURES",
  "OTHER_MAINT_OPERATING_EXPENSES",
];

export const PROGRAM_TO_PROJECTS: Record<FundingProgramValue, ProjectSubTypeValue[]> = {
  INFRA_DEV_PROGRAM_3918: DEV_AND_GENERAL_FUND_PROJECTS,
  PEACE_ORDER_PROGRAM_3918: DEV_AND_GENERAL_FUND_PROJECTS,
  INFRA_DEV_PROGRAM_8918: DEV_AND_GENERAL_FUND_PROJECTS,
  PEACE_ORDER_PROGRAM_8918: DEV_AND_GENERAL_FUND_PROJECTS,
  HEALTH_DEV_PROGRAM_4918: DEV_AND_GENERAL_FUND_PROJECTS,
  INFRA_DEV_PROGRAM_1999: DEV_AND_GENERAL_FUND_PROJECTS,
  PEACE_ORDER_PROGRAM_1999: DEV_AND_GENERAL_FUND_PROJECTS,
  INFRA_DEV_PROGRAM_4918: DEV_AND_GENERAL_FUND_PROJECTS,
  DISASTER_PREVENTION_MITIGATION_9943: CALAMITY_FUND_PROJECTS,
  DISASTER_PREVENTION_MITIGATION_9942: CALAMITY_FUND_PROJECTS,
  DISASTER_PREPAREDNESS_9942: CALAMITY_FUND_PROJECTS,
  DISASTER_REHAB_RECOVERY_9941: CALAMITY_FUND_PROJECTS,
  ELEM_SECONDARY_EDUCATION_3311: SEF_PROJECTS,
  ALL_OFFICES: MOOE_PROJECTS,
  PAMANA: [],
  DOH: [],
  NCDC: [],
  LGSF: [],
  PRDP: [],
  MIADP: [],
  LDRRM: [],
};

// ─── Project Account ──────────────────────────────────────────────────────
export const PROJECT_ACCOUNT_VALUES = ["MOOE", "PPE"] as const;

export type ProjectAccountValue = (typeof PROJECT_ACCOUNT_VALUES)[number];

export const PROJECT_ACCOUNT_LABEL: Record<ProjectAccountValue, string> = {
  MOOE: "(MOOE) Maintenance and Other Operating Expenses",
  PPE: "(PPE) Property, Plant, and Equipment",
};

// ─── Supplemental Budget (optional) ───────────────────────────────────────
export const SUPPLEMENTAL_BUDGET_YEARS = [
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
] as const;

export const SUPPLEMENTAL_BUDGET_NUMBERS = ["1", "2", "3", "4", "5", "6"] as const;
