import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import pages...

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* ... other public pages ... */}

      {/* User Routes */}
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      {/* ... other user pages ... */}

      {/* Marketplace, AI, Content */}
      {/* ... */}

      {/* Wallet */}
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route path="/earnings" element={<Earnings />} />

      {/* Business */}
      <Route path="/business" element={<BusinessDashboard />} />
      {/* ... */}

      {/* Admin Routes with Role Check */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute element={<AdminDashboard />} roles={["admin"]} />
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute element={<Reports />} roles={["admin"]} />
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <ProtectedRoute element={<VerificationRequests />} roles={["admin"]} />
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute element={<PlatformAnalytics />} roles={["admin"]} />
        }
      />

      {/* Communities */}
      <Route path="/communities" element={<Communities />} />
      <Route path="/community/:id" element={<CommunityDetails />} />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">404 | Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;