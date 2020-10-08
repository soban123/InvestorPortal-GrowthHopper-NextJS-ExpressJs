import React, { useState, useEffect } from 'react';
import Layout from './LayoutAdmin/layout';
import ReactHtmlParser from 'react-html-parser';

export default function news() {
  const [news, setNews] = useState([]);

  const [updateNews, setUpdateNews] = useState({ title: '', text: '' });
  const [quilVar, setQuilVar] = useState('');
  useEffect(() => {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    const token = `Bearer ${gettokenfromLocalstorage}`;

    fetch('/news/get' ,  {
      headers: {
        'Authorization': token,
      },
    })
      .then((res) => res.json())
      .then((data) => setNews(data));

      if(window.Quill){

        var quill = new window.Quill('#editor', {
          theme: 'snow',
        });
        quill.on('text-change', function (delta, oldDelta, source) {
          setUpdateNews({
            title: document.getElementById('middle-name').value,
            text: quill.root.innerHTML,
          });
        });
        setQuilVar(quill);
      }
  }, []);


  

  const handleDelete = (id) => {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    const token = `Bearer ${gettokenfromLocalstorage}`;
    fetch('/news/delete/' + id, {
      method: 'delete',
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
        console.log(data);
        window.location.reload();
      });
  };

  const handleEdit = (id) => {
  
     const gettokenfromLocalstorage = localStorage.getItem('token');
    const token = `Bearer ${gettokenfromLocalstorage}`;

    
   
      
      // var quill = new window.Quill('#editor', {
      //   theme: 'snow',
      // });
      var quill = quilVar ; 
        quill.on('text-change', function (delta, oldDelta, source) {
          setUpdateNews({
             id ,
            title: document.getElementById('middle-name').value,
            text: quill.root.innerHTML,
          });
        });
      
   

    fetch('/news/' + id ,  {
      headers: {
        'Authorization': token,
      },
    } )
      .then((res) => res.json())
      .then((data) => {
        setUpdateNews({ title: data.title, text: data.text , id : data._id });
        console.log(data)
        quill.clipboard.dangerouslyPasteHTML(data.text);
      });
  };

  const handleSubmit = () => {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    const token = `Bearer ${gettokenfromLocalstorage}`;
    console.log(updateNews)
    fetch('/news/update/' + updateNews.id, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,

      },
      body: JSON.stringify(updateNews),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        window.location.reload();
      });
  };
  return (
    <Layout>
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
                  <h2>News</h2>

                  <div className='clearfix'></div>
                </div>
                <div
                  style={{ height: '650px', overflow: 'scroll' }}
                  className='x_content'
                >
                  {/* <!-- start project list --> */}

                  {news.map((news, index) => {
                    return (
                      <div class='card mb-3'>
                        <div className='card-header'>
                          <h2 style={{ display: 'inline' }}>{news.title}</h2>

                          <div style={{ float: 'right' }}>
                            <button
                              data-toggle='modal'
                              data-target='.bs-example-modal-lg'
                              className='btn btn-info btn-sm'
                              onClick={() => {
                                handleEdit(news._id);
                              }}
                            >
                              <i className='fa fa-pencil'></i> Edit
                            </button>
                            <button
                              className='btn btn-danger btn-sm'
                              onClick={() => {
                                handleDelete(news._id);
                              }}
                            >
                              <i className='fa fa-pencil'></i> Delete
                            </button>
                          </div>
                        </div>
                        <div class='card-body'>
                          <p class='card-text'>{ReactHtmlParser(news.text)}</p>
                          {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
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
                Edit News
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
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                    Title
                  </label>
                  <div className='col-md-6 col-sm-6'>
                    <input
                      id='middle-name'
                      className='form-control'
                      type='text'
                      name='middle-name'
                      value={updateNews.title}
                      onChange={(e) => {
                        setUpdateNews({ ...updateNews, title: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                    Text
                  </label>

                  <div className='col-md-6 col-sm-6'>
                    {/* <textarea
                      className='form-control'
                      type='text'
                      onChange={(e) => {
                        setUpdateNews({ ...updateNews, text: e.target.value });
                      }}
                      name='middle-name'
                      value={updateNews.text}
                    /> */}
                    <div id='editor'></div>
                  </div>
                </div>
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
              <button
                type='button'
                className='btn btn-success'
                data-dismiss='modal'
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
