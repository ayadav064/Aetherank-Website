import { useState } from "react";
import { useLocation } from "wouter";
import { adminLogin, setToken } from "@/lib/cmsApi";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await adminLogin(password);
      setToken(token);
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Check your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] flex flex-col items-center justify-center px-4">
      {/* Logo / site name */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-4 shadow-md">
          <span className="text-slate-950 font-black text-2xl">A</span>
        </div>
        <h1 className="text-[#1d2327] text-xl font-bold">Aetherank CMS</h1>
      </div>

      {/* Login card */}
      <div className="w-full max-w-[320px] bg-white border border-[#c3c4c7] rounded shadow-sm p-6">
        {error && (
          <div className="bg-[#fcf0e1] border border-[#f0c33c] text-[#8a6116] text-sm px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#1d2327] text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 pr-9 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a7aaad] hover:text-[#1d2327] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-60 text-white font-medium rounded py-2 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>

      <p className="text-[#646970] text-xs mt-6">
        ← <a href="/" className="text-[#2271b1] hover:text-[#135e96] hover:underline">Back to Website</a>
      </p>
    </div>
  );
}
