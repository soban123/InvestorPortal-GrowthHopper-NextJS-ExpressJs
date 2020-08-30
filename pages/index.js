import React from 'react';
import Head from 'next/head';
import Login from './login';
export default function index() {
  return (
    <div>
      <Head>
        <title> Home Page </title>
      </Head>
      <Login />
    </div>
  );
}
