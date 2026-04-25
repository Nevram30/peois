// Static location data for Davao del Norte.
// Municipalities and barangays follow the Philippine Standard Geographic Code.
// Congressional districts: 1st — Asuncion, Kapalong, New Corella, San Isidro,
// Tagum City, Talaingod. 2nd — Braulio E. Dujali, Carmen, IGACOS (Samal),
// Panabo City, Santo Tomas.

export type DavaoDistrict = "DISTRICT_I" | "DISTRICT_II";

export type BarangayInfo = {
  name: string;
  puroks?: string[];
  sitios?: string[];
};

export type MunicipalityInfo = {
  name: string;
  district: DavaoDistrict;
  barangays: BarangayInfo[];
};

export const DEFAULT_PUROKS = [
  "Purok 1",
  "Purok 2",
  "Purok 3",
  "Purok 4",
  "Purok 5",
  "Purok 6",
  "Purok 7",
  "Purok 8",
  "Purok 9",
  "Purok 10",
];

export const DEFAULT_SITIOS = [
  "Sitio Proper",
  "Sitio Central",
  "Sitio Ilaya",
  "Sitio Ibaba",
  "Sitio Upper",
  "Sitio Lower",
  "Sitio Bukid",
  "Sitio Riverside",
];

const b = (name: string, puroks?: string[], sitios?: string[]): BarangayInfo => ({
  name,
  puroks,
  sitios,
});

export const DAVAO_DEL_NORTE_LOCATIONS: MunicipalityInfo[] = [
  {
    name: "Asuncion",
    district: "DISTRICT_I",
    barangays: [
      b("Binancian"),
      b("Buan"),
      b("Buclad"),
      b("Cabaywa"),
      b("Camansa"),
      b("Camoning"),
      b("Canatan"),
      b("Concepcion"),
      b("Doña Andrea"),
      b("Magatos"),
      b("Napungas"),
      b("New Bantayan"),
      b("New Bohol"),
      b("Pamacaun"),
      b("Poblacion"),
      b("Sagayen"),
      b("San Vicente"),
      b("Santa Filomena"),
      b("Sonlon"),
    ],
  },
  {
    name: "Kapalong",
    district: "DISTRICT_I",
    barangays: [
      b("Capungagan"),
      b("Florida"),
      b("Gabuyan"),
      b("Gupitan"),
      b("Katipunan"),
      b("Luna"),
      b("Mabantao"),
      b("Mamacao"),
      b("Maniki (Poblacion)"),
      b("Pag-asa"),
      b("Sampao"),
      b("Semong"),
      b("Sua-on"),
      b("Tiburcia"),
    ],
  },
  {
    name: "New Corella",
    district: "DISTRICT_I",
    barangays: [
      b("Cabidianan"),
      b("Carcor"),
      b("Del Monte"),
      b("Del Pilar"),
      b("El Salvador"),
      b("Limba-an"),
      b("Macgum"),
      b("Mambing"),
      b("Mesaoy"),
      b("New Bohol"),
      b("New Cortez"),
      b("New Sambog"),
      b("Patrocenio"),
      b("Poblacion"),
      b("San Jose"),
      b("San Roque"),
      b("Santa Cruz"),
      b("Santo Niño"),
      b("Santo Tomas"),
      b("Suawon"),
    ],
  },
  {
    name: "San Isidro",
    district: "DISTRICT_I",
    barangays: [
      b("Cabatan"),
      b("Dacudao"),
      b("Igangon"),
      b("Kipalili"),
      b("Libuton"),
      b("Linao"),
      b("Mamangan"),
      b("Mambing"),
      b("Monte Dujali"),
      b("Pinamuno"),
      b("Poblacion"),
      b("San Miguel"),
      b("Santo Niño"),
      b("Sawata"),
      b("Sibayan"),
    ],
  },
  {
    name: "Tagum City",
    district: "DISTRICT_I",
    barangays: [
      b("Apokon"),
      b("Bincungan"),
      b("Busaon"),
      b("Canocotan"),
      b("Cuambogan"),
      b("La Filipina"),
      b("Liboganon"),
      b("Madaum"),
      b("Magdum"),
      b("Magugpo East"),
      b("Magugpo North"),
      b("Magugpo Poblacion"),
      b("Magugpo South"),
      b("Magugpo West"),
      b("Mankilam"),
      b("New Balamban"),
      b("Nueva Fuerza"),
      b("Pagsabangan"),
      b("Pandapan"),
      b("San Agustin"),
      b("San Isidro"),
      b("San Miguel"),
      b("Visayan Village"),
    ],
  },
  {
    name: "Talaingod",
    district: "DISTRICT_I",
    barangays: [
      b("Dagohoy"),
      b("Palma Gil"),
      b("Santo Niño"),
    ],
  },
  {
    name: "Braulio E. Dujali",
    district: "DISTRICT_II",
    barangays: [
      b("Cabay-angan"),
      b("Dujali"),
      b("Magupising"),
      b("New Casay"),
      b("Tanglaw"),
    ],
  },
  {
    name: "Carmen",
    district: "DISTRICT_II",
    barangays: [
      b("Alejal"),
      b("Anibongan"),
      b("Asuncion"),
      b("Cebulano"),
      b("Guadalupe"),
      b("Ising (Poblacion)"),
      b("La Paz"),
      b("Mabaus"),
      b("Mabuhay"),
      b("Magsaysay"),
      b("Minda"),
      b("New Camiling"),
      b("New Visayas"),
      b("Salvacion"),
      b("San Isidro"),
      b("Santo Niño"),
      b("Taba"),
      b("Tibulao"),
      b("Tubod"),
      b("Tuganay"),
    ],
  },
  {
    name: "Island Garden City of Samal (IGACOS)",
    district: "DISTRICT_II",
    barangays: [
      b("Adecor"),
      b("Anonang"),
      b("Aumbay"),
      b("Aundanao"),
      b("Balet"),
      b("Bandera"),
      b("Caliclic"),
      b("Camudmud"),
      b("Catagman"),
      b("Cawag"),
      b("Cogon"),
      b("Cogon (Kaputian)"),
      b("Dadatan"),
      b("Del Monte"),
      b("Guilon"),
      b("Kanaan"),
      b("Kinawitnon"),
      b("Libertad"),
      b("Libuak"),
      b("Licup"),
      b("Limao"),
      b("Linosutan"),
      b("Mambago-A"),
      b("Mambago-B"),
      b("Miranda (Poblacion)"),
      b("Moncado (Poblacion)"),
      b("Pangubatan"),
      b("Peñaplata (Poblacion)"),
      b("Poblacion (Kaputian)"),
      b("San Agustin"),
      b("San Antonio"),
      b("San Isidro (Babak)"),
      b("San Isidro (Kaputian)"),
      b("San Jose (Babak)"),
      b("San Jose (Samal)"),
      b("San Miguel (Magamono)"),
      b("San Remigio"),
      b("Santa Cruz (Kaputian)"),
      b("Santo Niño (Babak)"),
      b("Sion (Zion)"),
      b("Tagbaobo"),
      b("Tagbay"),
      b("Tagbitan-ag"),
      b("Tagdaliao"),
      b("Tagpopongan"),
      b("Tambo"),
      b("Toril"),
    ],
  },
  {
    name: "Panabo City",
    district: "DISTRICT_II",
    barangays: [
      b("A. O. Floirendo"),
      b("Cacao"),
      b("Cagangohan"),
      b("Consolacion"),
      b("Dapco"),
      b("Datu Abdul Dadia"),
      b("Gredu (Poblacion)"),
      b("J.P. Laurel"),
      b("Kasilak"),
      b("Katipunan"),
      b("Katualan"),
      b("Kauswagan"),
      b("Kiotoy"),
      b("Little Panay"),
      b("Lower Panaga"),
      b("Mabunao"),
      b("Maduao"),
      b("Malativas"),
      b("Manay"),
      b("Nanyo"),
      b("New Malaga"),
      b("New Malitbog"),
      b("New Pandan (Poblacion)"),
      b("New Visayas"),
      b("Quezon"),
      b("Salvacion"),
      b("San Francisco (Poblacion)"),
      b("San Nicolas"),
      b("San Pedro"),
      b("San Roque"),
      b("San Vicente"),
      b("Santa Cruz"),
      b("Santo Niño (Poblacion)"),
      b("Sindaton"),
      b("Southern Davao"),
      b("Tagpore"),
      b("Tibungol"),
      b("Upper Licanan"),
      b("Waterfall"),
    ],
  },
  {
    name: "Santo Tomas",
    district: "DISTRICT_II",
    barangays: [
      b("Balagunan"),
      b("Baguio"),
      b("Bobongon"),
      b("Casig-ang"),
      b("Esperanza"),
      b("Kimamon"),
      b("Kinamayan"),
      b("Lacson"),
      b("La Libertad"),
      b("Lungaog"),
      b("Magwawa"),
      b("Menzi"),
      b("New Katipunan"),
      b("New Visayas"),
      b("Pantaron"),
      b("Patria"),
      b("Poblacion"),
      b("Salvacion"),
      b("San Jose"),
      b("San Miguel"),
      b("San Vicente"),
      b("Santo Niño"),
      b("Tagsipol"),
      b("Talomo"),
      b("Tibal-og"),
      b("Tulalian"),
    ],
  },
];

export function getMunicipalitiesByDistrict(
  district: DavaoDistrict | "",
): MunicipalityInfo[] {
  if (!district) return [];
  return DAVAO_DEL_NORTE_LOCATIONS.filter((m) => m.district === district);
}

export function getBarangaysByMunicipality(
  municipalityName: string,
): BarangayInfo[] {
  const match = DAVAO_DEL_NORTE_LOCATIONS.find((m) => m.name === municipalityName);
  return match?.barangays ?? [];
}

export function getPuroksByBarangay(
  municipalityName: string,
  barangayName: string,
): string[] {
  const barangays = getBarangaysByMunicipality(municipalityName);
  const match = barangays.find((bg) => bg.name === barangayName);
  return match?.puroks ?? DEFAULT_PUROKS;
}

export function getSitiosByBarangay(
  municipalityName: string,
  barangayName: string,
): string[] {
  const barangays = getBarangaysByMunicipality(municipalityName);
  const match = barangays.find((bg) => bg.name === barangayName);
  return match?.sitios ?? DEFAULT_SITIOS;
}
