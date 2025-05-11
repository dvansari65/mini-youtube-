import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import  Sidebar from "../components/Sidebar"
import Footer from '../components/Footer'
function Layout() {
  return (
    <div className="h-screen flex flex-col " >
        <Header/>
        <div className="flex flex-1 overflow-hidden">
        <Sidebar/>
            <main  className="flex-1 h-screen flex items-center justify-center   overflow-y-auto p-4 bg-gray-100">
                <Outlet/>
            </main>
            
        </div>
        <Footer/>
    </div>
  )
}

export default Layout