import React , { useEffect , useState } from 'react'
import Sidebar from '../Components/Sidebar';
import Topnav from '../Components/topnav'
import FooterContent from '../Components/footercontents'
import Router from 'next/router'
export default function layout(props) {

    let [userData , setuserData] = useState({role:''});

    useEffect(() => {
        console.log('user')
        const userDataFromLocal =  localStorage.getItem('userData');
        if(userDataFromLocal)
        setuserData(JSON.parse(userDataFromLocal)) ; 

        const isLogin =  localStorage.getItem('login');

        console.log('islOgin' , isLogin)
        if( isLogin !== "true" ){
            Router.push('/login')
        }
    }, [])
    return (
      
              <div className="nav-md"> 
    <div className="container body">
      <div className="main_container">
        <div className="col-md-3 left_col">
          <div className="left_col scroll-view">
            <div className="navbar nav_title" style={{border: 0}}>
              <a href="index.html" className="site_title"
                ><i className="fa fa-paw"></i> <span>Gentelella Alela!</span></a
              >
            </div>

            <div className="clearfix"></div>

            <div className="profile clearfix">
              <div className="profile_pic">
                <img
                  src="./build/images/img.jpg"
                  alt="..."
                  className="img-circle profile_img"
                />
              </div>
              <div className="profile_info">
                <span>Welcome,</span>
                <h2>{userData.name}</h2>
              </div>
            </div>
            {/* <!-- /menu profile quick info --> */}

            <br />

           <Sidebar  />

            {/* <!-- /menu footer buttons --> */}
            <div className="sidebar-footer hidden-small">
              <a data-toggle="tooltip" data-placement="top" title="Settings">
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="FullScreen">
                <span
                  className="glyphicon glyphicon-fullscreen"
                  aria-hidden="true"
                ></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="Lock">
                <span
                  className="glyphicon glyphicon-eye-close"
                  aria-hidden="true"
                ></span>
              </a>
              <a
                data-toggle="tooltip"
                data-placement="top"
                title="Logout"
                href="login.html"
              >
                <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
              </a>
            </div>
            {/* <!-- /menu footer buttons --> */}
          </div>
        </div>

          <Topnav  userData={userData} />

            
            {props.children}
            

          <FooterContent />
      </div>
    </div>
    
    </div>
        
    )
}
