"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";

export default function TotpPage() {
    const router = useRouter();

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);

        setCode(newCode);
        setError("");

        // Move to next box
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const newCode = ["", "", "", "", "", ""];

        pasted.split("").forEach((digit, index) => {
            newCode[index] = digit;
        });

        setCode(newCode);

        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        const otp = code.join("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit code.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login/totp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        code: Number(otp),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Invalid verification code");
            }

            if (data.message === "Login successful") {
                router.push("/admin/dashboard");
                return;
            }

            throw new Error("Unexpected response from server");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center px-4">

            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="bg-[#101117] border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
                            <FaShieldAlt className="text-4xl text-purple-400" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Verify Code
                        </h1>

                        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                            Enter the 6-digit code from your
                            <br />
                            authenticator app.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="mt-8">

                        {/* OTP Inputs */}
                        <div
                            className="flex justify-center gap-2 sm:gap-3"
                            onPaste={handlePaste}
                        >
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, index)
                                    }
                                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-semibold bg-[#171922] border border-white/10 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition"
                                    aria-label={`Digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-7 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-medium transition"
                        >
                            {loading ? "Verifying..." : "VERIFY CODE"}
                        </button>

                    </form>

                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => router.push("/admin")}
                        className="mx-auto mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition"
                    >
                        <FaArrowLeft className="text-xs" />
                        Back to login
                    </button>

                </div>

            </div>

        </main>
    );
}