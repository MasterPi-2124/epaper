import Menu from "@/components/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import Export from "@/components/export"
import Link from "next/link";

function ExportPage() {
  return (
    <Layout pageTitle="Export | Epaper">
      <div className="dashboard dark:bg-[#212121] bg-[#e0e0e0] dark:text-white text-black h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"Export"} />
        <div className="main-container">
          <Export />
        </div>
      </div>
    </Layout>
  );
}

export default ExportPage;
