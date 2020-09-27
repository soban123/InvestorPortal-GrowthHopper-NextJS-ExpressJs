import React , {useState , useEffect} from 'react'
import Layout from './LayoutForUser/layout';

export default function usernews() {

    const [news , setNews ] = useState([])

    const [ updateNews , setUpdateNews ] = useState({title : '' , text : ' '})

    useEffect(() => {
        
        fetch('/news/get')
        .then(res => res.json())
        .then( data => setNews(data) )
      
    }, [])

  

    const handleEdit = (id) =>{

        fetch( '/news/'+id )
        .then( res => res.json() )
        .then( data => {setUpdateNews(data) ; console.log(data) } )
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
                  <div class="card"
                 
                  >
                      <div className="card-header" >
                       <h3  style={{display: "inline"}} >{news.title}</h3>
                       
                       <div style={{float: 'right'}}>
                              <button
                                data-toggle='modal'
                                data-target='.bs-example-modal-lg'
                                className='btn btn-info btn-sm'
                                onClick={() => {
                                handleEdit(news._id)
                                }}
                              >
                                <i className='fa fa-pencil'></i> View
                              </button>
                            
                             
                     </div>
                     </div>
                    <div class="card-body">
                        <p class="card-text">{news.text}</p>
                       
                        
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
                 News
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
                 
                  <div className='col-md-6 col-sm-6'>
                  
                    <h1> { updateNews.title }  </h1>
                  </div>
                </div>
                <div className='ln_solid'></div>
                <div className='item form-group'>
                 
                  <div className='col-md-6 col-sm-6'>
                   
                    <p>
                    { updateNews.text }
                    </p>
                    
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
            
             
            </div>
          </div>
        </div>
      </div>
     
        </Layout>
    )
}
