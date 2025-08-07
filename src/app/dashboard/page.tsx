"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import AddGoalModal, { GoalFormData } from "../../components/AddGoalModal";

// Mock Goal type
interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and fetch user info
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      });
    // Simulate API call for goals
    const timer = setTimeout(() => {
      setGoals([]); // Empty state for demo
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    window.location.href = "/auth";
  };

  const handleAddGoal = async (goalData: GoalFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals(prev => [...prev, newGoal]);
        setIsModalOpen(false);
        console.log("Goal created successfully:", newGoal);
      } else {
        console.error("Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        fontSize: '30px',
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
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
          <p style={{ marginTop: '8px', color: '#6b7280' }}>Loading your goals...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!goals || goals.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Manrope, "Noto Sans", sans-serif'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          padding: '10px 28px',
          backgroundColor: 'white'
        }}>
          {/* Logo section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '28px', height: '28px', color: '#111827' }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
              </svg>
            </div> 
            <h2 style={{ 
              color: '#111827', 
              fontSize: '28px', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              Goalify
            </h2>
          </div>

          {/* Navigation - Desktop only */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px',
          }}>
            {/* Navigation links */}
            <nav style={{ 
              display: 'flex', 
              gap: '32px',
            }}>
              <a href="/dashboard" style={{ 
                color: '#111827', 
                textDecoration: 'bold', 
                fontSize: '15px', 
                fontWeight: '500' 
              }}>Dashboard</a>
              <a href="#" style={{ 
                color: '#111827', 
                textDecoration: 'none', 
                fontSize: '15px', 
                fontWeight: '500' 
              }}>Journal</a>
            </nav>

            {/* Right side icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: '40px', right: 0, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px', zIndex: 10 }}>
                    <div style={{ padding: '10px 20px', cursor: 'pointer' }}>Profile</div>
                    <div style={{ padding: '10px 20px', cursor: 'pointer', color: '#ef4444' }} onClick={handleLogout}>Log Out</div>
                  </div>
                )}
              </button>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                R
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
          minHeight: 'calc(100vh - 80px)',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            maxWidth: '600px',
            padding: '20px'
          }}>

            {/* Image Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <img
                src="/SetGoals.png"
                alt="Set Goals"
                style={{
                  width: '280px',
                  height: 'auto',
                  borderRadius: '12px'
                }}
              />
            </div>

            {/* Welcome Text */}
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 12px 0',
                paddingTop: '0.5px'
              }}>
                Welcome to Goalify!
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#101518',
                lineHeight: '1.5',
                width: '590px',
                margin: '0.5 0 0 0'
              }}>
                It looks like you haven't set up any goals or habits yet. Let's get started on your journey to success! Click the button below to add your first goal.
              </p>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: '#eaedf1',
                color: '#101518',
                marginTop: '26px',
                border: 'none',
                borderRadius: '20px',
                padding: '15px 25px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Add Your First Goal
            </button>
          </div>
        </main>

        {/* Add Goal Modal */}
        <AddGoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddGoal}
        />
      </div>
    );
  }

  // Dashboard with goals - This will be implemented later
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '18px' }}>You have goals! (Replace this with your dashboard UI)</p>
      </div>
    </div>
  );
}