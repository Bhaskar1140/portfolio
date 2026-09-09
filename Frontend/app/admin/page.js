"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidHide, BiShowAlt } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid username or Password");
      }
      if (data.message == "TOTP required") {
        router.push("/admin/totp");
        return;
      }
      throw new Error("Unexpected Response from server");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#08090d] min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-purple-600/20 inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-purple-500/30 mb-5">
            <span className="text-2xl">◆</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#101117] border border-white/10 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* username */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Username :
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition focus:border-purple-500"
              />
            </div>
            {/* password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password :
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#171922] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <BiSolidHide /> : <BiShowAlt />}
                </button>
              </div>
            </div>
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-medium transition"
            >
              {loading ? "Signing in.." : "Login"}
            </button>
          </form>
          {/* Forgot password */}
          <div>
            <button
              type="button"
              onClick={() => {
                router.push("/admin/forgot-password");
              }}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              Forgot Password ?
            </button>
          </div>

          {/* Back to Portfolio */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-white transition flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Back to portfolio
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
