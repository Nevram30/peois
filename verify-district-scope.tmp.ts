/**
 * Temporary end-to-end verification of division-based district scoping.
 * Creates throwaway users + projects, calls the real tRPC procedures via a
 * server-side caller with fabricated sessions, asserts scoping, then cleans up.
 * Run: npx tsx --env-file=.env verify-district-scope.tmp.ts (then delete me)
 */
import { db } from "./src/server/db";
import { appRouter } from "./src/server/api/root";
import { divisionToDistrict } from "./src/lib/divisions";
import type { Session } from "next-auth";

const TAG = "ZZVERIFY";

function callerFor(userId: string, role: "ADMIN" | "USER" | "SUPER_ADMIN") {
  const session = {
    user: { id: userId, role, name: TAG, email: `${userId}@test.local` },
    expires: new Date(Date.now() + 3600_000).toISOString(),
  } as unknown as Session;
  return appRouter.createCaller({ db, session, headers: new Headers() });
}

async function main() {
  // ── pure-function checks ──
  const cases: Array<[string | null, string | null]> = [
    ["1ST ENGR DIST", "DISTRICT_I"],
    ["2ND ENGR DIST", "DISTRICT_II"],
    [" 1st engr dist ", "DISTRICT_I"],
    ["2nd  engr  dist", "DISTRICT_II"],
    ["SMAD", null],
    ["PDPM", null],
    ["EPM", null],
    ["QACD", null],
    [null, null],
    ["ADMIN Division", null],
  ];
  for (const [input, expected] of cases) {
    const got = divisionToDistrict(input);
    if (got !== expected)
      throw new Error(
        `divisionToDistrict(${JSON.stringify(input)}) = ${String(got)}, expected ${String(expected)}`,
      );
  }
  console.log("divisionToDistrict mapping OK (incl. tolerant matching)");

  // ── fixtures ──
  const mk = (n: string, role: "ADMIN" | "USER" | "SUPER_ADMIN", division: string | null) =>
    db.user.create({
      data: {
        email: `${TAG}-${n}@test.local`.toLowerCase(),
        name: `${TAG} ${n}`,
        role,
        division,
        employeeId: `${TAG}-${n}`,
        password: "x",
      },
    });

  const [adminD1, userD2, adminSmad, superAdmin] = await Promise.all([
    mk("admin-d1", "ADMIN", "1ST ENGR DIST"),
    mk("user-d2", "USER", "2ND ENGR DIST"),
    mk("admin-smad", "ADMIN", "SMAD"),
    mk("sa", "SUPER_ADMIN", null),
  ]);

  const mkProject = (n: string, loc: "DISTRICT_I" | "DISTRICT_II") =>
    db.project.create({
      data: {
        title: `${TAG} ${n}`,
        projectCode: `${TAG}-${n}`,
        locationImplementation: loc,
        modeOfImplementation: "BY_ADMINISTRATION",
        sourceOfFund: "GENERAL_FUND",
        status: "ON_GOING",
        projectCost: loc === "DISTRICT_I" ? 1000 : 2000,
        contractCost: 1,
        budgetYear: "2099",
        createdById: superAdmin.id,
      },
    });
  const [p1, p2] = await Promise.all([
    mkProject("p1", "DISTRICT_I"),
    mkProject("p2", "DISTRICT_II"),
  ]);

  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error("FAIL: " + msg);
    console.log("PASS: " + msg);
  };

  try {
    const c1 = callerFor(adminD1.id, "ADMIN");
    const c2 = callerFor(userD2.id, "USER");
    const cs = callerFor(adminSmad.id, "ADMIN");
    const csa = callerFor(superAdmin.id, "SUPER_ADMIN");

    // getAll scoping
    const all1 = await c1.project.getAll();
    assert(all1.some((p) => p.id === p1.id) && !all1.some((p) => p.id === p2.id),
      "District-1 admin getAll: sees D1 project, not D2");
    const all2 = await c2.project.getAll();
    assert(all2.some((p) => p.id === p2.id) && !all2.some((p) => p.id === p1.id),
      "District-2 user getAll: sees D2 project, not D1");
    const allS = await cs.project.getAll();
    assert(allS.some((p) => p.id === p1.id) && allS.some((p) => p.id === p2.id),
      "SMAD admin getAll: sees both districts");
    const allSA = await csa.project.getAll();
    assert(allSA.some((p) => p.id === p1.id) && allSA.some((p) => p.id === p2.id),
      "SUPER_ADMIN getAll: sees both districts");

    // getById guard
    assert((await c1.project.getById({ id: p2.id })) === null,
      "District-1 admin getById on D2 project returns null");
    assert((await c1.project.getById({ id: p1.id }))?.id === p1.id,
      "District-1 admin getById on D1 project returns it");

    // getStats scoping (budgetYear 2099 isolates our fixtures)
    const stats1 = await c1.project.getStats({ budgetYear: "2099" });
    assert(stats1.total === 1 && stats1.ongoing === 1,
      "District-1 admin getStats(2099): counts only the D1 project");
    const statsS = await cs.project.getStats({ budgetYear: "2099" });
    assert(statsS.total === 2, "SMAD admin getStats(2099): counts both projects");

    // getDistrictData scoping (drives the dashboard district status cards)
    const dd1 = await c1.project.getDistrictData({ budgetYear: "2099" });
    assert(dd1.length === 1 && dd1[0]!.district === "DISTRICT_I",
      "District-1 admin getDistrictData: only DISTRICT_I card");
    const dd2 = await c2.project.getDistrictData({ budgetYear: "2099" });
    assert(dd2.length === 1 && dd2[0]!.district === "DISTRICT_II",
      "District-2 user getDistrictData: only DISTRICT_II card");
    const ddS = await cs.project.getDistrictData({ budgetYear: "2099" });
    assert(ddS.length === 2, "SMAD admin getDistrictData: both district cards");

    // Financial allocation overview scoping
    const fin1 = await c1.project.getFinancialOverview({ budgetYear: "2099" });
    assert(fin1.totalAllocation === 1000,
      "District-1 admin getFinancialOverview: only D1 allocation (1000)");
    const fin2 = await c2.project.getFinancialOverview({ budgetYear: "2099" });
    assert(fin2.totalAllocation === 2000,
      "District-2 user getFinancialOverview: only D2 allocation (2000)");
    const finS = await cs.project.getFinancialOverview({ budgetYear: "2099" });
    assert(finS.totalAllocation === 3000,
      "SMAD admin getFinancialOverview: both districts (3000)");

    // Remaining balance scoping
    const rem1 = await c1.project.getRemainingBalance({ budgetYear: "2099" });
    assert(rem1.remaining.total === 1000,
      "District-1 admin getRemainingBalance: only D1 (1000)");

    // getMyDistrictScope (drives UI dropdown hiding)
    assert((await c1.project.getMyDistrictScope()) === "DISTRICT_I",
      "getMyDistrictScope: District-1 admin -> DISTRICT_I");
    assert((await c2.project.getMyDistrictScope()) === "DISTRICT_II",
      "getMyDistrictScope: District-2 user -> DISTRICT_II");
    assert((await cs.project.getMyDistrictScope()) === null,
      "getMyDistrictScope: SMAD admin -> null (unrestricted)");
    assert((await csa.project.getMyDistrictScope()) === null,
      "getMyDistrictScope: SUPER_ADMIN -> null");

    // getBudgetYears scoping
    const years1 = await c1.project.getBudgetYears();
    assert(years1.includes("2099"), "District-1 admin getBudgetYears includes 2099");

    // Freshness: reassign division without new session
    await db.user.update({ where: { id: adminD1.id }, data: { division: "SMAD" } });
    const allAfter = await c1.project.getAll();
    assert(allAfter.some((p) => p.id === p2.id),
      "After division reassignment to SMAD (no re-login), D2 project visible");

    console.log("\nALL CHECKS PASSED");
  } finally {
    await db.project.deleteMany({ where: { projectCode: { startsWith: TAG } } });
    await db.user.deleteMany({ where: { email: { contains: TAG.toLowerCase() } } });
    console.log("cleaned up fixtures");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
