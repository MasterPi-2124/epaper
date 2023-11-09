import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import validToken from "@/services/validToken";

function Dashboard() {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN"))

  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (validToken(token)) {
      setToken(token);
    } else {
      setToken(null);
    }

  }, [token]);

  return (
    <Layout pageTitle="Dashboard | CNWeb">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
        {token ? (
          <>
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
    </Layout >
  );
}

export default Dashboard;
