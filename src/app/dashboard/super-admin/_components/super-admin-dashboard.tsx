"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "~/trpc/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export function SuperAdminDashboard({ user }: { user: User }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "ADMIN_ASSISTANT">("ADMIN");
  const [message, setMessage] = useState("");

  const utils = api.useUtils();
  const { data: users, isLoading } = api.user.getAll.useQuery();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      setMessage("User created successfully");
      setName("");
      setEmail("");
      setPassword("");
      void utils.user.getAll.invalidate();
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      setMessage("User deleted successfully");
      void utils.user.getAll.invalidate();
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    createUser.mutate({ name, email, password, role });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PEO-MIS</h1>
            <p className="text-xs text-gray-500">Super Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name ?? user.email}
              </p>
              <p className="text-xs text-blue-600">Super Admin</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {users?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {users?.filter((u) => u.role === "ADMIN").length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Admin Assistants</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {users?.filter((u) => u.role === "ADMIN_ASSISTANT").length ?? 0}
            </p>
          </div>
        </div>

        {/* Create User Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Create New User
          </h2>

          {message && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                message.includes("successfully")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "ADMIN" | "ADMIN_ASSISTANT")
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="ADMIN">Admin</option>
                <option value="ADMIN_ASSISTANT">Admin Assistant</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={createUser.isPending}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createUser.isPending ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Manage Users
          </h2>

          {isLoading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "ADMIN"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => deleteUser.mutate({ id: u.id })}
                            disabled={deleteUser.isPending}
                            className="text-sm text-red-600 transition hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
