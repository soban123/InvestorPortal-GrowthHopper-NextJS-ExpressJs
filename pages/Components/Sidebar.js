import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  let [userData, setuserData] = useState({ role: '' });
  useEffect(() => {
    const userDataFromLocal = localStorage.getItem('userData');
    if (userDataFromLocal) setuserData(JSON.parse(userDataFromLocal));
    console.log('userDataFromLocal', userDataFromLocal);
  }, []);

  return (
    <div>
      {/* <!-- sidebar menu --> */}
      <div id='sidebar-menu' className='main_menu_side hidden-print main_menu'>
        {userData.role == 'admin' ? (
          <div className='menu_section'>
            <h3>General</h3>
            <ul className='nav side-menu'>
              <li>
                <Link href='/adminpanelshowusers'>
                  <a>
                    <i className='fa fa-home'></i> Home{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/adminpanel'>
                  <a>
                    <i className='fa fa-home'></i> Add Investor{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/news'>
                  <a>
                    <i className='fa fa-home'></i> NEWS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/addnews'>
                  <a>
                    <i className='fa fa-home'></i> ADD NEWS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/reports'>
                  <a>
                    <i className='fa fa-home'></i>  REPORTS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/addreports'>
                  <a>
                    <i className='fa fa-home'></i> ADD REPORTS{' '}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* <!-- /sidebar menu --> */}
    </div>
  );
}
