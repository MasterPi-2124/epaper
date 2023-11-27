import Menu from "@/components/dashboard/menu";
import Layout from "@/components/layout";
import { DeviceList } from "@/components/device-list";

function DevicesPage() {
  return (
    <Layout pageTitle="Devices | Dashboard">
      <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
            <Menu currentPath={"Devices"} />
            <div className="main-container">
                <DeviceList />
            </div>
      </div>
    </Layout>
  );
}

export default DevicesPage;
