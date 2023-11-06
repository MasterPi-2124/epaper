import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function IndexPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>E-paper Management UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>Manage all your epaper in a web!</a>
        </h1>

        <p className={styles.description}>
          Before getting started, please make sure that you have knowledge of
          epaper and read{" "}
          <Link href="/guide">this guide</Link> on how to manage things.
        </p>
        <div className={styles.buttons}>
          <div className={styles.grid}>
            <Link href="/submit" className={styles.card}>
              <h2>Add an user &rarr;</h2>
              <p>Just takes moment</p>
            </Link>
          </div>

          <div className={styles.grid}>
            <Link href="/edit" className={styles.card}>
              <h2>Dashboard &rarr;</h2>
              <p>Just takes moment.</p>
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          Built with {"<3"} from ABC | Powered by{" "}me
        </a>
      </footer>
    </div>
  );
}
