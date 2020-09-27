import Reactc, { useEffect, useState } from 'react';
import Layout from './LayoutForUser/layout';
import { Bar } from 'react-chartjs-2';
import DateRangePicker from './daterangepicker';
import { start } from 'nprogress';

export default function userpanel() {
  const [userData, setUserData] = useState({ amount: '' });
  const [lastmonthdata, setLastmonthdata] = useState({});
  const [TodayEarning, setTodayEarning] = useState(0);
  const [YesterdayEarning, setYesterdayEarning] = useState(0);
  const [modalshow, setmodalshow] = useState(false);
  const [starttoendArr, setstarttoendArr] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleSelect = (e) => {
    if (e.target.value == 'Last Month') {
      handleLastMonthGraph();
    } else if (e.target.value == 'This Month') {
      thismonthgraph();
    } else if (e.target.value == 'All Time') {
      Alltimegraph();
    } else if (e.target.value == 'Last 7 Days') {
      Last7daysgraph();
    } else if (e.target.value == 'Range') {
      setmodalshow(true);
    }
  };

  //Last 7 Days
  const Last7daysgraph = async () => {
    let { _id } = userData;
    let month = currentMonth;
    let day = currentDay;
    // day = 14;
    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + _id + '/' + month
    );
    let Currmonthdata = await apiCall.json();

    let arr = [];
    let start = Currmonthdata.length > 0 ? Currmonthdata[0].startDay : 1;
    setstarttoendArr(arr);

    //Daily Data
    let dataarr = [];
    let response = await fetch(
      '/user/investorsdailyreturns/' + _id + '/' + month
    );
    let data = await response.json();
    let sum = 0;
    data[0]?.dailyprofit.forEach((element) => {
      if (Number(element) < 0) {
        dataarr.push(0);
      } else {
        dataarr.push(Math.floor(Number(element)));
        sum += Number(element);
      }
    });

    for (let i = 0; i < 31; i++) {
      if (start + i > 31) {
        arr.push(start + i - 30);
      } else {
        arr.push(start + i);
      }
    }

    console.log('d1' , dataarr)

    let NumberofDays = arr.indexOf(day) + 1;
    console.log(NumberofDays) 
    console.log(arr)
    if (NumberofDays > 6) {
      dataarr = dataarr.slice(NumberofDays - 6, NumberofDays + 1);
    } else {
      let resData = await fetch(
        '/user/investorsdailyreturns/' + _id + '/' + (month - 1)
      );
      let lastMonthDays = await resData.json();
      var newLastDays = [];
      if (lastMonthDays.length > 0) {
        newLastDays = lastMonthDays[0]?.dailyprofit.slice(
          31 - (7 - NumberofDays),
          lastMonthDays[0]?.dailyprofit.length
        );
      } else {
        newLastDays = new Array(7 - NumberofDays).fill(0);
      }
      dataarr = newLastDays.concat(dataarr.slice(0, NumberofDays));
    }

    arr = [];
    for (let i = 0; i < 7; i++) {
      if( day - 6 + i < 1 ){
        arr.push(30 + day - 6 + i )
      }else{
        arr.push(day - 6 + i);
      }
    }

    console.log(dataarr);

    setData({
      labels: arr,
      datasets: [
        {
          label: 'Last 7 Days Returns',
          backgroundColor: chartdata.datasets[0].backgroundColor,
          borderWidth: 1,
          borderColor: chartdata.datasets[0].borderColor,
          data: dataarr,
        },
      ],
    });
  };

  //All TIme

  const Alltimegraph = async () => {
    let { _id } = userData;
    let month = currentMonth;
    let allmonth = await fetch('/user/investorsmonthlyreturns/' + _id);
    let allmonthdata = await allmonth.json();

    let arr = [];
    let dataarr = [];
    var monthFromData = 0;
    allmonthdata.forEach((element) => {
      monthFromData = element.month;
      arr.push(monthNames[monthFromData]);
      dataarr.push(element.revenue);
    });

    let startmonth = allmonthdata[0].month;

    let diff = month - startmonth > 0 ? month - startmonth : startmonth - month;

    dataarr.splice(diff, dataarr.length);

    setData({
      labels: arr,
      datasets: [
        {
          label: 'All Time Returns',
          backgroundColor: chartdata.datasets[0].backgroundColor,
          borderWidth: 1,
          borderColor: chartdata.datasets[0].borderColor,
          data: dataarr,
        },
      ],
    });
  };

  //Last Month Function
  const handleLastMonthGraph = async () => {
    let month = currentMonth ; 
    let { _id } = userData;
    let lastmonthCalc = month - 1 < 0 ? 11 : month - 1;

    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + _id + '/' + lastmonthCalc
    );
    let Currmonthdata = await apiCall.json();

    let arr = [];
    let start = Currmonthdata.length > 0 ? Currmonthdata[0].startDay : 0;
    let end = Currmonthdata.length > 0 ? Currmonthdata[0].endDay : 30;
    for (let i = 0; i < 30; i++) {
      if (start + i > 30) {
        arr.push(start + i - 30);
      } else {
        arr.push(start + i);
      }
    }
    setstarttoendArr(arr);

    //Daily Data
    let dataarr = [];
    let response = await fetch(
      '/user/investorsdailyreturns/' + _id + '/' + lastmonthCalc
    );
    let data = await response.json();
    let sum = 0;
    data[0]?.dailyprofit.forEach((element) => {
      if (Number(element) < 0) {
        dataarr.push(0);
      } else {
        dataarr.push(Math.floor(Number(element)));
        sum += Number(element);
      }
    });
    setData({
      labels: arr,
      datasets: [
        {
          label: 'Last Month Returns',
          backgroundColor: chartdata.datasets[0].backgroundColor,
          borderWidth: 1,
          borderColor: chartdata.datasets[0].borderColor,
          data: dataarr,
        },
      ],
    });
  };

  //This Month Graph Function
  const thismonthgraph = async () => {
  
    const userDatas = localStorage.getItem('userData');
    let parsedUserData = await JSON.parse(userDatas);
    let month = currentMonth ; 
    if (parsedUserData) {
      console.log('currentMonth' , currentMonth )
      if( parsedUserData.month ){
         month = parsedUserData.month;
        setCurrentMonth(parsedUserData.month);
      }
  

      setUserData(parsedUserData);
      //Last Month Data
      // let responseLastmonth = await fetch(
      //   '/user/investorsmonthlyreturns/' +
      //     parsedUserData._id +
      //     '/' +
      //     (month - 1)
      // );
      // let dataLastmonthly = await responseLastmonth.json();

      // console.log('monthly returns' ,dataLastmonthly   )
      // setLastmonthdata(dataLastmonthly[0]);

      let apiCall = await fetch(
        '/user/investorsmonthlyreturns/' + parsedUserData._id + '/' + month
      );
      let Currmonthdata = await apiCall.json();

      console.log(' curr monthly returns' ,Currmonthdata   )

      let arr = [];
      let start = Currmonthdata[0].startDay;
      let end = Currmonthdata[0].endDay;
      for (let i = 0; i < 30; i++) {
        if (start + i > 30) {
          arr.push(start + i - 30);
        } else {
          arr.push(start + i);
        }
      }
      setstarttoendArr(arr);

      //Daily Data
      let dataarr = [];
      let response = await fetch(
        '/user/investorsdailyreturns/' + parsedUserData._id + '/' + month
      );
      let data = await response.json();
      let sum = 0;

      data[0]?.dailyprofit.forEach((element) => {
        if (Number(element) < 0) {
          dataarr.push(0);
        } else {
          dataarr.push(Math.floor(Number(element)));
          sum += Number(element);
        }
      });

      let day = currentDay;
      // day = 20;
      let startdate = arr.indexOf(day);
      dataarr.splice(startdate + 1, dataarr.length);
      const todayprofit = dataarr.slice(startdate, startdate + 1);
      if (todayprofit > 0) {
        setTodayEarning(todayprofit);
      } else {
        setTodayEarning(0);
      }

      const Yesterdayearn = dataarr.slice(startdate - 1, startdate);
      if (Yesterdayearn > 0) {
        setYesterdayEarning(Yesterdayearn);
      } else {
        setYesterdayEarning(0);
      }

      setData({
        labels: arr,
        datasets: [
          {
            label: 'Daily Retunrs',
            backgroundColor: chartdata.datasets[0].backgroundColor,
            borderWidth: 1,
            borderColor: chartdata.datasets[0].borderColor,
            data: dataarr,
          },
        ],
      });
    }
  };

  useEffect(() => {
   

    
    thismonthgraph();


  }, []);

  const [chartdata, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Returns',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const handleClose = () => setmodalshow(false);

  const handleSelectForDate = (ranges) => {
    let startDay = new Date(`${ranges.startDate}`).getDate();
    let startMonth = new Date(`${ranges.startDate}`).getMonth();

    let endDay = new Date(`${ranges.endDate}`).getDate();
    let endMonth = new Date(`${ranges.endDate}`).getMonth();
    console.log('startDate', startDay, startMonth, endDay, endMonth);

    if (startDay && startMonth && endDay && endMonth) {
      RangeGraph(startDay, startMonth, endDay, endMonth);
    } else {
      alert('Select Correct date');
    }
  };

  const RangeGraph = async (strday, strtmnt, endday, endmnt) => {
    const diffinmnth = endmnt - strtmnt;
    let { _id } = userData;
    let month = currentMonth;
    let ToDay = new Date().getDate();

    let arr = [];
    let arr2 = [];
    let dataarr = [];

    let firstmonth = await fetch('/user/investorsmonthlyreturns/' + _id);
    let firstmonthdata = await firstmonth.json();

    if (firstmonthdata[0].month > strtmnt || firstmonthdata[0].month > endmnt) {
      for (let i = strday; i <= endday; i++) {
        if (i > 30) {
          arr.push(i - 30);
        } else {
          arr.push(i);
        }
      }
      setData({
        labels: arr,
        datasets: [
          {
            label: 'Daily Retunrs',
            backgroundColor: chartdata.datasets[0].backgroundColor,
            borderWidth: 1,
            borderColor: chartdata.datasets[0].borderColor,
            data: dataarr,
          },
        ],
      });
    } else {
      let resmonth = await fetch(
        '/user/investorsmonthlyreturns/' + _id + '/' + strtmnt
      );
      let monthdata = await resmonth.json();

      let start = monthdata[0].startDay;
      let end = monthdata[0].endDay;

      if (diffinmnth == 0) {
        // Month Data
        arr = [];

        let responseRange = await fetch(
          '/user/investorsdailyreturns/' + _id + '/' + strtmnt
        );
        let data = await responseRange.json();

        
          data[0]?.dailyprofit.forEach((element, index) => {
            if (Number(element) < 0) {
              dataarr.push(0);
            } else {
              dataarr.push(Math.floor(Number(element)));
            }
          });

        for (let i = strday; i <= endday; i++) {
          if (i > 30) {
            arr.push(i - 30);
          } else {
            arr.push(i);
          }
        }

        dataarr.splice(0, strday - start);

        setData({
          labels: arr,
          datasets: [
            {
              label: 'Daily Retunrs',
              backgroundColor: chartdata.datasets[0].backgroundColor,
              borderWidth: 1,
              borderColor: chartdata.datasets[0].borderColor,
              data: dataarr,
            },
          ],
        });
      } else if (diffinmnth == 1) {
        arr = [];
        arr2 = [];
        let responseRange = await fetch(
          '/user/investorsdailyreturns/' + _id + '/' + strtmnt
        );
        let resstrtdata = await responseRange.json();

        resstrtdata[0]?.dailyprofit.forEach((element, index) => {
          if (Number(element) < 0) {
            dataarr.push(0);
          } else {
            dataarr.push(Math.floor(Number(element)));
          }
        });

        dataarr.splice(0, strday - start);

        for (let i = strday; i < 31; i++) {
          if (i > 30) {
            arr.push(i - 30);
          } else {
            arr.push(i);
          }
        }

        let resendmnth = await fetch(
          '/user/investorsdailyreturns/' + _id + '/' + endmnt
        );
        let resenddata = await resendmnth.json();

        resenddata[0]?.dailyprofit.forEach((element, index) => {
          if (Number(element) < 0) {
            dataarr.push(0);
          } else {
            dataarr.push(Math.floor(Number(element)));
          }
        });

        for (let k = 1; k <= endday; k++) {
          arr2.push(k);
        }

        let arr3 = arr.concat(arr2);

        setData({
          labels: arr3,
          datasets: [
            {
              label: 'Daily Retunrs',
              backgroundColor: chartdata.datasets[0].backgroundColor,
              borderWidth: 1,
              borderColor: chartdata.datasets[0].borderColor,
              data: dataarr,
            },
          ],
        });
      } else if (diffinmnth > 1) {
        arr = [];
        for (let i = 0; i <= diffinmnth; i++) {
          if (i == 0) {
            let responseRange = await fetch(
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i)
            );
            let resstrtdata = await responseRange.json();

            resstrtdata[0]?.dailyprofit.forEach((element, index) => {
              if (Number(element) < 0) {
                dataarr.push(0);
              } else {
                dataarr.push(Math.floor(Number(element)));
              }
            });

            for (let i = strday; i < 31; i++) {
              if (i > 30) {
                arr.push(i - 30);
              } else {
                arr.push(i);
              }
            }
          } else if (i == diffinmnth) {
            let responseRange = await fetch(
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i)
            );
            let resstrtdata = await responseRange.json();

            resstrtdata[0]?.dailyprofit.forEach((element, index) => {
              if (Number(element) < 0) {
                dataarr.push(0);
              } else {
                dataarr.push(Math.floor(Number(element)));
              }
            });

            for (let i = 1; i <= endday; i++) {
              if (i > 30) {
                arr.push(i - 30);
              } else {
                arr.push(i);
              }
            }
          } else {
            let responseRange = await fetch(
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i)
            );
            let resstrtdata = await responseRange.json();

            resstrtdata[0]?.dailyprofit.forEach((element) => {
              if (Number(element) < 0) {
                dataarr.push(0);
              } else {
                dataarr.push(Math.floor(Number(element)));
              }
            });

            for (let i = strday; i < 31; i++) {
              arr.push(i);
            }
          }
        }

        setData({
          labels: arr,
          datasets: [
            {
              label: 'Daily Retunrs',
              backgroundColor: chartdata.datasets[0].backgroundColor,
              borderWidth: 1,
              borderColor: chartdata.datasets[0].borderColor,
              data: dataarr,
            },
          ],
        });
      }
    }
  };

  console.log('month' , currentMonth)

  return (
    <Layout>
      {/* <!-- page content --> */}
      <div className='right_col' role='main'>
        {/* <!-- top tiles --> */}
        <div className='row'>
          <div className='tile_count'>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-dollar'></i> Total Amount Invest
              </span>
              <div className='count green'>{userData.amount}</div>
            </div>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-clock-o'></i> Today Earning{' '}
              </span>
              <div className='count blue'>{TodayEarning}</div>
              {/* <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>3% </i> From last Week</span> */}
            </div>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-clock'></i> Yesterday Earning
              </span>
              <div className='count purple'>{YesterdayEarning}</div>
              {/* <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span> */}
            </div>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-dollar'></i> Last Month Earning
              </span>
              <div className='count orange'>
                {lastmonthdata?.revenue ? lastmonthdata.revenue : 0}
              </div>
              {/* <span className="count_bottom"><i className="red"><i className="fa fa-sort-desc"></i>12% </i> From last Week</span> */}
            </div>
          </div>
        </div>
        {/* <!-- /top tiles --> */}

        <div className='row'>
          <div className='col-md-12 col-sm-12 '>
            <div className='dashboard_graph'>
              <div class='form-group'>
                <label for='graph'>Select graph list </label>
                <select class='form-control' id='graph' onChange={handleSelect}>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>All Time</option>
                  <option>Range</option>
                  <option>Last 7 Days</option>
                </select>
              </div>

              <DateRangePicker
                handleSelectForDate={handleSelectForDate}
                modalshow={modalshow}
                handleClose={handleClose}
              />

              <div className='col-md-12 col-sm-12 '>
                <div id='chart_plot_01' className='demo-placeholder'>
                  <Bar
                    data={chartdata}
                    width={100}
                    height={50}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className='clearfix'></div>
            </div>
          </div>
        </div>
        <br />

      
       
      </div>
      {/* <!-- /page content --> */}
    </Layout>
  );
}
