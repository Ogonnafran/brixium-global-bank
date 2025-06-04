
import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from './AdminLogin';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthorizedAdmin, isAdminLoading } = useAdminAuth();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

export default AdminRoute;
