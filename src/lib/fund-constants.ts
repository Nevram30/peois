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
] as const;

export type ProjectSubTypeValue = (typeof PROJECT_SUB_TYPE_VALUES)[number];

export const SOURCE_OF_FUND_LABEL: Record<SourceOfFundValue, string> = {
  TWENTY_PERCENT_DEV_FUND: "20% Development Fund",
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
    "Infrastructure Development Program Various Government Buildings and Facilities",
  LOCAL_ROADS_DRAINAGE: "Various Local Roads and Drainage Development Project",
  PROVINCIAL_ROADS_BRIDGES: "Improvement of Provincial Roads and Bridges",
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
  "FIVE_PERCENT_CONFIDENTIAL_FUND",
  "CONFIDENTIAL",
  "SEF",
  "PPOC",
  "LDRRM",
  "MOOE",
  "TRUST_FUND",
  "GENERAL_FUND",
  "NCDC",
  "PRDP",
  "MIADP",
  "AID",
  "LOAN",
  "OTHERS",
];
