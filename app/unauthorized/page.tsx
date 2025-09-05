"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#0b1220",
      padding: "20px"
    }}>
      <div style={{ 
        textAlign: "center", 
        maxWidth: 500, 
        background: "#0f172a", 
        padding: 40, 
        borderRadius: 12, 
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)", 
        border: "1px solid #1f2937" 
      }}>
        {/* Error Icon */}
        <div style={{ 
          width: 80, 
          height: 80, 
          background: "#dc2626", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 24px",
          fontSize: "32px"
        }}>
          ⚠️
        </div>

        <h1 style={{ 
          color: "#e5e7eb", 
          fontSize: 32, 
          marginBottom: 16, 
          fontWeight: 700 
        }}>
          Access Denied
        </h1>

        <p style={{ 
          color: "#9ca3af", 
          fontSize: 18, 
          marginBottom: 8,
          lineHeight: 1.6 
        }}>
          You don't have permission to access this page.
        </p>

        <p style={{ 
          color: "#6b7280", 
          fontSize: 14, 
          marginBottom: 32 
        }}>
          This could be due to insufficient privileges or an expired session.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link 
            href="/login"
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2563eb";
            }}
          >
            Go to Login
          </Link>

          <Link 
            href="/"
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "transparent",
              color: "#60a5fa",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "1px solid #374151"
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
            Go Home
          </Link>
        </div>

        {/* Auto redirect notice */}
        <p style={{ 
          color: "#6b7280", 
          fontSize: 12, 
          marginTop: 24,
          fontStyle: "italic"
        }}>
          You will be automatically redirected to login in 5 seconds...
        </p>
      </div>
    </div>
  );
}
