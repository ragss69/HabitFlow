// src/components/DashboardSummary.tsx
import React from "react";

// Define the props for reusability and type safety
interface DashboardSummaryProps {
  userName: string;
  completed: number;
  total: number;
  percent: number; // e.g., 60 for 60%
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName,
  completed,
  total,
  percent,
}) => (
  <section>
    {/* Welcome and Dashboard title */}
    <div className="flex flex-wrap justify-between gap-3 p-4">
      <div className="flex min-w-72 flex-col gap-3">
        <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">
          Dashboard
        </p>
        <p className="text-[#49739c] text-sm font-normal leading-normal">
          Welcome back, {userName}
        </p>
      </div>
    </div>
    {/* Today section */}
    <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
      Today
    </h2>
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-6 justify-between">
        <p className="text-[#0d141c] text-base font-medium leading-normal">
          Daily Goal
        </p>
        <p className="text-[#0d141c] text-sm font-normal leading-normal">
          {percent}%
        </p>
      </div>
      {/* Progress bar */}
      <div className="rounded bg-[#cedbe8]">
        <div
          className="h-2 rounded bg-[#0c7ff2]"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-[#49739c] text-sm font-normal leading-normal">
        {completed}/{total} completed
      </p>
    </div>
  </section>
);

export default DashboardSummary;
