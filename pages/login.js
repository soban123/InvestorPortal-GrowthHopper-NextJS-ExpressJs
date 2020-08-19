import React , { useState , useEffect } from 'react'
import Router  from "next/router"

 function login(props) {

  let [email , setEmail] = useState('');
  let [password , setPassword] = useState('');

  useEffect(() => {
    
     const isLogin = localStorage.getItem('login');
    const user =  localStorage.getItem('userData');
    let role = "";
    if( user ){

     const newuser = JSON.parse(user);
     role = newuser.role;
    }

     if( isLogin === "true" ){
       role == "admin" ? 
       Router.push(`/adminpanelshowusers`):
       Router.push(`/userpanel`) ;

     }
     console.log(props)
    
  }, [])


  const handleSubmit = (e) =>{
    e.preventDefault();
      const userobj = {
          email , 
          password
      }
      fetch('/user/login', {
          method: 'post',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            } ,
          body: JSON.stringify(userobj)
        }).then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data) ; 
          if( data.user[0].role == "investor" ){
            localStorage.setItem('login' , true );
            localStorage.setItem( "userData" , JSON.stringify(data.user[0]) )
            localStorage.setItem('token' ,data.token);
            Router.push('/userpanel'  )
          }
          else{

            localStorage.setItem('login' , true );
            localStorage.setItem( "userData" , JSON.stringify(data.user[0]) )
            localStorage.setItem('token' ,data.token);

            Router.push('/adminpanelshowusers')
           
          }
          
        })
        .catch((error) => {
          console.error('Error:', error);
          alert("Incorrect Id/Password")
        });
       
      
  }

    return (
        <div>
            <div>
      <a className="hiddenanchor" id="signin"></a>

      <div className="login_wrapper">
        <div className="animate form login_form">
          <section className="login_content">
            <form>
              <h1>Investor Portal</h1>
              <div>
              <input value={email} 
              id="email" 
              onChange={(e)=>{ setEmail(e.target.value) }} 
              type="email" 
              className="form-control"
                />

              </div>
              <div>
              <input value={password} 
              id="password"
               type="password" 
               className="form-control"
               onChange={(e)=>{ setPassword(e.target.value) }} 
               placeholder="password"
              />

              </div>
              <div>
                <a className="btn btn-default submit" onClick={handleSubmit} >Log in</a>
                {/* <a className="reset_pass" href="#">Lost your password?</a> */}
              </div>

              <div className="clearfix"></div>

              <div className="separator">
                <div className="clearfix"></div>
                <br />

                <div>
                  <p>
                    ©2020 All Rights Reserved. GrowthHopper
                  </p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
        </div>
    )
}
export default login