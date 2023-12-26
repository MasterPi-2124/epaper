import React from "react";
import Head from "next/head";

const Layout = (props) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      </Head>
      <div
        style={{
          height: "100%",
        }}
      >
        {props.children}
      </div>
    </>
  );
};
export default Layout;

