"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";

type RoleType =
  | "ADMIN"
  | "ADMIN_ASSISTANT"
  | "DIVISION_CLERK"
  | "DIVISION_HEAD"
  | "SECTION_HEAD"
  | "PROVINCIAL_ENGR";

const STATUS_STYLES: Record<string, { bg: string; dot: string; text: string }> = {
  ACTIVE: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700" },
  INACTIVE: { bg: "bg-gray-100", dot: "bg-gray-500", text: "text-gray-700" },
  PENDING: { bg: "bg-yellow-50", dot: "bg-yellow-500", text: "text-yellow-700" },
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

function getAvatarColor(name?: string | null): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-rose-500",
  ];
  const hash = (name ?? "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length]!;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DESIGNATIONS = [
  "Provincial Engineer",
  "Assistant Provincial Engineer",
  "Admin Officer IV",
  "Admin Officer III",
  "Admin Officer II",
  "Admin Officer I",
  "Planning Officer",
  "Project Engineer II",
  "Project Engineer I",
  "Construction Foreman",
  "Utility Worker",
  "Driver",
];

const DIVISIONS = [
  "Office of the PE",
  "ADMIN Division",
  "PDPM",
  "Maintenance",
  "South Division",
  "North Division",
];

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  bars: number;
  label: string;
  color: string;
  textColor: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, bars: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
  if (score <= 3) return { score, bars: 2, label: "Medium Strength", color: "bg-blue-500", textColor: "text-blue-600" };
  if (score <= 4) return { score, bars: 3, label: "Strong", color: "bg-green-500", textColor: "text-green-600" };
  return { score, bars: 4, label: "Very Strong", color: "bg-green-600", textColor: "text-green-600" };
}

// ─── Add New User Modal ────────────────────────────────────────────────────────

function AddUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [extension, setExtension] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">("");
  const [designation, setDesignation] = useState("");
  const [division, setDivision] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<RoleType>("ADMIN");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  const utils = api.useUtils();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      setMessage("User created successfully!");
      setMessageType("success");
      resetForm();
      void utils.user.getAll.invalidate();
      void utils.user.getStats.invalidate();
      void utils.user.getDivisions.invalidate();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    },
    onError: (error) => {
      setMessage(error.message);
      setMessageType("error");
    },
  });

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setExtension("");
    setSex("");
    setDesignation("");
    setDivision("");
    setEmployeeId("");
    setPassword("");
    setConfirmPassword("");
    setRole("ADMIN");
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (!sex) {
      setMessage("Please select sex.");
      setMessageType("error");
      return;
    }

    if (sex !== "MALE" && sex !== "FEMALE") return;

    createUser.mutate({
      firstName,
      middleName: middleName || undefined,
      lastName,
      extension: extension || undefined,
      sex,
      designation,
      division,
      employeeId,
      password,
      role,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  const inputClass =
    "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
  const selectClass =
    "block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";

  const selectChevron = (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
  const labelClass = "mb-1 block text-sm font-semibold text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Register a new employee for the Provincial Engineers Office MIS.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-7 pt-2 pb-0">
          {message && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* ── Section 1: Personal Information ── */}
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Juan"
                />
              </div>
              <div>
                <label className={labelClass}>Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Santos"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Dela Cruz"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-[140px_1fr] gap-3">
              <div>
                <label className={labelClass}>Extension</label>
                <input
                  type="text"
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Jr., III"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Sex <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={sex}
                    onChange={(e) => setSex(e.target.value as "MALE" | "FEMALE" | "")}
                    className={selectClass}
                  >
                    <option value="">Select Sex</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {selectChevron}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Employment Information ── */}
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2.5 border-t border-gray-200 pt-5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Employment Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {selectChevron}
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Division / Unit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {selectChevron}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Account Credentials ── */}
          <div className="mb-2">
            <div className="mb-4 flex items-center gap-2.5 border-t border-gray-200 pt-5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Account Credentials
              </h3>
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Employee ID / Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="e.g. 2023-00123"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                This will be used for system login and audit logs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i <= passwordStrength.bars
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pr-10 ${
                      !passwordsMatch
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      !passwordsMatch
                        ? "text-red-400 hover:text-red-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {!passwordsMatch ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                    ) : showConfirmPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-7 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createUser.isPending || !passwordsMatch}
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createUser.isPending ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit User Modal ───────────────────────────────────────────────────────────

interface EditableUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  employeeId?: string | null;
  designation?: string | null;
  division?: string | null;
  sex?: string | null;
  status?: string | null;
}

function EditUserModal({
  open,
  onClose,
  userData,
}: {
  open: boolean;
  onClose: () => void;
  userData: EditableUser | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>("ADMIN");
  const [designation, setDesignation] = useState("");
  const [division, setDivision] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "PENDING">("ACTIVE");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const utils = api.useUtils();

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? "");
      setEmail(userData.email ?? "");
      setRole((userData.role as RoleType) ?? "ADMIN");
      setDesignation(userData.designation ?? "");
      setDivision(userData.division ?? "");
      setSex((userData.sex as "MALE" | "FEMALE" | "") ?? "");
      setStatus((userData.status as "ACTIVE" | "INACTIVE" | "PENDING") ?? "ACTIVE");
      setMessage("");
    }
  }, [userData]);

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      setMessage("User updated successfully!");
      setMessageType("success");
      void utils.user.getAll.invalidate();
      void utils.user.getStats.invalidate();
      void utils.user.getDivisions.invalidate();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    },
    onError: (error) => {
      setMessage(error.message);
      setMessageType("error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setMessage("");
    updateUser.mutate({
      id: userData.id,
      name,
      email,
      role,
      designation: designation || undefined,
      division: division || undefined,
      sex: sex || undefined,
      status,
    });
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!open || !userData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Update User</h2>
            <p className="text-sm text-gray-500">Edit user account details</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5">
          {message && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="e.g. Juan Dela Cruz" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Employee ID</label>
              <div className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-mono text-sm text-gray-500">{userData?.employeeId ?? "—"}</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="e.g. user@peo.gov.ph" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label>
              <select value={role} onChange={(e) => setRole(e.target.value as RoleType)} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
                <option value="ADMIN">Admin</option>
                <option value="ADMIN_ASSISTANT">Admin Assistant</option>
                <option value="DIVISION_CLERK">Division Clerk</option>
                <option value="DIVISION_HEAD">Division Head</option>
                <option value="SECTION_HEAD">Section Head</option>
                <option value="PROVINCIAL_ENGR">Provincial Engr.</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="e.g. Provincial Engineer" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Division</label>
              <input type="text" value={division} onChange={(e) => setDivision(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="e.g. ADMIN Division" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value as "MALE" | "FEMALE" | "")} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
                <option value="">Select...</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "PENDING")} className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={handleClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={updateUser.isPending} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Actions Dropdown ──────────────────────────────────────────────────────────

function ActionsDropdown({
  userId,
  userRole,
  userStatus,
  onEdit,
}: {
  userId: string;
  userRole: string;
  userStatus: string;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  const updateStatus = api.user.updateStatus.useMutation({
    onSuccess: () => {
      void utils.user.getAll.invalidate();
      void utils.user.getStats.invalidate();
    },
  });

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      void utils.user.getAll.invalidate();
      void utils.user.getStats.invalidate();
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (userRole === "SUPER_ADMIN") return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Update User
          </button>
          <div className="my-1 border-t border-gray-100" />
          {userStatus !== "ACTIVE" && (
            <button onClick={() => { updateStatus.mutate({ id: userId, status: "ACTIVE" }); setOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Set Active
            </button>
          )}
          {userStatus !== "INACTIVE" && (
            <button onClick={() => { updateStatus.mutate({ id: userId, status: "INACTIVE" }); setOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              <span className="h-2 w-2 rounded-full bg-gray-500" />
              Set Inactive
            </button>
          )}
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => { if (confirm("Are you sure you want to delete this user?")) { deleteUser.mutate({ id: userId }); } setOpen(false); }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}

// ─── User Management Content ────────────────────────────────────────────────────

export function UserManagementContent() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: statsData } = api.user.getStats.useQuery();
  const { data: divisions } = api.user.getDivisions.useQuery();

  const { data, isLoading } = api.user.getAll.useQuery({
    search: search || undefined,
    role: roleFilter || undefined,
    division: divisionFilter || undefined,
    status: statusFilter
      ? (statusFilter as "ACTIVE" | "INACTIVE" | "PENDING")
      : undefined,
    page,
    pageSize,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (
    setter: (v: string) => void,
    value: string,
  ) => {
    setter(value);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Users</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage accounts, roles, and permissions for all provincial staff.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.total ?? 0}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.active ?? 0}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.inactive ?? 0}</p>
            <p className="mt-0.5 text-xs text-gray-400">Accounts disabled</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.pending ?? 0}</p>
            {(statsData?.pending ?? 0) > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Requires action
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>
        <select value={roleFilter} onChange={(e) => handleFilterChange(setRoleFilter, e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="ADMIN_ASSISTANT">Admin Assistant</option>
          <option value="DIVISION_CLERK">Division Clerk</option>
          <option value="DIVISION_HEAD">Division Head</option>
          <option value="SECTION_HEAD">Section Head</option>
          <option value="PROVINCIAL_ENGR">Provincial Engr.</option>
        </select>
        <select value={divisionFilter} onChange={(e) => handleFilterChange(setDivisionFilter, e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
          <option value="">All Divisions</option>
          {divisions?.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M9.75 8.25h.008v.008H9.75V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">User Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Employee ID</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Designation</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Division</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Sex</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Date Added</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const statusStyle = STATUS_STYLES[u.status ?? "PENDING"] ?? STATUS_STYLES.PENDING!;
                  return (
                    <tr key={u.id} className="border-b border-gray-100 transition hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(u.name)}`}>
                            {getInitials(u.name, u.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">{u.name ?? "—"}</p>
                            <p className="truncate text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="font-mono text-xs text-gray-600">{u.employeeId ?? "—"}</span></td>
                      <td className="px-4 py-3 text-gray-600">{u.designation ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{u.division ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{u.sex ? (u.sex === "MALE" ? "Male" : "Female") : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                          {(u.status ?? "PENDING").charAt(0) + (u.status ?? "PENDING").slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <ActionsDropdown
                          userId={u.id}
                          userRole={u.role}
                          userStatus={u.status ?? "PENDING"}
                          onEdit={() => { setEditingUser(u); setShowEditModal(true); }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium text-gray-900">{Math.min(page * pageSize, total)}</span> of{" "}
              <span className="font-medium text-gray-900">{total}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(Number(p))}
                    className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      page === p ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditUserModal
        open={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingUser(null); }}
        userData={editingUser}
      />
    </>
  );
}
