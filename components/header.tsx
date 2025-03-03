import React, { MouseEvent } from "react";
import type { NextComponentType } from "next";
import Link from "next/link";
import Image from "next/image";

// Import FontAwesomeIcon here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header: NextComponentType = (_) => {
  const toggleSideBar = (e: MouseEvent) => {
    e.preventDefault();
    let sidebar_div = document.querySelector(".sidebar");
    if (sidebar_div) {
      sidebar_div.classList.toggle("-translate-x-full");
    }
  };

  return (
    <header className="w-full shadow h-16">
      <div className="float-left h-full px-4 my-0 mx-auto flex items-center w-screen">
        <div className="float-left md:hidden">
          <FontAwesomeIcon
            icon={faBars}
            className="mr-2 w-6 text-2xl"
            onClick={(e) => toggleSideBar(e)}
          />
        </div>
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={30} height={30} />
        </Link>
        <div className="float-left hidden md:block">
          <Link
            href="/"
            className="text-base no-underline hover:text-green-900 font-semibold ml-2"
            style={{ color: "rgb(0, 128, 128)" }}
          >
            RAWG Games
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
