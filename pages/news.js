import React , {useState , useEffect} from 'react'
import Layout from './LayoutAdmin/layout';


export default function news() {

    const [news , setNews ] = useState([])

    const [ updateNews , setUpdateNews ] = useState({title : '' , text : ' '})

    useEffect(() => {
        
        fetch('/news/get')
        .then(res => res.json())
        .then( data => setNews(data) )
      
    }, [])

    const handleDelete = ( id ) =>{
        fetch('/news/delete/'+id , {
            method: 'delete',
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data)
            window.location.reload()
          });
    }

    const handleEdit = (id) =>{

        fetch( '/news/'+id )
        .then( res => res.json() )
        .then( data => {setUpdateNews(data) ; console.log(data) } )
    }

    const handleSubmit = ( ) =>{
        fetch('/news/update/'+updateNews._id , {
            method: 'put',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(updateNews)
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
              <h3>Investors</h3>
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
                  <div class="card">
                      <div className="card-header" >
                       <h2  style={{display: "inline"}} >{news.title}</h2>
                       
                       <div style={{float: 'right'}}>
                              <button
                                data-toggle='modal'
                                data-target='.bs-example-modal-lg'
                                className='btn btn-info btn-sm'
                                onClick={() => {
                                handleEdit(news._id)
                                }}
                              >
                                <i className='fa fa-pencil'></i> Edit
                              </button>
                              <button
                                className='btn btn-danger btn-sm'
                                onClick={() => {
                                handleDelete(news._id)
                                }}
                              >
                                <i className='fa fa-pencil'></i> Delete
                              </button>
                     </div>
                     </div>
                    <div class="card-body">
                        <p class="card-text">{news.text}</p>
                        {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
                        
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
                      value = { updateNews.title }
                     
                      onChange={(e) =>{ setUpdateNews({...updateNews , title : e.target.value}) } }
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
                  <div className='col-md-6 col-sm-6'  >
                   
                    <textarea 
                    className='form-control'
                    type='text'
                    id="editor-container"
                    onChange={(e) =>{ setUpdateNews({...updateNews , text : e.target.value}) } }
                    name='middle-name'
                    value = { updateNews.text }
                    >
                    </textarea>

                    
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
