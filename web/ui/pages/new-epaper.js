import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import NewClass from "@/components/new-class"
import Link from "next/link";

function NewClassPage() {
  return (
    <Layout pageTitle="New Class | Dashboard">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
            <Menu currentPath={"New Class"} />
            <div className="main-container">
              <NewClass />
            </div>
      </div>
    </Layout>
  );
}

export default NewClassPage;
