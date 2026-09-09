"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaUser,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
    FaSave,
    FaTimes,
} from "react-icons/fa";

export default function ProfilePage() {

    const router = useRouter();

    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingUsername, setEditingUsername] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // FETCH PROFILE
    // =========================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/auth/profile",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await response.json();

            setProfile(data);
            setUsername(data.username);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // =========================================================
    // START EDITING USERNAME
    // =========================================================

    const handleEditUsername = () => {

        setUsername(profile.username);

        setError("");
        setSuccess("");

        setEditingUsername(true);
    };

    // =========================================================
    // CANCEL USERNAME EDIT
    // =========================================================

    const handleCancelUsername = () => {

        setUsername(profile.username);

        setError("");
        setEditingUsername(false);
    };

    // =========================================================
    // SAVE USERNAME
    // =========================================================

    const handleSaveUsername = async () => {

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {

            setError("Username cannot be empty");
            return;
        }

        if (trimmedUsername === profile.username) {

            setEditingUsername(false);
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                "http://localhost:8080/api/auth/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: trimmedUsername,
                    }),
                }
            );

            if (!response.ok) {

                let message = "Failed to update username";

                try {

                    const data = await response.json();

                    if (data.errors?.username) {
                        message = data.errors.username;
                    } else if (data.message) {
                        message = data.message;
                    } else if (data.detail) {
                        message = data.detail;
                    }

                } catch {
                    // Keep the fallback message when the response is not JSON.
                }

                throw new Error(message);
            }

            setEditingUsername(false);

            setSuccess("Username updated successfully");

            // Refresh profile from backend
            await fetchProfile();

        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

        }
    };

    return (
        <main className="min-h-screen bg-[#08090d] text-white">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-white/10 bg-[#101117]">

                <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5">

                    <button
                        onClick={() =>
                            router.push("/admin/dashboard")
                        }
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition mb-3"
                    >
                        <FaArrowLeft className="text-xs" />
                        Dashboard
                    </button>

                    <h1 className="text-2xl font-semibold">
                        Profile
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your account and security
                    </p>

                </div>

            </header>

            {/* =================================================
                CONTENT
            ================================================= */}

            <section className="max-w-5xl mx-auto px-5 sm:px-8 py-8">

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {success}
                    </div>
                )}

                {/* Loading */}
                {loading ? (

                    <div className="text-center py-20 text-gray-500">
                        Loading profile...
                    </div>

                ) : profile ? (

                    <div className="space-y-6">

                        {/* =================================================
                            ACCOUNT
                        ================================================= */}

                        <div className="bg-[#101117] border border-white/10 rounded-2xl overflow-hidden">

                            {/* Account Header */}

                            <div className="p-6 border-b border-white/10">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <FaUser />
                                    </div>

                                    <div>

                                        <h2 className="font-semibold">
                                            Account
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Your account information
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Username */}

                            <div className="p-6">

                                {!editingUsername ? (

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Username
                                            </p>

                                            <p className="text-sm mt-1">
                                                {profile.username}
                                            </p>

                                        </div>

                                        <button
                                            onClick={handleEditUsername}
                                            className="rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm transition"
                                        >
                                            Edit
                                        </button>

                                    </div>

                                ) : (

                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            handleSaveUsername();
                                        }}
                                    >

                                        <label className="block text-sm text-gray-500 mb-2">
                                            Username
                                        </label>

                                        <div className="flex flex-col sm:flex-row gap-3">

                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                autoFocus
                                                disabled={saving}
                                                minLength={3}
                                                maxLength={50}
                                                pattern="[A-Za-z0-9._-]+"
                                                required
                                                className="flex-1 bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition disabled:opacity-50"
                                            />

                                            <div className="flex gap-2">

                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm transition"
                                                >
                                                    <FaSave className="text-xs" />

                                                    {saving
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>

                                                <button
                                                    onClick={handleCancelUsername}
                                                    type="button"
                                                    disabled={saving}
                                                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 px-4 py-3 text-sm transition"
                                                >
                                                    <FaTimes className="text-xs" />

                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    </form>

                                )}

                            </div>

                        </div>

                        {/* =================================================
                            SECURITY
                        ================================================= */}

                        <div className="bg-[#101117] border border-white/10 rounded-2xl overflow-hidden">

                            {/* Security Header */}

                            <div className="p-6 border-b border-white/10">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <FaShieldAlt />
                                    </div>

                                    <div>

                                        <h2 className="font-semibold">
                                            Security
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Manage your account security
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Password */}

                            <div className="p-6 border-b border-white/10">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                            <FaLock />
                                        </div>

                                        <div>

                                            <p className="text-sm font-medium">
                                                Password
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Your password is securely encrypted
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        className="rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm transition"
                                    >
                                        Change
                                    </button>

                                </div>

                            </div>

                            {/* TOTP */}

                            <div className="p-6">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                profile.totpEnabled
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-white/5 text-gray-400"
                                            }`}
                                        >
                                            <FaShieldAlt />
                                        </div>

                                        <div>

                                            <p className="text-sm font-medium">
                                                Two-factor authentication
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Authenticator app
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        className={`flex items-center gap-2 text-sm ${
                                            profile.totpEnabled
                                                ? "text-green-400"
                                                : "text-gray-500"
                                        }`}
                                    >

                                        <FaCheckCircle />

                                        {profile.totpEnabled
                                            ? "Enabled"
                                            : "Disabled"}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                ) : null}

            </section>

        </main>
    );
}
