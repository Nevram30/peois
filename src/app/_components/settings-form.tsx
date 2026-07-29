"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";

type Banner = { kind: "success" | "error"; text: string } | null;

export const SettingsForm = () => {
  const utils = api.useUtils();
  const { data: me, isLoading } = api.user.me.useQuery();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileBanner, setProfileBanner] = useState<Banner>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordBanner, setPasswordBanner] = useState<Banner>(null);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (me) {
      setName(me.name ?? "");
      setEmail(me.email ?? "");
      setImageUrl(me.image ?? null);
    }
  }, [me]);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setProfileBanner({ kind: "success", text: "Profile updated successfully." });
      setImageFile(null);
      void utils.user.me.invalidate();
    },
    onError: (err) => {
      setProfileBanner({ kind: "error", text: err.message });
    },
    onSettled: () => setIsSavingProfile(false),
  });

  const changePassword = api.user.changePassword.useMutation({
    onSuccess: () => {
      setPasswordBanner({ kind: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      setPasswordBanner({ kind: "error", text: err.message });
    },
  });

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileBanner(null);
    setIsSavingProfile(true);

    let nextImage: string | null | undefined = undefined;
    if (imageFile) {
      try {
        const result = await startUpload([imageFile]);
        nextImage = result?.[0]?.url ?? undefined;
        if (!nextImage) {
          setProfileBanner({ kind: "error", text: "Image upload failed." });
          setIsSavingProfile(false);
          return;
        }
      } catch {
        setProfileBanner({ kind: "error", text: "Image upload failed." });
        setIsSavingProfile(false);
        return;
      }
    }

    updateProfile.mutate({
      name: name.trim(),
      email: email.trim(),
      ...(nextImage !== undefined ? { image: nextImage } : {}),
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordBanner(null);
    if (newPassword !== confirmPassword) {
      setPasswordBanner({ kind: "error", text: "Passwords do not match." });
      return;
    }
    changePassword.mutate({ currentPassword, newPassword, confirmPassword });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center text-sm text-gray-500">
        Loading settings…
      </div>
    );
  }

  const initial = (name || email || "U").charAt(0).toUpperCase();
  const canChangePassword = me?.role === "SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information and password.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Profile</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Update your display name, email, and profile photo.
        </p>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-200">
              {previewSrc ? (
                <Image src={previewSrc} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-2xl font-semibold text-gray-700">
                  {initial}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePickImage}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {imageFile ? "Change photo" : "Upload photo"}
                </button>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">PNG, JPG or WebP. Max 8MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
              />
            </div>
          </div>

          {me?.designation && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  value={me.designation ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Division</label>
                <input
                  type="text"
                  value={me.division ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />
              </div>
            </div>
          )}

          {profileBanner && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${profileBanner.kind === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
                }`}
            >
              {profileBanner.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile || updateProfile.isPending}
              className="rounded-lg bg-[#1e3a4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16293a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProfile || updateProfile.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {canChangePassword && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Password</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Use a strong password that you don&apos;t use elsewhere.
          </p>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
              autoComplete="current-password"
            />
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              onToggle={() => setShowNew((v) => !v)}
              autoComplete="new-password"
              hint="Minimum 8 characters."
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              autoComplete="new-password"
            />

            {passwordBanner && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${passwordBanner.kind === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
                  }`}
              >
                {passwordBanner.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="rounded-lg bg-[#1e3a4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16293a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePassword.isPending ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Sign out</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Sign out of your account on this device.
        </p>

        <div className="mt-5 flex justify-start">
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </section>

      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </div>
            <h2 className="text-center text-lg font-semibold text-gray-900">Sign out</h2>
            <p className="mt-1 text-center text-sm text-gray-500">Are you sure you want to sign out of your account?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setSigningOut(true);
                  await signOut({ callbackUrl: "/login" });
                }}
                disabled={signingOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signingOut && (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete?: string;
  hint?: string;
}) => {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          )}
        </button>
      </div>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
