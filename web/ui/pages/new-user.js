import Menu from "@/components/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import NewUser from "@/components/new-user"
import Link from "next/link";

function NewUserPage() {
  return (
    <Layout pageTitle="New User | Dashboard">
      <div className="dashboard dark:bg-[#212121] bg-[#e0e0e0] dark:text-white text-black h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"New User"} />
        <div className="main-container">
          <NewUser />
        </div>
      </div>
    </Layout>
  );
}

export default NewUserPage;