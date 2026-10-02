// The 2nd Engineering District's original projects under the IP, plotted on
// that district's dashboard as their own progress curve. Most are identified
// by project ID; a few have no project ID and are matched by title
// (case-insensitive, anywhere in the title) instead, and one sub-type is
// included whole.
export const ORIGINAL_IP_PROJECT_CODES: readonly string[] = [
  "273-100-S-07-594",
  "266-100-S-11-1676",
  "266-100-C-01-1684",
  "264-100-S-08-1731",
  "264-100-S-08-1708",
  "264-100-S-09-1707",
  "264-100-S-11-1702",
  "264-100-S-10-1728",
  "264-100-S-08-1723",
  "264-100-S-09-1713",
  "269-100-S-10-966",
  "269-100-S-10-965",
  "269-100-S-09-968",
  "273-100-S-09-587",
  "273-100-S-09-592",
  "266-100-S-09-1674",
  "266-100-S-08-1679",
  "266-100-S-08-1675",
  "273-100-S-10-3469",
  "273-100-S-10-565",
  "273-100-S-11-3467",
  "266-100-S-08-1686",
  "273-100-S-11-3468",
  "273-100-S-08-564",
];

export const ORIGINAL_IP_PROJECT_TITLES: readonly string[] = [
  "Improvement of Drainage in-front of Dujali National Highschool",
  "Construction of Water System, Brgy Pangubatan, Kaputian District, IGACOS",
];

// Every project filed under these sub-types (Funding Information → Project)
// is included as well.
export const ORIGINAL_IP_PROJECT_SUB_TYPES: readonly string[] = [
  "REPAIR_PROV_ROADS_DISTRICT_II", // Repair/Maintenance of Provincial Roads - District II
];
