import React, { useContext, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";

export default function Dasnboard() {
  const { user } = useContext(AuthContext);
   useEffect(() => {
      console.log(user);
      // Verificação mais robusta do user
      
    }, [user]);
  
  return (
  <Sidebar>
      <Header />
      <div className="container mx-auto mr-1.2 px-4 py-8 max-w-6xl">
        <h1>Dasboard</h1>
      </div>
  </Sidebar>
  )

}