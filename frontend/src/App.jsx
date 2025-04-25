import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [somedata,setSomeData]= useState([])

  useEffect(()=>{
    axios.get("/api/somedata")
    .then((response)=>(
      setSomeData(response.data)
    ))
    .catch((error)=>{
      throw error
    })
  },[])

  return (
    <>
    <h1>Here is the some data</h1>
      <h2>{somedata.length}</h2>
      <div>
        
        {
          somedata.map((value,index)=>(
            <div key={index}>
              <h3>{value.color}</h3>
              <h4>{value.value}</h4>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
