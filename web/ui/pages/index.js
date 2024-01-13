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
            When a new quiz is created, teacher&apos;s location will be included in the quiz,
            and it will also look for student&apos;s current location to check if that student is
            in a class or not.
            <br />
            <br />
            Quiz ID and teacher&apos;s location are protected by AES/GCM + SHA256 encryption algorithms and thus, making sure the location is identical for every students in the class.
          </p>
        </div>

        {/* <div className='project anchor' id="project">
          <h1>Project</h1>
          <p>
            We use NextJS and ExpressJS for the front-end and back-end code,
            which is hosted in Hetzner servers and proxied behind Nginx and Cloudflare.
          </p>
          <ParallaxBanner
            className='techs'
            layers={
              [
                {
                  children: (
                    <div className='techs'>
                      {projects.map((project, index) => (
                        <Link href={project.link} key={index}
                        >
                          <Image
                            alt="tech we used"
                            src={project.logo}
                            width={200}
                            height={200}
                          />
                        </Link>
                      )
                      )}
                    </div>
                  ),
                  // speed: -15,
                  translateX: [-40, 0],
                  shouldAlwaysCompleteAnimation: true,
                }
              ]
            }
            style={{
              height: "100px",
              marginTop: "30px",
            }}
          />
        </div>

        <div className='github anchor' id="github">
          <ParallaxBanner
            layers={
              [
                {
                  children: (
                    <div className='background'>
                      <Image
                        alt="a map"
                        src={Project}
                      />
                    </div>
                  ),
                  speed: -15,
                  shouldAlwaysCompleteAnimation: true,
                },
                {
                  children: (
                    <div className='background-filter'>
                    </div>
                  ),
                  opacity: [0, 1],
                  shouldAlwaysCompleteAnimation: true,

                },
                {
                  children: (
                    <div style={{
                      textAlign: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "300px"
                    }}>
                      <h1>Project Management</h1>
                      <p>
                        We take advantage of Github Project together with Backend and Frontend repositories to manage all issues and features right in Github. This improves the project&apos;s speed and helps the team focus and save time.
                      </p>
                      <div style={{ marginTop: "80px" }}>
                        <a className='item-dashboard' href="https://github.com/MasterPi-2124/epaper" style={{ padding: "40px 80px" }}>
                          Frontend
                        </a>
                        <a className='item-dashboard' href="https://github.com/MasterPi-2124/CNWeb30-Backend" style={{ padding: "40px 80px" }}>
                          Backend
                        </a>
                        <a className='item-dashboard' href="https://github.com/users/MasterPi-2124/projects/1" style={{ padding: "40px 80px" }}>
                          Project
                        </a>
                      </div>

                    </div>
                  ),
                  shouldAlwaysCompleteAnimation: true,

                }
              ]
            }
            style={{
              width: "100%",
              height: "100%",
              position: "relative"
            }}
          >
          </ParallaxBanner>
        </div> */}

      </main>
    </Layout>
  );
}