import React from 'react';
import Router from 'next/router';

export default function topnav({ userData }) {
  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    // window.location.reload();
    Router.push('/');
  };
  return (
    <div>
      {/* <!-- top navigation --> */}
      <div className='top_nav'>
        <div className='nav_menu'>
          <div className='nav toggle'>
            <a id='menu_toggle'>
              <i className='fa fa-bars'></i>
            </a>
          </div>
          <nav className='nav navbar-nav'>
            <ul className='navbar-right'>
              <li
                className='nav-item dropdown open'
                style={{ paddingLeft: '15px' }}
              >
                <a
                  href='javascript:;'
                  className='user-profile dropdown-toggle'
                  aria-haspopup='true'
                  id='navbarDropdown'
                  data-toggle='dropdown'
                  aria-expanded='false'
                >
                  <img
                    src='https://growthhopper.com/img/gh-spiral.png'
                    alt=''
                  />{' '}
                  {userData?.name}
                </a>
                <div
                  className='dropdown-menu dropdown-usermenu pull-right'
                  aria-labelledby='navbarDropdown'
                >
                  <button className='dropdown-item' onClick={handleLogout}>
                    <i className='fa fa-sign-out pull-right'></i> Log Out
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* <!-- /top navigation --> */}
    </div>
  );
}
