import React , {useState , useEffect} from 'react'
import Layout from './LayoutAdmin/layout';


export default function reports() {

    const [reports , setReports ] = useState([])
    const [file , setfile] = useState({})

    const [ updateReports , setUpdateReports ] = useState({title : '' })

    useEffect(() => {
        
        fetch('/reports/get')
        .then(res => res.json())
        .then( data => setReports(data) )
      
    }, [])

    const handleDelete = ( id ) =>{
        fetch('/reports/delete/'+id , {
            method: 'delete',
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data)
            window.location.reload()
          });
    }

    const handleEdit = (id) =>{

        fetch( '/reports/'+id )
        .then( res => res.json() )
        .then( data => {setUpdateReports(data) ; console.log(data) } )
    }

    const handleSubmit = ( ) =>{

      const formData = new FormData();
      formData.append('title', updateReports.title);
      formData.append('file', file);

        fetch('/reports/update/'+updateReports._id , {
            method: 'put',
          
            body: formData
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data)
            window.location.reload()
          });
        

    }
    return (
        <Layout >
            <div className='right_col' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>Admin Reports</h3>
            </div>

            <div className='title_right'>
              <div className='col-md-5 col-sm-5 form-group pull-right top_search'>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Search for...'
                  />
                  <span className='input-group-btn'>
                    <button className='btn btn-secondary' type='button'>
                      
                    </button>
                  </span>
                </div>
              </div>
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
                  <div class="card">
                      <div className="card-header" >
                       <h2  style={{display: "inline"}} >{reports.title}</h2>
                       
                       <div style={{float: 'right'}}>
                              <button
                                data-toggle='modal'
                                data-target='.bs-example-modal-lg'
                                className='btn btn-info btn-sm'
                                onClick={() => {
                                handleEdit(reports._id)
                                }}
                              >
                                <i className='fa fa-pencil'></i> Edit
                              </button>
                              <button
                                className='btn btn-danger btn-sm'
                                onClick={() => {
                                handleDelete(reports._id)
                                }}
                              >
                                <i className='fa fa-pencil'></i> Delete
                              </button>
                     </div>
                     </div>
                    <div class="card-body">
                        <p class="card-text">{reports.text}</p>
                        <a href={'/'+reports.url} class="btn btn-primary">Download</a>
                        
                    </div>
                <div className='ln_solid'></div>
                  </div>
                        ) } ) }

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
                Edit reports
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
                      value = { updateReports.title }
                     
                      onChange={(e) => setUpdateReports({...updateReports , title : e.target.value})  }
                    />
                  </div>
                </div>
                <div className='item form-group'>
                  <label
                    for='middle-name'
                    className='col-form-label col-md-3 col-sm-3 label-align'
                  >
                   Select Report
                  </label>
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
    )
}
