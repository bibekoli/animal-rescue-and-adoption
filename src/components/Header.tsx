"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import { checkIfUserIsAdmin } from "@/functions/functions";

export default function Header() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setStatus("authenticated");
        setUser(session.user);
      } else {
        setStatus("unauthenticated");
      }
    });
  }, []);

  const navigation = [
    {
      title: "Home",
      path: "/",
      icon: "ic:baseline-home",
    },
    {
      title: "For Rescue",
      path: "/discover/rescue",
      icon: "fluent:animal-dog-20-filled",
    },
    {
      title: "For Adoption",
      path: "/discover/adoption",
      icon: "fluent:animal-cat-20-filled",
    },
    {
      title: "Rescue Centers",
      path: "/discover/rescue-centers",
      icon: "ic:baseline-house",
    },
  ];

  return (
    <div className="shadow fixed top-0 left-0 right-0 z-[100]">
      <div className="navbar bg-base-100 max-w-screen-xl mx-auto">
        <div className="navbar-start lg:hidden">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content font-medium z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48"
            >
              {navigation.map((item, index) => {
                return (
                  <li key={index}>
                    <Link href={item.path}>
                      <Icon icon={item.icon} width={25} height={25} />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li className={`${!(status === "authenticated") || !checkIfUserIsAdmin(user) ? "hidden" : ""}`}>
                <Link href="/reports">
                  <Icon icon="carbon:report-data" width={25} height={25} />
                  Report
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-start hidden cursor-pointer lg:flex">
          <Logo />
        </div>
        <div className="navbar-center lg:hidden cursor-pointer">
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex space-x-4">
          {navigation.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.path}
                className="text-gray-700 font-medium flex items-center space-x-4 hover:bg-gray-100 px-4 py-1 rounded-md"
              >
                {item.title}
              </Link>
            );
          })}
          <Link
            href="/reports"
            className={`text-gray-700 font-medium flex items-center space-x-4 hover:bg-gray-100 px-4 py-1 rounded-md ${!(status === "authenticated") || !checkIfUserIsAdmin(user) ? "hidden" : ""}`}
          >
            Report
          </Link>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-hover dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              {status === "authenticated" && (
                <Image
                  src={user.image}
                  width={35}
                  height={35}
                  alt={user.name}
                  className="rounded-full shadow-md"
                />
              )}
              {status === "loading" && (
                <Icon
                  icon="la:spinner"
                  className="animate-spin"
                  width={30}
                  height={30}
                />
              )}
              {status === "unauthenticated" && (
                <Icon
                  icon="teenyicons:user-circle-solid"
                  width={35}
                  height={35}
                />
              )}
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content font-medium z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
            >
              {status === "authenticated" && (
                <>
                  <li>
                    <Link href={`/my-postings`}>
                      <Image
                        src={user.image}
                        width={25}
                        height={25}
                        alt={user.name}
                        className="rounded-full shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = "/next.svg";
                        }}
                      />
                      My Postings
                    </Link>
                  </li>
                  <li>
                    <Link href="/new/rescue">
                      <Icon icon="gala:add" width={25} height={25} />
                      Post For Rescue
                    </Link>
                  </li>
                  <li>
                    <Link href="/new/adoption">
                      <Icon icon="gala:add" width={25} height={25} />
                      Post For Adoption
                    </Link>
                  </li>
                  <li>
                    <Link href="/new/rescue-center">
                      <Icon icon="gala:add" width={25} height={25} />
                      Add Rescue Center
                    </Link>
                  </li>
                  <li>
                    <p onClick={() => signOut()}>
                      <Icon
                        icon="material-symbols:logout-rounded"
                        width={25}
                        height={25}
                      />
                      Logout
                    </p>
                  </li>
                </>
              )}
              {status === "loading" && (
                <li>
                  <Icon
                    icon="la:spinner"
                    className="animate-spin"
                    width={25}
                    height={25}
                  />
                  Loading
                </li>
              )}
              {status === "unauthenticated" && (
                <li>
                  <Link href="/auth/login">
                    <Icon icon="ic:round-login" width={25} height={25} />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
