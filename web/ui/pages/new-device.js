import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import NewDevice from "@/components/new-device"

function NewDevicePage() {
  return (
    <Layout pageTitle="New Device | Dashboard">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
            <Menu currentPath={"New Device"} />
            <div className="main-container">
              <NewDevice />
            </div>
      </div>
    </Layout>
  );
}

export default NewDevicePage;
