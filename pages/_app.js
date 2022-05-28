import "../styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        {/* <meta name="Description" content="NFT marketplace by JN" />
        <link rel="icon" src="/..public/assets/duck-logo.png" /> */}
      </Head>
      <Navbar />

      <nav className="border-b p-6">
        <img src="../img/duck-logo.png" />
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">Sell Digital Asset</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">My Digital Assets</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">Creator Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
