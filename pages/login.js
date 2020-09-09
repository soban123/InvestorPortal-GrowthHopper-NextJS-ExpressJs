import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Swal from 'sweetalert2';

const Login = (props) => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  useEffect(() => {
    const isLogin = localStorage.getItem('login');
    const user = localStorage.getItem('userData');
    let role = '';
    if (user) {
      const newuser = JSON.parse(user);
      role = newuser.role;
    }

    if (isLogin === 'true') {
      role == 'admin'
        ? Router.push(`/adminpanelshowusers`)
        : Router.push(`/userpanel`);
    }
    console.log(props);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userobj = {
      email,
      password,
    };
    fetch('/user/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userobj),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (data.user[0].role == 'investor') {
          localStorage.setItem('login', true);
          localStorage.setItem('userData', JSON.stringify(data.user[0]));
          localStorage.setItem('token', data.token);
          Router.push('/userpanel');
        } else {
          localStorage.setItem('login', true);
          localStorage.setItem('userData', JSON.stringify(data.user[0]));
          localStorage.setItem('token', data.token);

          Router.push('/adminpanelshowusers');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // alert('Incorrect Id/Password');
        Toast.fire({
          icon: 'error',
          title: 'Invalid Email or Password',
        });
      });
  };

  return (
    <div>
      <div>
        <a className='hiddenanchor' id='signin'></a>

        <div className='login_wrapper mw-100'>
          <div className='animate form login_form'>
            <section className='login_content mt-5 pt-5'>
              <div className='row'>
                <div className='col-6 text-right'>
                  <div className='mt-5'>
                    <img
                      className='mt-5 img img-responsive w-50'
                      src='http://growthhopper.com/img/gh-ip-logo.png'
                    />
                  </div>
                </div>
                <div
                  style={{ borderWidth: '4px' }}
                  className='col-6 border-left text-left'
                >
                  <form className='mr-5 pr-5'>
                    <div>
                      <label>Email</label>
                      <input
                        value={email}
                        id='email'
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        type='email'
                        className='form-control w-50'
                      />
                    </div>
                    <div>
                      <label>Password</label>
                      <input
                        value={password}
                        id='password'
                        type='password'
                        className='form-control w-50'
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        className='btn btn-secondary submit'
                        onClick={handleSubmit}
                      >
                        Log in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <footer
        style={{ bottom: '0px' }}
        className='position-absolute w-100 text-center bg-transparent m-0 p-0 mb-4'
      >
        <p className='m-0'>GrowthHopper</p>
        <p className='m-0'>Copyrights &copy; 2020. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Login;
