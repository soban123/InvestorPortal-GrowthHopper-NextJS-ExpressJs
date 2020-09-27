import React , {useState , useEffect} from 'react'
import { useRouter } from 'next/router'

import Layout from './LayoutAdmin/layout'





export default function addnews() {

    const router = useRouter()
    const [title , setTitle] = useState('')
    const [text , setText] = useState('')

    

    const handleAddNews = (e) => {
        e.preventDefault()

        const news = {
            title , 
            text
        }
        fetch('/news' , {
            method: 'post',
            body: JSON.stringify(news),  
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
              },
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data)
            router.push('/news')
          });
        
    }
   
    return (
        <Layout >

<div className='right_col mh-100' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>Add News</h3>
            </div>
          </div>
          <div className='clearfix'></div>
          <div className='row'>
            <div className='col-md-12 col-sm-12'>
              <div className='x_panel'>
                <div className='x_title'>

                  <div className='clearfix'></div>
                </div>
                <div className='x_content'>
                  <br />
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
                        Title <span className='required'>*</span>
                      </label>
                      <div className='col-md-6 col-sm-6'>
                        <input
                          type='text'
                          id='first-name'
                          required='required'
                          className='form-control'
                          value={title}
                          onChange={(e)=>setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='item form-group'>
                      <label
                        className='col-form-label col-md-3 col-sm-3 label-align'
                        for='editor'
                      >
                        Text <span className='required'>*</span>
                      </label>
                      <div className='col-md-6 col-sm-6'>
                        <textarea 
                          type='text'
                          id="editor"
                          required='required'
                          className='form-control'
                          value={text}
                          onChange={(e)=>setText(e.target.value)}
                        >
                         </textarea> 
                        
                      </div>
                    </div>
                    

                    <div className='item form-group'>
                      <div className='col-md-6 col-sm-6 offset-md-3'>
                      <button onClick={handleAddNews} className="btn btn-secondary" > Add News  </button>
                      </div>
                    </div>  
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- page content --> */}
     
      
      
        
        </Layout>
    )
    
}
