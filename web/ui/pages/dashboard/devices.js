import Menu from "@/components/menu";
import Layout from "@/components/layout";
import { DeviceList } from "@/components/dashboard/devices";
import React from "react";

const DevicesDashboard = () => {
  return (
    <Layout pageTitle="Devices | Epaper">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"Dashboard"} />
        <div className="main-container">
          <DeviceList />
        </div>
      </div>
    </Layout>
  );
}

export default DevicesDashboard;
