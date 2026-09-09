"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaPlus,
    FaTimes,
    FaGithub,
    FaExternalLinkAlt,
} from "react-icons/fa";

const emptyForm = {
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
};

export default function ProjectsPage() {
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/projects",
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
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Open add form
    const handleAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            projectUrl: project.projectUrl,
            githubUrl: project.githubUrl,
        });

        setEditingId(project.id);
        setError("");
        setShowForm(true);
    };

    // Close form
    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setError("");
    };

    // Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const url = editingId
                ? `http://localhost:8080/api/projects/${editingId}`
                : "http://localhost:8080/api/projects";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error(
                    editingId
                        ? "Failed to update project"
                        : "Failed to create project"
                );
            }

            await fetchProjects();
            closeForm();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/projects/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            await fetchProjects();

        } catch (error) {
            window.alert(error.message);
        }
    };

    return (
        <main className="min-h-screen bg-[#08090d] text-white">

            {/* Header */}
            <header className="border-b border-white/10 bg-[#101117]">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
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
                                Projects
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage your portfolio projects
                            </p>
                        </div>

                        <button
                            onClick={handleAdd}
                            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition rounded-xl px-5 py-3 text-sm font-medium"
                        >
                            <FaPlus className="text-xs" />
                            Add Project
                        </button>

                    </div>

                </div>
            </header>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (

                    <div className="text-center py-20 bg-[#101117] border border-white/10 rounded-2xl">
                        <p className="text-gray-400">
                            No projects found.
                        </p>

                        <button
                            onClick={handleAdd}
                            className="mt-5 text-sm text-purple-400 hover:text-purple-300"
                        >
                            Add your first project
                        </button>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {projects.map((project) => (

                            <div
                                key={project.id}
                                className="bg-[#101117] border border-white/10 rounded-2xl overflow-hidden"
                            >

                                {/* Image */}
                                <div className="h-48 bg-[#171922] overflow-hidden">

                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-600">
                                            No image
                                        </div>
                                    )}

                                </div>

                                {/* Content */}
                                <div className="p-5">

                                    <h2 className="font-semibold text-lg">
                                        {project.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Links */}
                                    <div className="flex items-center gap-4 mt-5">

                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition"
                                                title="GitHub"
                                            >
                                                <FaGithub />
                                            </a>
                                        )}

                                        {project.projectUrl && (
                                            <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition"
                                                title="Live project"
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        )}

                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-5 pt-5 border-t border-white/10">

                                        <button
                                            onClick={() =>
                                                handleEdit(project)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 py-2.5 text-sm transition"
                                        >
                                            <FaEdit className="text-xs" />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(project.id)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 text-sm transition"
                                        >
                                            <FaTrash className="text-xs" />
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* Add / Edit Modal */}
            {showForm && (

                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto">

                    <div className="w-full max-w-2xl bg-[#101117] border border-white/10 rounded-2xl shadow-2xl my-auto">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingId
                                        ? "Edit Project"
                                        : "Add Project"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {editingId
                                        ? "Update project details"
                                        : "Add a new project to your portfolio"}
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                className="text-gray-500 hover:text-white transition"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-5"
                        >

                            {/* Title */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Project Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="My Portfolio"
                                    className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Describe your project..."
                                    className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition resize-none"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://..."
                                    className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition"
                                />
                            </div>

                            {/* Project URL */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Project URL
                                </label>

                                <input
                                    type="url"
                                    name="projectUrl"
                                    value={form.projectUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://..."
                                    className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition"
                                />
                            </div>

                            {/* GitHub URL */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    GitHub URL
                                </label>

                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://github.com/..."
                                    className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 py-3 text-sm transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-medium transition"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Project"
                                            : "Create Project"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    );
}