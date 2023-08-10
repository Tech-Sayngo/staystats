"use client";
import Link from "next/link";
import React, { useDeferredValue, useEffect } from "react";
import { useState } from "react";
import { FaHome, FaRocket, FaBars } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiMailFill, RiSettings5Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { FaRegCircle, FaRegDotCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { fetchOwner } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  let router = useRouter();
  const [owner, setOwner] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(isSidebarOpen);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);
      if (user && user._id) {
        setOwner(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        router.replace("/login");
      }
    };
    updateUser();
  }, []);


  useEffect(() => {
    setIsNavOpen(isSidebarOpen);
  }, [isSidebarOpen]);


  const navHoverEffectEnter = () => {
    if(isSidebarOpen){

      return;
    }
    setHover(true);
  };

  const navHoverEffectOut = () => {
    setHover(false)
  };

  return (
      <header
          className={`lg:block h-screen text-slate-700 max-w-[300px] z-50 ${
              isSidebarOpen ? "md:fixed sm:fixed lg:block" : "hidden"
          }`}
      >
        {isSidebarOpen && (
            <div
                className="fixed lg:hidden inset-0 bg-black opacity-50 z-40"
                onClick={toggleSidebar}
            />
        )}
        <nav
            onMouseEnter={navHoverEffectEnter}
            onMouseLeave={navHoverEffectOut}
            className={`fixed w-auto h-screen dark:bg-blue-950 bg-slate-100 z-50 ${
                !isNavOpen && !hover
                    ? "hover:w-[250px] transition-width ease-in-out duration-300 hover:shadow-xl"
                    : "min-w-[250px] hover:shadow-lg"
            }`}>
          <div className="w-full flex items-center justify-between my-4 p-4 gap-2 font-semibold h-16 text-blue-500 ">

            <div className="flex gap-2 items-center justify-center">

              <Image src="/assets/sayngo.png" width={30} height={20} alt=""></Image>

              <span className={`${!isNavOpen && !hover && "hidden"} text-xl font-bold`}>SAYNGO</span>
            </div>
            <span
                className={`${!isNavOpen && !hover && "hidden"} cursor-pointer`}
                onClick={() => {
                  // console.log("toggle sidebar");
                  // console.log("navopen hai kya?", isNavOpen)
                  toggleSidebar();
                }}
            >
            {/* {isNavOpen && (<FaRegDotCircle size={20} />)}
            {!isNavOpen && (<FaRegCircle size={20} />)} */}
              {/* { (isSidebarOpen && !isNavOpen) ? <FaRegDotCircle size={20} /> : <FaRegCircle size={20} /> } */}
              <FaRegDotCircle size={20} />
          </span>
          </div>
          <div className="flex flex-col items-center justify-between h-screen w-full">
            <ul className=" w-full px-2 flex flex-col gap-4 font-semibold">
              <Link href="/">
                <li
                    className={`${accountType === "SUBADMIN" && 'hidden'} flex items-center justify-start gap-2 p-2 hover:cursor-pointer  ${
                        pathname === "/"
                            ? "bg-slate-300 text-primary hover:none"
                            : "hover:bg-slate-300"
                    } rounded-xl`}
                >
                  <MdDashboard size={20} />{" "}
                  <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                    Dashboard
                  </p>
                </li>
              </Link>
              <Link href="/users">
                <li

                    className={`${accountType === "SUBADMIN" && 'hidden'} flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                        pathname === "/users"
                            ? "bg-slate-300 text-primary"
                            : "hover:bg-slate-300"
                    } rounded-xl`}
                >
                  <HiUserGroup size={20} />{" "}
                  <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                    Users
                  </p>
                </li>
              </Link>
              <Link href="/hotels">
                <li

                    className={`${accountType === "SUBADMIN" && 'hidden'} flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                        pathname === "/hotels"
                            ? "bg-slate-300 text-primary"
                            : "hover:bg-slate-300"
                    } rounded-xl`}
                >
                  <FaHome size={20} />{" "}
                  <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                    Hotels
                  </p>
                </li>
              </Link>
              <Link href="/bookings">
                <li

                    className={`flex text-center items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                        pathname === "/bookings"
                            ? "bg-slate-300 text-primary"
                            : "hover:bg-slate-300"
                    } rounded-xl`}
                >
                  <RiMailFill size={20} />{" "}
                  <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                    Bookings
                  </p>
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </header>
  );
};

export default Sidebar;