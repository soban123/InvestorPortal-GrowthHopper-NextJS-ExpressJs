import React , {useState} from 'react'
import Sidebar from './Components/Sidebar';
import Topnav from './Components/topnav'
import FooterContent from './Components/footercontents'
import { withRouter } from 'next/router'
import Layout from './LayoutAdmin/layout';
import { set } from 'nprogress';
 function adminPanel(props) {

  let [name , setName] = useState('');
  let [email , setEmail] = useState('');
  let [password , setPassword] = useState('');
  let [amount , setamount] = useState('');
  let [packages , setpackages] = useState('');
  const [ CRIShowHide , setCRI ] = useState('hide');

  const handleSubmit = (e) =>{
    e.preventDefault();
      const userobj = {
          email , 
          password , 
          name , 
          package:packages ,
          amount
      }
      const gettokenfromLocalstorage = localStorage.getItem('token');
      const token = `Bearer ${gettokenfromLocalstorage}`; 
      fetch('/user', {
          method: 'post',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json' ,
              'Authorization' : token
            } ,
          body: JSON.stringify(userobj)
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          alert('User has been added!')
        });
  }

  const handleCRI = (e) =>{
    setpackages(e.target.value);
    e.target.value == "" ?  setCRI('show') : setCRI('hide')
}


    return (
        <Layout>
          {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="">
            <div className="page-title">
              <div className="title_left">
                <h3>Add Investor</h3>
              </div>

              <div className="title_right">
                <div className="col-md-5 col-sm-5 form-group pull-right top_search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for..."
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">Go!</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="x_panel">
                  <div className="x_title">
                    <h2>Add Investor</h2>
                    
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                    <br />
                    <form
                      id="demo-form2"
                      data-parsley-validate
                      className="form-horizontal form-label-left"
                    >
                      <div className="item form-group">
                        <label
                          className="col-form-label col-md-3 col-sm-3 label-align"
                          for="first-name"
                          >Name <span className="required">*</span>
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="text"
                            id="first-name"
                            required="required"
                            className="form-control"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="item form-group">
                        <label
                          className="col-form-label col-md-3 col-sm-3 label-align"
                          for="last-name"
                          >Email <span className="required">*</span>
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="text"
                            id="last-name"
                            name="last-name"
                            required="required"
                            className="form-control"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="item form-group">
                        <label
                          for="middle-name"
                          className="col-form-label col-md-3 col-sm-3 label-align"
                          >Password</label
                        >
                        <div className="col-md-6 col-sm-6">
                          <input
                            id="middle-name"
                            className="form-control"
                            type="text"
                            name="middle-name"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="item form-group">
                        <label
                          for="middle-name"
                          className="col-form-label col-md-3 col-sm-3 label-align"
                          >Amount</label >
                        <div className="col-md-6 col-sm-6">
                          <input
                            id="middle-name"
                            className="form-control"
                            type="text"
                            name="middle-name"
                            value={amount}
                            onChange={(e)=>setamount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="item form-group">
                        <label
                          for="middle-name"
                          className="col-form-label col-md-3 col-sm-3 label-align"
                          >packages</label
                        >
                        <div className="col-md-6 col-sm-6">
                          
                          <select 
                           name="middle-name"
                           value={packages}
                           onChange={ handleCRI } 
                           className="custom-select">
                            <option selected>Choose Package</option>
                            <option  value="">Custom</option>
                            <option value="3%">3% MRR</option>
                            <option value="4%">4% MRR</option>
                            <option value="5%">5% MRR</option>
                            <option value={packages} >{packages}</option>
                          </select>
                          <div className={CRIShowHide == "show" ? "show" : "hide"}>
                              <p> Write your custom percentage :  </p>
                                <input
                                id="middle-name"
                                className="form-control"
                                value={packages}
                                placeholder=""
                                type="text"
                                onChange={(e)=>setpackages(e.target.value)}
                                name="middle-name"
                                required
                                />
                          </div>
                        </div>
                      </div>
                      <div className="ln_solid"></div>
                      <div className="item form-group">
                        <div className="col-md-6 col-sm-6 offset-md-3">
                          <button onClick={handleSubmit} className="btn btn-success">
                            Submit
                          </button> 
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
        <style jsx>{`
        .show{
            display:block
        }
        .hide{
            display : none
        }
       
       `}</style>
        </Layout>
    )
}

export default withRouter(adminPanel);