import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function IndexPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Notional Blog Submit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Submit a blog to <a href="https://notional.ventures">Notional!</a>
        </h1>

        <p className={styles.description}>
          Before getting started, please make sure that you have knowledge of
          Markdown Languague and read{" "}
          <Link href="/guide">this guide</Link> on how to write a
          blog.
        </p>
        <div className={styles.buttons}>
          <div className={styles.grid}>
            <Link href="/submit" className={styles.card}>
              <h2>Add a blog &rarr;</h2>
              <p>Just takes moment.</p>
            </Link>
          </div>

          <div className={styles.grid}>
            <Link href="/edit" className={styles.card}>
              <h2>Edit a blog &rarr;</h2>
              <p>Just takes moment.</p>
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          Built with Next.js | Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
