// ui/app/dashboard/page.tsx (Server Component)
import { Suspense } from "react";
import CompanyDashboard from "@/components/CompanyDashboard";

// Loading component for Suspense fallback
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        {/* Navbar skeleton */}
        <div className="bg-white border-b border-gray-200 h-16"></div>

        {/* Search section skeleton */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl h-16 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg h-20 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg h-48 shadow-sm border"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <CompanyDashboard />
    </Suspense>
  );
}
