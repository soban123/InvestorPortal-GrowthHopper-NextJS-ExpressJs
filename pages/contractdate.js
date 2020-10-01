import React , {useState , useEffect} from 'react'
import Layout from './LayoutForUser/layout';

export default function contractdate() {

    const [startDate, setStartDate] = useState('2020-6-26');
    const [endDate, setendDate] = useState('2020-12-26');

    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('userData'));
    
        if( userData ){
    
          function add_months(dt, n) {
            return new Date(dt.setMonth(dt.getMonth() + n));
          }
      
          setStartDate(`${userData.date.split('T')[0]}`);
          let dt = new Date(`${userData.date.split('T')[0]}`);
          let lastDate = add_months(dt, 6);
          let endMonth = lastDate.getMonth();
          let endDay = lastDate.getDate();
          let endYear = lastDate.getFullYear();
      
         
      
          setendDate(`${endYear}-${Number(endMonth) + 1}-${endDay}`);
        
        }
    
      
      }, []);

    return (
        <Layout>

            <div className='right_col' role='main'>
        <div className=''>
          <div className='page-title'>
            <div className='title_left'>
              <h3>Contract Date</h3>
            </div>

            
          </div>

         

          <div className='clearfix'></div>
          <div className='ln_solid'></div>

          <div className='row'>
            <div className='col-md-12'>
           
            <h4> Start Date {startDate} </h4>
            <h4> End Date {endDate} </h4>

            </div>
          </div>
        </div>
      </div>

            
        </Layout>
    )
}
