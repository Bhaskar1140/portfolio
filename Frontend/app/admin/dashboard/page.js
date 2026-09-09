"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaTachometerAlt,
    FaProjectDiagram,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa";

export default function Dashboard() {

    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8080";

    // =========================================================
    // FETCH PROJECTS
    // =========================================================

    const fetchProjects = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${apiBaseUrl}/api/projects`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();

            setProjects(data);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

            setError(
                "Unable to load dashboard data right now."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = async () => {

        try {

            await fetch(
                `${apiBaseUrl}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            router.push("/admin");

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }
    };

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalProjects = projects.length;

    const publishedProjects =
        projects.filter(
            (project) => project.published === true
        ).length;

    const draftProjects =
        projects.filter(
            (project) => project.published !== true
        ).length;

    const recentProjects =
        projects.slice(0, 3);

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <main className="min-h-screen bg-[#08090d] text-white">


            {/* =================================================
                MOBILE HEADER
            ================================================= */}

            <header className="lg:hidden h-16 border-b border-white/10 bg-[#101117] flex items-center justify-between px-5">

                <h1 className="font-semibold">
                    Admin Panel
                </h1>

                <button
                    onClick={() =>
                        setSidebarOpen(!sidebarOpen)
                    }
                    className="text-gray-400 hover:text-white"
                >
                    {sidebarOpen
                        ? <FaTimes />
                        : <FaBars />
                    }
                </button>

            </header>


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64
                    bg-[#101117] border-r border-white/10
                    transform transition-transform duration-300
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* Logo */}

                <div className="h-20 flex items-center px-6 border-b border-white/10">

                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mr-3">

                        <span className="text-purple-400">
                            ◆
                        </span>

                    </div>

                    <div>

                        <h1 className="font-semibold">
                            Admin Panel
                        </h1>

                        <p className="text-xs text-gray-500">
                            Portfolio Manager
                        </p>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="p-4 space-y-2">

                    {/* Dashboard */}

                    <button
                        onClick={() => {
                            router.push(
                                "/admin/dashboard"
                            );

                            setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/15 text-purple-400"
                    >

                        <FaTachometerAlt />

                        Dashboard

                    </button>


                    {/* Projects */}

                    <button
                        onClick={() => {
                            router.push(
                                "/admin/projects"
                            );

                            setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
                    >

                        <FaProjectDiagram />

                        Projects

                    </button>


                    {/* Profile */}

                    <button
                        onClick={() => {
                            router.push(
                                "/admin/profile"
                            );

                            setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
                    >

                        <FaUser />

                        Profile

                    </button>

                </nav>


                {/* Logout */}

                <div className="absolute bottom-5 left-4 right-4">

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
                    >

                        <FaSignOutAlt />

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section className="lg:ml-64 min-h-screen">


                {/* =================================================
                    DESKTOP HEADER
                ================================================= */}

                <header className="hidden lg:flex h-20 border-b border-white/10 items-center justify-between px-8">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Dashboard
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your portfolio
                        </p>

                    </div>


                    <div className="text-right">

                        <p className="text-sm text-gray-300">
                            Welcome back
                        </p>

                        <p className="text-xs text-gray-500">
                            Administrator
                        </p>

                    </div>

                </header>


                {/* =================================================
                    DASHBOARD CONTENT
                ================================================= */}

                <div className="p-5 sm:p-8">


                    {/* Mobile Heading */}

                    <div className="lg:hidden mb-8">

                        <h2 className="text-2xl font-semibold">
                            Dashboard
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your portfolio
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">


                        {/* Total Projects */}

                        <div className="bg-[#101117] border border-white/10 rounded-2xl p-6">

                            <p className="text-sm text-gray-500">
                                Total Projects
                            </p>

                            <p className="text-3xl font-semibold mt-3">

                                {loading
                                    ? "—"
                                    : totalProjects
                                }

                            </p>

                        </div>


                        {/* Published Projects */}

                        <div className="bg-[#101117] border border-white/10 rounded-2xl p-6">

                            <p className="text-sm text-gray-500">
                                Published Projects
                            </p>

                            <p className="text-3xl font-semibold mt-3">

                                {loading
                                    ? "—"
                                    : publishedProjects
                                }

                            </p>

                        </div>


                        {/* Draft Projects */}

                        <div className="bg-[#101117] border border-white/10 rounded-2xl p-6 sm:col-span-2 xl:col-span-1">

                            <p className="text-sm text-gray-500">
                                Draft Projects
                            </p>

                            <p className="text-3xl font-semibold mt-3">

                                {loading
                                    ? "—"
                                    : draftProjects
                                }

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        RECENT PROJECTS
                    ================================================= */}

                    <div className="mt-8 bg-[#101117] border border-white/10 rounded-2xl">


                        {/* Recent Projects Header */}

                        <div className="p-6 border-b border-white/10">

                            <h3 className="font-semibold">
                                Recent Projects
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Your latest portfolio projects
                            </p>

                        </div>


                        {/* Loading */}

                        {loading ? (

                            <div className="p-8 text-center text-sm text-gray-500">

                                Loading projects...

                            </div>

                        ) : recentProjects.length === 0 ? (

                            <div className="p-8 text-center text-sm text-gray-500">

                                No projects found.

                            </div>

                        ) : (

                            <div className="divide-y divide-white/5">

                                {recentProjects.map(
                                    (project) => (

                                        <div
                                            key={project.id}
                                            className="p-5 flex items-center justify-between gap-4"
                                        >

                                            {/* Project Information */}

                                            <div className="min-w-0">

                                                <p className="text-sm font-medium truncate">

                                                    {project.title}

                                                </p>

                                                <p className="text-xs text-gray-500 mt-1 truncate">

                                                    {project.description}

                                                </p>

                                            </div>


                                            {/* Status */}

                                            <span
                                                className={`
                                                    shrink-0
                                                    text-xs
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    ${
                                                        project.published === true
                                                            ? "bg-green-500/10 text-green-400"
                                                            : "bg-yellow-500/10 text-yellow-400"
                                                    }
                                                `}
                                            >

                                                {project.published === true
                                                    ? "Published"
                                                    : "Draft"
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>

        </main>
    );
}