import type { NextComponentType } from "next"
import Header from "./header"
import Link from "next/link"

// Import FontAwesomeIcon here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

const Layout: NextComponentType = ({children}) => {
  return (
    <div className="w-full bg-gray-200">
      <Header />
      <main>
        <div className="flex relative">
          <div className={`w-48 pt-4 text-white bg-gray-800 text-sm absolute md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out sidebar z-50`}>
            <nav className="px-4 py-2 md:hidden bg-gray-300 mb-2">
              <Link href="/">
                <a className="text-base no-underline hover:text-green-900 font-semibold flex items-center" style={{color: 'rgb(0, 128, 128)'}}><Image src="/logo.png" alt="logo" width={20} height={20} layout={'fixed'} />&ensp;Tivix</a>
              </Link>
            </nav>
            <nav className="px-4 cursor-pointer rounded transition duration-200 hover:bg-gray-600 py-2">
              <Link href="/">
                <a className="text-white flex items-center"><FontAwesomeIcon icon={faHome} style={{fontSize: '1.2rem', width: '1.2rem'}} />&ensp;Home</a>
              </Link>
            </nav>
          </div>
          <div className="flex-1 p-4 overflow-auto" id="main_div" style={{height: "calc(100vh - 4rem)"}}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout;