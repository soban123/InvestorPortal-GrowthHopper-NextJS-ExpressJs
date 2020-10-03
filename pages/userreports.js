import React, { useState, useEffect } from 'react';
import Layout from './LayoutForUser/layout';

export default function userreports() {
  const [reports, setReports] = useState([]);

  var token ; 
  if(typeof window == 'object'){

    const gettokenfromLocalstorage = localStorage.getItem('token');
     token = `Bearer ${gettokenfromLocalstorage}`;
  }

  useEffect(() => {

    fetch('/reports/get', {
      method: 'get',
      headers: {
        Authorization: token,
      }
    })
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);

  return (
    <Layout>
      <div className='right_col' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>User Reports</h3>
            </div>
          </div>

          <div className='clearfix'></div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='x_panel'>
                <div className='x_title'>
                  <h2>Reports</h2>

                  <div className='clearfix'></div>
                </div>
                <div
                  style={{ height: '650px', overflow: 'scroll' }}
                  className='x_content'
                >
                  {/* <!-- start project list --> */}

                  {reports.map((reports, index) => {
                    return (
                      <div class='card mb-3'>
                        <div className='card-header'>
                          <h2 style={{ display: 'inline' }}>{reports.title}</h2>
                        </div>
                        <div class='card-body'>
                          <p class='card-text'>{reports.text}</p>
                          <a href={'/' + reports.url} class='btn btn-primary'>
                            Download
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {/* <!-- end project list --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
