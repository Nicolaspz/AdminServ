import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import PurchaseManager from "../../../components/purchases/PurchaseManager";
import Head from "next/head";

export default function Sales() {
  return (
    <>
      <Head>
            <title>ServeFixe - Compras</title>
      </Head>
      <Sidebar>
      <Header title="Compra" />
      <div className="container mx-auto mr-1.2 px-4 py-8 max-w-6xl text-slate-200">
        <PurchaseManager/> 
      </div>
    </Sidebar>
    </>
    
  )
}