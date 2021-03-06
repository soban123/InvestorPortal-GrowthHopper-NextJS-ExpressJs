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
                <a href='/adminpanelshowusers'>
                  <i className='fa fa-home'></i> HOME{' '}
                </a>
              </li>
              <li>
                <Link href='/adminpanel'>
                  <a>
                    <i className='fa fa-user-plus'></i> ADD INVESTORS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/news'>
                  <a>
                    <i className='fa fa-bell'></i> NEWS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/addnews'>
                  <a>
                    <i className='fa fa-plus'></i> ADD NEWS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/reports'>
                  <a>
                    <i className='fa fa-file'></i> REPORTS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/addreports'>
                  <a>
                    <i className='fa fa-plus-square'></i> ADD REPORTS{' '}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className='menu_section'>
            <h3>General</h3>
            <ul className='nav side-menu'>
              <li>
                <a href='/userpanel'>
                  <i className='fa fa-home'></i> HOME{' '}
                </a>
              </li>
              <li>
                <Link href='/usernews'>
                  <a>
                    <i className='fa fa-bell'></i> NEWS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/userreports'>
                  <a>
                    <i className='fa fa-file'></i> REPORTS{' '}
                  </a>
                </Link>
              </li>
              <li>
                <a target='_blank' href='http://support.growthhopper.com'>
                  <i className='fa fa-edit '></i> COMPLAINTS{' '}
                </a>
              </li>
              <li>
                <a target='_blank' href='https://wa.me/+923362009368'>
                  <i className='fa fa-phone'></i> TALK AGENT{' '}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* <!-- /sidebar menu --> */}
    </div>
  );
}
