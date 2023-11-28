import Menu from "@/components/menu";
import Layout from "@/components/layout";
import { UserList } from "@/components/dashboard/users";
import React from "react";

const DevicesDashboard = () => {
  return (
    <Layout pageTitle="Users | Epaper">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"Dashboard"} />
        <div className="main-container">
          <UserList />
        </div>
      </div>
    </Layout>
  );
}

export default DevicesDashboard;
