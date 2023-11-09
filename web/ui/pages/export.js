import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import Export from "@/components/export"
import Cookies from "universal-cookie";
import Link from "next/link";
import validToken from "@/services/validToken";

function ExportPage() {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN"));

  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (validToken(token)) {
      setToken(token);
    } else {
      setToken(null);
    }

  }, [token]);

  return (
    <Layout pageTitle="Export | Dashboard">
      <div className="dashboard dark:bg-[#212121] bg-[#e0e0e0] dark:text-white text-black h-screen bg-center bg-cover bg-no-repeat flex items-center">
        {token ? (
          <>
            <Menu currentPath={"Export"} />
            <div className="main-container">
                <Export />
            </div>
          </>
        ) : (
          <div className="main-container">
            <div className="content">
              <p>You are not logged in. Please log in to continue.</p>
              <button className="ok mt-5">
                <Link href="/login">Log In</Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ExportPage;
