import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from '../component/AdminSidebar';
import AdminHeader from '../component/AdminHeader';
import { useState } from 'react';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className="w-100"
        style={{ marginLeft: collapsed ? '80px' : '300px', transition: 'margin-left 0.3s ease' }}
      >
        <AdminHeader />
        <main className="container-fluid px-5 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
