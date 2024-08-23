import React from 'react';
import SideBar from './SideBar';

function Dashboard({ setUserSignIn }) {
  document.title = 'PoetBot | Dashboard';

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Drawer Menu Icon at Top Left */}
      <div className="absolute top-0 left-0 p-4 ">
        <SideBar setUserSignIn={setUserSignIn}/>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      </div>
    </div>
  );
}

export default Dashboard;
