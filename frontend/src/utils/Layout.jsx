import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from "../components/Sidebar"
import Footer from '../components/Footer'

function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout