import Menu from "@/components/menu";
import Layout from "@/components/layout";
import Link from "next/link";
import React from "react";

function Dashboard() {
  return (
    <Layout pageTitle="Dashboard | Epaper">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"Dashboard"} />
        <div className="main-container">
          <div className="content">
            <Link href="/dashboard/users">
              <div className="item-dashboard">
                Users Dashboard
              </div>
            </Link>
            <Link href="/dashboard/devices">
              <div className="item-dashboard">
                Devices Dashboard
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout >
  );
}

export default Dashboard;
