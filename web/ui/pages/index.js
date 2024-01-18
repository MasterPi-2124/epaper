import Image from 'next/image'
import Header from "@/components/header";
import Layout from '@/components/layout';
import Link from 'next/link';
import { projects } from '@/assets/data/projects';
import Abstract from "@/assets/imgs/abstract.jpg";
import Filter from "@/assets/imgs/filter.svg";
import Project from "@/assets/imgs/github-project.png";

export default function Home() {
  return (
    <Layout pageTitle="Home | Epaper">
      <Header currentPath={"Home"} />
      <main className="bg-[#111111] min-h-screen items-center justify-between homepage">
        <div className='heading'>

          <Image
            src={Abstract}
            alt="an abstract image"
            style={{
              position: "absolute",
              right: '0px',
              bottom: '0px',
              width: "90%",
              transform: "rotate(180deg)",
            }}
          />
          <h1>
            Manage your EPD devices in an easiest way ever
          </h1>
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </div>

        <div className='how-it-works anchor' id="how-it-works">
          <h1>How It Works</h1>
          <p>
            You can manage the data and EPD devices via Dashboard UI.
            The EPD device is connected to the server via MQTT protocol to receive display and other requests.
            <br />
            <br />
            All communication between users, devices and the server are encrypted and secured with TLS/SSL, protected the system from attacks.          </p>
        </div>
      </main>
    </Layout>
  );
}