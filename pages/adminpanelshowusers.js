import React, { useState, useEffect } from 'react';

import { Router, withRouter } from 'next/router';
import Layout from './LayoutAdmin/layout';

function adminpanelshowusers(props) {
  let [users, setUsers] = useState([]);
  let [ModalView, setModalView] = useState('view');
  //   let [password , setPassword] = useState('');
  let [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    month: '',
    amount: '',
    package: '6%',
  });

  const [token, setToken] = useState('');
  const [CRIShowHide, setCRI] = useState('hide');

  useEffect(() => {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    const token = `Bearer ${gettokenfromLocalstorage}`;

    setToken(token);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/user/update/' + userData.id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(userData),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        alert('User has been updated!');
        window.location.reload();
      });
  };

  useEffect(() => {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    const tokens = `Bearer ${gettokenfromLocalstorage}`;

    fetch('/user' , {
      method: 'get',
      headers: {
        'Authorization': tokens,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const handleCRI = (e) => {
    setUserData({ ...userData, package: e.target.value });
    e.target.value == '' ? setCRI('show') : setCRI('hide');
  };

  const handleBlock = (id) => {
    fetch('/user/block/' + id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        alert('User has been Blocked');
        window.location.reload();
      });
  };

  const handleActive = (id) => {
    fetch('/user/active/' + id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        alert('User has been Active');
        window.location.reload();
      });
  };

  const handleView = (id) => {
    fetch('/user/' + id , )
      .then((res) => res.json())
      .then((data) => {
        setUserData({
          name: data.name,
          email: data.email,
          id: data._id,
          package: data.package,
          month: data.month,
          amount: data.amount,
        });
      });
  };

  return (
    <Layout>
      {/* <!-- page content --> */}
      <div className='right_col' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>Investors</h3>
            </div>
          </div>

          <div className='clearfix'></div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='x_panel'>
                <div className='x_title'>
                  <h2>Investors</h2>

                  <div className='clearfix'></div>
                </div>
                <div
                  style={{ height: '650px', overflow: 'scroll' }}
                  className='x_content'
                >
                  {/* <!-- start project list --> */}
                  <table className='table table-striped projects'>
                    <thead>
                      <tr>
                        <th style={{ width: '1%' }}>#</th>
                        <th style={{ width: '20%' }}>Investor Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Package</th>
                        <th>Status</th>
                        <th style={{ width: '20%' }}>Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => {
                        return (
                          <tr key={index}>
                            <td>#</td>
                            <td>
                              <a>{user.name}</a>
                              <br />
                              <small>
                                Created{' '}
                                {user.date
                                  ? user.date.split('T')[0]
                                  : 'not Specified'}
                              </small>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.amount}</td>
                            <td>{user.package}</td>
                            <td>
                              <button
                                type='button'
                                className={
                                  user.status == 1
                                    ? 'btn btn-success btn-sm'
                                    : 'btn btn-danger btn-sm'
                                }
                              >
                                {user.status == 1 ? 'Success' : 'Block'}
                              </button>
                            </td>

                            <td>
                              <button
                                data-toggle='modal'
                                data-target='.bs-example-modal-lg'
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                  setModalView('view');
                                  handleView(user._id);
                                }}
                              >
                                <i className='fa fa-folder'></i> View
                              </button>
                              <button
                                data-toggle='modal'
                                data-target='.bs-example-modal-lg'
                                className='btn btn-info btn-sm'
                                onClick={() => {
                                  setModalView('update');
                                  handleView(user._id);
                                }}
                              >
                                <i className='fa fa-pencil'></i> Edit
                              </button>
                              {user.status == 1 ? (
                                <button
                                  onClick={() => handleBlock(user._id)}
                                  className='btn btn-danger btn-sm'
                                >
                                  <i className='fa fa-trash-o'></i> Block
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActive(user._id)}
                                  className='btn btn-success btn-xs'
                                >
                                  <i className='fa fa-active'></i> Active
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* <!-- end project list --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className='modal fade bs-example-modal-lg'
        tabindex='-1'
        role='dialog'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title' id='myModalLabel'>
                User View / Edit
              </h4>
              <button type='button' className='close' data-dismiss='modal'>
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <div className='modal-body'>
              <form
                id='demo-form2'
                data-parsley-validate
                className='form-horizontal form-label-left'
              >
                <div className='item form-group'>
                  <label
                    className='col-form-label col-md-3 col-sm-3 label-align'
                    for='first-name'
                  >
                    Username <span className='required'>*</span>
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <input
                      type='text'
                      id='first-name'
                      required='required'
                      className='form-control'
                      value={userData.name}
                      disabled={ModalView == 'update' ? false : true}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    className='col-form-label col-md-3 col-sm-3 label-align'
                    for='last-name'
                  >
                    Email <span className='required'>*</span>
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <input
                      type='text'
                      id='last-name'
                      name='last-name'
                      required='required'
                      className='form-control'
                      value={userData.email}
                      disabled={ModalView == 'update' ? false : true}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                    Start Month
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <input
                      id='middle-name'
                      className='form-control'
                      type='text'
                      name='middle-name'
                      value={userData.month}
                      disabled={ModalView == 'update' ? false : true}
                      onChange={(e) =>
                        setUserData({ ...userData, month: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                    Amount
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <input
                      id='middle-name'
                      className='form-control'
                      type='text'
                      disabled={ModalView == 'update' ? false : true}
                      onChange={(e) =>
                        setUserData({ ...userData, amount: e.target.value })
                      }
                      name='middle-name'
                      value={userData.amount}
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                    Package
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <select
                      name='middle-name'
                      value={userData.package}
                      disabled={ModalView == 'update' ? false : true}
                      onChange={handleCRI}
                      class='custom-select'
                    >
                      <option selected value=''>
                        Custom
                      </option>
                      <option value='3%'>3% MRR</option>
                      <option value='4%'>4% MRR</option>
                      <option value='5%'>5% MRR</option>
                      <option value={userData.package}>
                        {userData.package}
                      </option>
                    </select>
                    <div className={CRIShowHide == 'show' ? 'show' : 'hide'}>
                      <p> Write your custom percentage : </p>
                      <input
                        id='middle-name'
                        className='form-control'
                        value={userData.package}
                        placeholder=''
                        type='text'
                        disabled={ModalView == 'update' ? false : true}
                        onChange={(e) =>
                          setUserData({ ...userData, package: e.target.value })
                        }
                        name='middle-name'
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className='ln_solid'></div>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
              {ModalView == 'update' ? (
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='btn btn-primary'
                >
                  Save changes
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- page content --> */}

      <style jsx>{`
        .show {
          display: block;
        }
        .hide {
          display: none;
        }
      `}</style>
    </Layout>
  );
}

export default withRouter(adminpanelshowusers);
