import Menu from "@/components/menu";
import Layout from "@/components/layout";
import { DeviceList } from "@/components/dashboard/devices";
import React, { useState, useEffect } from "react";
import validToken from "@/services/validToken"
import Cookies from "universal-cookie";
import Link from "next/link";

const DevicesDashboard = () => {
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
    <Layout pageTitle="Devices | Epaper">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        {token ? (
          <>
            <Menu currentPath={"Dashboard"} />
            <div className="main-container">
              <DeviceList />
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

export default DevicesDashboard;
