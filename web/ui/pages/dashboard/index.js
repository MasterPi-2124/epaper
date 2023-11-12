import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Dashboard() {
  return (
    <Layout pageTitle="Dashboard | CNWeb">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"Dashboard"} />
        <div className="main-container">
          <div className="content">
            <Link href="/dashboard/quizzes">
              <div className="item-dashboard">
                Quiz Dashboard
              </div>
            </Link>
            <Link href="/dashboard/classes">
              <div className="item-dashboard">
                Class Dashboard
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout >
  );
}

export default Dashboard;
