import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Topnav from '../Components/topnav';
import FooterContent from '../Components/footercontents';
import Router from 'next/router';
import Head from 'next/head';

export default function layout(props) {
  let [userData, setuserData] = useState({ role: '' });
  let [sidebarToggle, setSidebarToggle] = useState(false);

  useEffect(() => {
    console.log('admin');
    const isLogin = localStorage.getItem('login');
    console.log('islOgin', isLogin);
    if (isLogin !== 'true') {
      Router.push('/login');
    }

    const user = localStorage.getItem('userData');
    if (user) {
      var { role } = JSON.parse(user);
    }
    console.log('role', role);
    if (isLogin == 'true' && role !== 'admin') {
      Router.push('/userpanel');
    }
    const userDataFromLocal = localStorage.getItem('userData');
    if (userDataFromLocal) setuserData(JSON.parse(userDataFromLocal));
  }, []);

  return (
    <>
        <Head>
        <title>Investor Portal | GrowthHopper</title>

        <script src={'/static/custom.js'}></script>
        <script src={'/build/js/custom.min.js'}></script>
      </Head>
      <div id='navid' className={sidebarToggle ? 'nav-sm' : 'nav-md'}>
        <div className='container body'>
          <div className='main_container'>
            <div className='col-md-3 left_col'>
              <div className='left_col scroll-view'>
                <div className='navbar nav_title' style={{ border: 0 }}>
                  <a href='/' className='site_title text-center px-4'>
                    <img
                      src='https://growthhopper.com/img/Growth_Hopper_Logo.png'
                      className='img img-responsive w-100'
                    />
                  </a>
                </div>

                <div className='clearfix'></div>

                <div className='profile clearfix'>
                  <div className='profile_pic'>
                    <img
                      style={{ background: '#000' }}
                      src='https://growthhopper.com/img/gh-spiral.png'
                      alt='...'
                      className='img-circle profile_img'
                    />
                  </div>
                  <div className='profile_info'>
                    <span>Welcome,</span>
                    <h2>{userData.name}</h2>
                  </div>
                </div>
                {/* <!-- /menu profile quick info --> */}

                <br />

                <Sidebar />
              </div>
            </div>
            <div>
              {/* <!-- top navigation --> */}
              <div className='top_nav'>
                <div className='nav_menu'>
                  <div className='nav toggle'>
                    <a
                      id='menu_toggle'
                      onClick={() =>
                        setSidebarToggle(sidebarToggle ? false : true)
                      }
                    >
                      <i className='fa fa-bars'></i>
                    </a>
                  </div>
                  <Topnav userData={userData} />
                </div>
              </div>
              {/* <!-- /top navigation --> */}
            </div>
            {props.children}

            <FooterContent />
          </div>
        </div>
      </div>
    </>
  );
}
