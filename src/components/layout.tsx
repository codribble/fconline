import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="w-full max-w-7xl pt-[106px] px-[10px] mx-auto">
        <div className="col-end-13 col-span-10 w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
