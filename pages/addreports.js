import React , {useState , useEffect} from 'react'
import { useRouter } from 'next/router'
import Layout from './LayoutAdmin/layout'


export default function addreports() {

    const router = useRouter()

    const [title , setTitle] = useState('')
    const [file , setfile] = useState({})


    const handleAddReports = (e) => {
        e.preventDefault()

       
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        fetch('/reports' , {
            method: 'post',
            body: formData,  
           
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data)
            router.push('/reports')
          });
        
    }
    return (
        <Layout >

<div className='right_col mh-100' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>Add Reports</h3>
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
                        for='first-name'
                      >
                        Select Report <span className='required'>*</span>
                      </label>
                      <div className='col-md-6 col-sm-6'>
                      <div class="input-group mb-3">
                   
                    <div class="custom-file">
                        <input 
                        type="file" 
                        className="custom-file-input" 
                        id="inputGroupFile01"
                        onChange={(e)=> setfile(e.target.files[0]) }
                        />
                        <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                    </div>
                    </div>
                      </div>
                    </div>
                    

                    <div className='item form-group'>
                      <div className='col-md-6 col-sm-6 offset-md-3'>
                      <button onClick={handleAddReports} className="btn btn-secondary" > Add Report  </button>
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
