import React from 'react';
import Navbar from './Navbar';
import LeftPanel from './Sidebar';
import RightPanel from './RightPanel';

function Layout({ children, onToggleSidebar }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleSidebar={onToggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        <RightPanel />
      </div>
    </div>
  );
}
export default Layout;