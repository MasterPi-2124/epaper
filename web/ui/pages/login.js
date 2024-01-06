import LogInForm from "@/components/auth/log-in";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import validToken from "@/services/validToken";
import { useRouter } from 'next/router';

function LoginPage() {
  const router = useRouter();
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN"));

  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (validToken(token)) {
      setToken(token);
      router.push('/dashboard');
    } else {
      setToken(null);
    }

  }, [token]);

  return (
    <Layout pageTitle="Log In | CNWeb">
      {!token ? (
        <div className="log-in bg-background-abstract h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center">
          <LogInForm />
        </div>
      ) : (<></>)}
    </Layout>
  );
}

export default LoginPage;
