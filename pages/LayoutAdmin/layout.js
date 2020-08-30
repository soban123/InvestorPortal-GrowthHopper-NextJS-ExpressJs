import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Topnav from '../Components/topnav';
import FooterContent from '../Components/footercontents';
import Router from 'next/router';
export default function layout(props) {
  let [userData, setuserData] = useState({ role: '' });

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
    <div className='nav-md'>
      <div className='container body'>
        <div className='main_container'>
          <div className='col-md-3 left_col'>
            <div className='left_col scroll-view'>
              <div className='navbar nav_title' style={{ border: 0 }}>
                <a href='index.html' className='site_title text-center px-4'>
                  <img
                    src='http://growthhopper.com/img/Growth_Hopper_Logo.png'
                    className='img img-responsive w-100'
                  />
                </a>
              </div>

              <div className='clearfix'></div>

              <div className='profile clearfix'>
                <div className='profile_pic'>
                  <img
                    style={{ background: '#000' }}
                    src='http://growthhopper.com/img/gh-spiral.png'
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

          <Topnav userData={userData} />

          {props.children}

          <FooterContent />
        </div>
      </div>
    </div>
  );
}
