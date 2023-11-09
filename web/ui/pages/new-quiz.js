import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import NewQuiz from "@/components/new-quiz"
import Link from "next/link";

function NewQuizPage() {
  return (
    <Layout pageTitle="New Quiz | Dashboard">
      <div className="dashboard dark:bg-[#212121] bg-[#e0e0e0] dark:text-white text-black h-screen bg-center bg-cover bg-no-repeat flex items-center">
        <Menu currentPath={"New Quiz"} />
        <div className="main-container">
          <NewQuiz />
        </div>
      </div>
    </Layout>
  );
}

export default NewQuizPage;