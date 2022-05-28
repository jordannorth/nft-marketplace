import "../styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="Description" content="NFT marketplace by JN" />
        {/* <link rel="icon" src="/..public/assets/duck-logo.png" />  */}
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
