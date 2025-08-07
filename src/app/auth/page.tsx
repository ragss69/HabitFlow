"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// This is a complete, self-contained React app.
export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Add name state
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize the Next.js router
  const router = useRouter();

  // Your custom handleSubmit function, integrated into the UI
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const body = isLogin ? { email, password, rememberMe } : { email, password, name, rememberMe };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and rememberMe preference in localStorage
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        // Use the router to navigate to the dashboard
        router.push("/dashboard");
      } else {
        // Handle authentication errors
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      // Handle network or other errors
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Manrope, "Noto Sans", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* Your custom header, placed at the top */}
      <header style={{
        display: 'flex',
        alignItems: 'center',

        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb',
        padding: '8px 20px',
        backgroundColor: 'white'
      }}>
        {/* Logo section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', color: '#111827' }}>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 style={{
            color: '#111827',
            fontSize: '32px', // Corrected px spacing
            fontWeight: 'bold',
            margin: 0
          }}>
            Goalify
          </h2>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Note: The "Get Started" button is now a functional link based on login state */}
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '16px 23px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/dashboard')} // Example of a functional button
          >
            Get Started
          </button>
        </div>
      </header>

      {/* The two-panel content area */}
      <div style={{
        display: 'flex',
        flex: 1,
        padding: '40px'
      }}>
        
        {/* Left Panel - Form */}
        <div style={{
          flex: 1,
          maxWidth: '580px',
          marginLeft: '60px',
          marginRight: '40px',
          marginTop: '60px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box'
        }}>
          {/* The form header is now inside the form panel */}
          <h1 style={{
            fontSize: '39px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>

          {/* Error message display */}
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  marginLeft: '4px',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: '#e2e8f0',
                    fontSize: '16px',
                    color: '#1e293b',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                marginLeft: '4px',
                fontSize: '18px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#e2e8f0',
                  fontSize: '16px',
                  color: '#1e293b',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#e2e8f0',
                  fontSize: '16px',
                  color: '#1e293b',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {isLogin && (
              <>
                {/* Remember Me and Forgot Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    color: '#374151',
                    cursor: 'pointer'
                  }}>
                    Remember me
                    <input
                      type="checkbox"
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#664EAE'
                      }}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </label>
                  <p style={{
                    color: '#6366f1',
                    fontSize: '15px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    margin: '0'
                  }}>
                    Forgot password?
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '30px'
              }}
            >
              {loading ? "Loading..." : (isLogin ? "Login" : "Sign Up")}
            </button>
            
            {/* Toggle Login/Signup */}
            <p
              style={{
                textAlign: 'center',
                color: '#6366f1',
                fontSize: '17px',
                textDecoration: 'underline',
                cursor: 'pointer',
                margin: '8px 0 0 0'
              }}
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </p>
          </form>
        </div>

        {/* Right Panel - Image */}
        <div style={{
          flex: 1,
          maxWidth: '600px',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWaxGhg5F_sQ4iTDa48q5pWXlVsyEYYwln7O9yL1EELKLQKKYtNm3uVRcq2nEKxLZ9m1q2HLfAT-SvZkhYABU4Qj-VhzYicaRrJVipcvCTX6QYzo7NofUt-ZuF3nKtEdDMVeD96IWQQk1rar6CGVQRWrDW-YyEx457r-qcF_1Oh_PHQNO46f86vdXxCP5ObiZEFIe9guNZx7PCNPaC_CKU7HzNLJPRjPgQD3_f2txbSC3rtalP_uTQ4OlilV4ZBwZfmCa_dUkpTfc")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
          </div>
        </div>
      </div>
    </div>
  );
}
