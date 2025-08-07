"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    const rememberMe = localStorage.getItem("rememberMe");

    if (token && rememberMe === "true") {
      // User is logged in and has "Remember Me" enabled
      router.push("/dashboard");
    } else {
      // User is not logged in or didn't check "Remember Me"
      router.push("/auth");
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Manrope, "Noto Sans", sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #374151',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '8px', color: '#6b7280' }}>Loading...</p>
      </div>
    </div>
  );
}