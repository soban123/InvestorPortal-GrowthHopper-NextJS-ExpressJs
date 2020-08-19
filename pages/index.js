import React from 'react'
import Head from 'next/head'

export default function index() {
    return (
        <>
            <Head>
                <title> Home Page </title>                
            </Head>
            <div  className="d-flex justify-content-around align-items-center" >
                <h1 className="text-center" >
                    Home Page
                </h1>
            
                <a  href="/login"> <h2> Login  </h2> </a>
                
            </div>
         
        </>
    )
}
