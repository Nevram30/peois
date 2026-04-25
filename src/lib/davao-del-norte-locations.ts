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
      b("San Miguel (Camp 4)"),
      b("Visayan Village"),
    ],
  },
  {
    name: "Asuncion",
    district: "DISTRICT_I",
    barangays: [
      b("Binancian"),
      b("Buan"),
      b("Buclad"),
      b("Cabaywa"),
      b("Camansa"),
      b("Cambanogoy (Poblacion)"),
      b("Camoning"),
      b("Canatan"),
      b("Concepcion"),
      b("Doña Andrea"),
      b("Magatos"),
      b("Napungas"),
      b("New Bantayan"),
      b("New Loon"),
      b("New Santiago"),
      b("Pamacaun"),
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
      b("Santa Fe"),
      b("Santo Niño"),
      b("Suawon"),
    ],
  },
  {
    name: "San Isidro",
    district: "DISTRICT_I",
    barangays: [
      b("Dacudao"),
      b("Datu Balong"),
      b("Igangon"),
      b("Kipalili"),
      b("Libuton"),
      b("Linao"),
      b("Mamangan"),
      b("Monte Dujali"),
      b("Pinamuno"),
      b("Sabangan"),
      b("San Miguel"),
      b("Santo Niño"),
      b("Sawata (Poblacion)"),
    ],
  },
  {
    name: "Talaingod",
    district: "DISTRICT_I",
    barangays: [
      b("Dagohoy"),
      b("Palma Gil"),
      b("Santo Niño (Poblacion)"),
    ],
  },
  {
    name: "Panabo City",
    district: "DISTRICT_II",
    barangays: [
      b("A. O. Floirendo"),
      b("Buenavista"),
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
      b("Lower Panaga (Roxas)"),
      b("Mabunao"),
      b("Maduao"),
      b("Malativas"),
      b("Manay"),
      b("Nanyo"),
      b("New Malaga (Dalisay)"),
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
    name: "IGACOS",
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
      b("Cogon (Babak)"),
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
      b("Mabini"),
      b("Mambago-A"),
      b("Mambago-B"),
      b("Miranda"),
      b("Monado"),
      b("Pangubatan"),
      b("Peñaplata (Poblacion)"),
      b("Poblacion Kaputian"),
      b("San Agustin"),
      b("San Antonio"),
      b("San Isidro (Babak)"),
      b("San Isidro (Kaputian)"),
      b("San Jose"),
      b("San Miguel"),
      b("San Remegio"),
      b("Santa Cruz"),
      b("Santo Niño"),
      b("Sion"),
      b("Tagbaobo"),
      b("Tagbay"),
      b("Tagbitan-ag"),
      b("Tagdaliao"),
      b("Tagpopongan"),
      b("Tambo"),
      b("Toril"),
      b("Villarica"),
    ],
  },
  {
    name: "Braulio E. Dujali",
    district: "DISTRICT_II",
    barangays: [
      b("Cabayangan"),
      b("Dujali (Poblacion)"),
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
      b("Mangalcal"),
      b("Minda"),
      b("New Camiling"),
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
    name: "Santo Tomas",
    district: "DISTRICT_II",
    barangays: [
      b("Balagunan"),
      b("Bobongon"),
      b("Casig-ang"),
      b("Esperanza"),
      b("Kimamon"),
      b("Kinamayan"),
      b("La Libertad"),
      b("Lungaog"),
      b("Magwawa"),
      b("New Katipunan"),
      b("New Visayas"),
      b("Pantaron"),
      b("Salvacion"),
      b("San Jose"),
      b("San Miguel"),
      b("San Vicente"),
      b("Talomo"),
      b("Tibal-og (Poblacion)"),
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
