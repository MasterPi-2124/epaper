import RegisterForm from "@/components/auth/register";
import Layout from "@/components/layout";
import React from "react";

function RegisterPage() {
  return (
    <Layout pageTitle="Register | CNWeb">
      <div className="log-in bg-background-abstract h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center">
        <RegisterForm />
      </div>
    </Layout>
  );
}

export default RegisterPage;
