"use client";
import { FormEvent, useState } from "react";
import { useLoginMutation } from "../../src/Redux/features/auth/authApi";
import { useAppDispatch } from "../../src/Redux/hook";
import { setUser } from "../../src/Redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("jihad@gamil.com");
  const [password, setPassword] = useState("123456");


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      if (res?.success && res?.data?.accessToken) {

        dispatch(
          setUser({
            user: res.data.user,
            token: res.data.accessToken,
          })
        );
        
        // Set refresh token cookie manually if backend doesn't set it
        if (res?.data?.refreshToken) {
          document.cookie = `refreshToken=${res.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        }
        
        toast.success(res.message || "Login successful!");

        // ✅ Success toast

        // role অনুযায়ী redirect
        const userRole = res.data.user?.role;

        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "student") {
          router.push("/dashboard/student");
        } else if (userRole === "super-admin") {
          router.push("/dashboard/super-admin");
        }
      } else {
        // ✅ Fallback (unexpected response)
        toast.error(res?.message || "Invalid login response!");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
    }
  };


  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1220" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420, background: "#0f172a", padding: 24, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", border: "1px solid #1f2937" }}>
        <h1 style={{ color: "#e5e7eb", fontSize: 28, marginBottom: 8, fontWeight: 600 }}>Welcome back</h1>
        <p style={{ color: "#9ca3af", marginBottom: 20 }}>Sign in to your account</p>

        <label style={{ display: "block", color: "#cbd5e1", fontSize: 14, marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#111827", color: "#e5e7eb", border: "1px solid #374151", outline: "none", marginBottom: 14 }}
        />

        <label style={{ display: "block", color: "#cbd5e1", fontSize: 14, marginBottom: 6 }}>Password</label>
        <input
          type="password"

          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#111827", color: "#e5e7eb", border: "1px solid #374151", outline: "none", marginBottom: 18 }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: isLoading ? "#1f2937" : "#2563eb", color: "white", fontWeight: 600, border: "none", cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* Create Account Section */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #374151" }}>
          <p style={{ color: "#9ca3af", textAlign: "center", marginBottom: 16, fontSize: 14 }}>
            Don't have an account yet?
          </p>
          <Link 
            href="/register"
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              background: "transparent",
              color: "#60a5fa",
              fontWeight: 600,
              border: "1px solid #374151",
              textAlign: "center",
              textDecoration: "none",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1f2937";
              e.currentTarget.style.borderColor = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#374151";
            }}
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

