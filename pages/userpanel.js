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
    let { email } = userData;
    let month = currentMonth;
    let day = currentDay;
    // day = 14;
    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + email + '/' + month
    );
    let Currmonthdata = await apiCall.json();

    let arr = [];
    let start = Currmonthdata.length > 0 ? Currmonthdata[0].startDay : 1;
    setstarttoendArr(arr);

    //Daily Data
    let dataarr = [];
    let response = await fetch(
      '/user/investorsdailyreturns/' + email + '/' + month
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
        '/user/investorsdailyreturns/' + email + '/' + (month - 1)
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
      arr.push(day - 6 + i);
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
    let { email } = userData;
    let month = currentMonth;
    let allmonth = await fetch('/user/investorsmonthlyreturns/' + email);
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
    let { email } = userData;
    let month = currentMonth;
    let lastmonthCalc = month - 1 < 0 ? 11 : month - 1;

    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + email + '/' + lastmonthCalc
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
      '/user/investorsdailyreturns/' + email + '/' + lastmonthCalc
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
    const parsedUserData = await JSON.parse(userDatas);

    if (parsedUserData) {
      let month = currentMonth;
      // month = 8

      setUserData(parsedUserData);
      //Last Month Data
      let responseLastmonth = await fetch(
        '/user/investorsmonthlyreturns/' +
          parsedUserData.email +
          '/' +
          (month - 1)
      );
      let dataLastmonthly = await responseLastmonth.json();

      setLastmonthdata(dataLastmonthly[0]);

      let apiCall = await fetch(
        '/user/investorsmonthlyreturns/' + parsedUserData.email + '/' + month
      );
      let Currmonthdata = await apiCall.json();

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
        '/user/investorsdailyreturns/' + parsedUserData.email + '/' + month
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
      // day = 30
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
    let { email } = userData;
    let month = currentMonth;
    let ToDay = new Date().getDate();

    let arr = [];
    let arr2 = [];
    let dataarr = [];

    let firstmonth = await fetch('/user/investorsmonthlyreturns/' + email);
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
        '/user/investorsmonthlyreturns/' + email + '/' + strtmnt
      );
      let monthdata = await resmonth.json();

      let start = monthdata[0].startDay;
      let end = monthdata[0].endDay;

      if (diffinmnth == 0) {
        // Month Data
        arr = [];

        let responseRange = await fetch(
          '/user/investorsdailyreturns/' + email + '/' + strtmnt
        );
        let data = await responseRange.json();

        if (firstmonthdata[0].month == month) {
          data[0]?.dailyprofit.forEach((element, index) => {
            if (Number(element) < 0) {
              dataarr.push(0);
            } else {
              dataarr.push(Math.floor(Number(element)));
            }
          });
        }

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
          '/user/investorsdailyreturns/' + email + '/' + strtmnt
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
          '/user/investorsdailyreturns/' + email + '/' + endmnt
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
              '/user/investorsdailyreturns/' + email + '/' + (strtmnt + i)
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
              '/user/investorsdailyreturns/' + email + '/' + (strtmnt + i)
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
              '/user/investorsdailyreturns/' + email + '/' + (strtmnt + i)
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

        <div className='row'>
          <div className='col-md-4 col-sm-4 '>
            <div className='x_panel tile fixed_height_320'>
              <div className='x_title'>
                <h2>App Versions</h2>
                <ul className='nav navbar-right panel_toolbox'>
                  <li>
                    <a className='collapse-link'>
                      <i className='fa fa-chevron-up'></i>
                    </a>
                  </li>
                  <li className='dropdown'>
                    <a
                      href='#'
                      className='dropdown-toggle'
                      data-toggle='dropdown'
                      role='button'
                      aria-expanded='false'
                    >
                      <i className='fa fa-wrench'></i>
                    </a>
                    <div
                      className='dropdown-menu'
                      aria-labelledby='dropdownMenuButton'
                    >
                      <a className='dropdown-item' href='#'>
                        Settings 1
                      </a>
                      <a className='dropdown-item' href='#'>
                        Settings 2
                      </a>
                    </div>
                  </li>
                  <li>
                    <a className='close-link'>
                      <i className='fa fa-close'></i>
                    </a>
                  </li>
                </ul>
                <div className='clearfix'></div>
              </div>
              <div className='x_content'>
                <h4>App Usage across versions</h4>
                <div className='widget_summary'>
                  <div className='w_left w_25'>
                    <span>0.1.5.2</span>
                  </div>
                  <div className='w_center w_55'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-green'
                        role='progressbar'
                        aria-valuenow='60'
                        aria-valuemin='0'
                        aria-valuemax='100'
                        style={{ width: '66%' }}
                      >
                        <span className='sr-only'>60% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className='w_right w_20'>
                    <span>123k</span>
                  </div>
                  <div className='clearfix'></div>
                </div>

                <div className='widget_summary'>
                  <div className='w_left w_25'>
                    <span>0.1.5.3</span>
                  </div>
                  <div className='w_center w_55'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-green'
                        role='progressbar'
                        aria-valuenow='60'
                        aria-valuemin='0'
                        aria-valuemax='100'
                        style={{ width: '45%' }}
                      >
                        <span className='sr-only'>60% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className='w_right w_20'>
                    <span>53k</span>
                  </div>
                  <div className='clearfix'></div>
                </div>
                <div className='widget_summary'>
                  <div className='w_left w_25'>
                    <span>0.1.5.4</span>
                  </div>
                  <div className='w_center w_55'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-green'
                        role='progressbar'
                        aria-valuenow='60'
                        aria-valuemin='0'
                        aria-valuemax='100'
                        style={{ width: '25%' }}
                      >
                        <span className='sr-only'>60% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className='w_right w_20'>
                    <span>23k</span>
                  </div>
                  <div className='clearfix'></div>
                </div>
                <div className='widget_summary'>
                  <div className='w_left w_25'>
                    <span>0.1.5.5</span>
                  </div>
                  <div className='w_center w_55'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-green'
                        role='progressbar'
                        aria-valuenow='60'
                        aria-valuemin='0'
                        aria-valuemax='100'
                        style={{ width: '5%' }}
                      >
                        <span className='sr-only'>60% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className='w_right w_20'>
                    <span>3k</span>
                  </div>
                  <div className='clearfix'></div>
                </div>
                <div className='widget_summary'>
                  <div className='w_left w_25'>
                    <span>0.1.5.6</span>
                  </div>
                  <div className='w_center w_55'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-green'
                        role='progressbar'
                        aria-valuenow='60'
                        aria-valuemin='0'
                        aria-valuemax='100'
                        style={{ width: '2%' }}
                      >
                        <span className='sr-only'>60% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className='w_right w_20'>
                    <span>1k</span>
                  </div>
                  <div className='clearfix'></div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-4 col-sm-4 '>
            <div className='x_panel tile fixed_height_320 overflow_hidden'>
              <div className='x_title'>
                <h2>Device Usage</h2>
                <ul className='nav navbar-right panel_toolbox'>
                  <li>
                    <a className='collapse-link'>
                      <i className='fa fa-chevron-up'></i>
                    </a>
                  </li>
                  <li className='dropdown'>
                    <a
                      href='#'
                      className='dropdown-toggle'
                      data-toggle='dropdown'
                      role='button'
                      aria-expanded='false'
                    >
                      <i className='fa fa-wrench'></i>
                    </a>
                    <div
                      className='dropdown-menu'
                      aria-labelledby='dropdownMenuButton'
                    >
                      <a className='dropdown-item' href='#'>
                        Settings 1
                      </a>
                      <a className='dropdown-item' href='#'>
                        Settings 2
                      </a>
                    </div>
                  </li>
                  <li>
                    <a className='close-link'>
                      <i className='fa fa-close'></i>
                    </a>
                  </li>
                </ul>
                <div className='clearfix'></div>
              </div>
              <div className='x_content'>
                <table className='' style={{ width: '100%' }}>
                  <tr>
                    <th style={{ width: '37%' }}>
                      <p>Top 5</p>
                    </th>
                    <th>
                      <div className='col-lg-7 col-md-7 col-sm-7 '>
                        <p className=''>Device</p>
                      </div>
                      <div className='col-lg-5 col-md-5 col-sm-5 '>
                        <p className=''>Progress</p>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <td>
                      <canvas
                        className='canvasDoughnut'
                        height='140'
                        width='140'
                        style={{ margin: '15px 10px 10px 0' }}
                      ></canvas>
                    </td>
                    <td>
                      <table className='tile_info'>
                        <tr>
                          <td>
                            <p>
                              <i className='fa fa-square blue'></i>IOS{' '}
                            </p>
                          </td>
                          <td>30%</td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <i className='fa fa-square green'></i>Android{' '}
                            </p>
                          </td>
                          <td>10%</td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <i className='fa fa-square purple'></i>Blackberry{' '}
                            </p>
                          </td>
                          <td>20%</td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <i className='fa fa-square aero'></i>Symbian{' '}
                            </p>
                          </td>
                          <td>15%</td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <i className='fa fa-square red'></i>Others{' '}
                            </p>
                          </td>
                          <td>30%</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div className='col-md-4 col-sm-4 '>
            <div className='x_panel tile fixed_height_320'>
              <div className='x_title'>
                <h2>Quick Settings</h2>
                <ul className='nav navbar-right panel_toolbox'>
                  <li>
                    <a className='collapse-link'>
                      <i className='fa fa-chevron-up'></i>
                    </a>
                  </li>
                  <li className='dropdown'>
                    <a
                      href='#'
                      className='dropdown-toggle'
                      data-toggle='dropdown'
                      role='button'
                      aria-expanded='false'
                    >
                      <i className='fa fa-wrench'></i>
                    </a>
                    <div
                      className='dropdown-menu'
                      aria-labelledby='dropdownMenuButton'
                    >
                      <a className='dropdown-item' href='#'>
                        Settings 1
                      </a>
                      <a className='dropdown-item' href='#'>
                        Settings 2
                      </a>
                    </div>
                  </li>
                  <li>
                    <a className='close-link'>
                      <i className='fa fa-close'></i>
                    </a>
                  </li>
                </ul>
                <div className='clearfix'></div>
              </div>
              <div className='x_content'>
                <div className='dashboard-widget-content'>
                  <ul className='quick-list'>
                    <li>
                      <i className='fa fa-calendar-o'></i>
                      <a href='#'>Settings</a>
                    </li>
                    <li>
                      <i className='fa fa-bars'></i>
                      <a href='#'>Subscription</a>
                    </li>
                    <li>
                      <i className='fa fa-bar-chart'></i>
                      <a href='#'>Auto Renewal</a>{' '}
                    </li>
                    <li>
                      <i className='fa fa-line-chart'></i>
                      <a href='#'>Achievements</a>
                    </li>
                    <li>
                      <i className='fa fa-bar-chart'></i>
                      <a href='#'>Auto Renewal</a>{' '}
                    </li>
                    <li>
                      <i className='fa fa-line-chart'></i>
                      <a href='#'>Achievements</a>
                    </li>
                    <li>
                      <i className='fa fa-area-chart'></i>
                      <a href='#'>Logout</a>
                    </li>
                  </ul>

                  <div className='sidebar-widget'>
                    <h4>Profile Completion</h4>
                    <canvas
                      width='150'
                      height='80'
                      id='chart_gauge_01'
                      className=''
                      style={{ width: '160px', height: '100px' }}
                    ></canvas>
                    <div className='goal-wrapper'>
                      <span id='gauge-text' className='gauge-value pull-left'>
                        0
                      </span>
                      <span className='gauge-value pull-left'>%</span>
                      <span id='goal-text' className='goal-value pull-right'>
                        100%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-4 col-sm-4 '>
            <div className='x_panel'>
              <div className='x_title'>
                <h2>
                  Recent Activities <small>Sessions</small>
                </h2>
                <ul className='nav navbar-right panel_toolbox'>
                  <li>
                    <a className='collapse-link'>
                      <i className='fa fa-chevron-up'></i>
                    </a>
                  </li>
                  <li className='dropdown'>
                    <a
                      href='#'
                      className='dropdown-toggle'
                      data-toggle='dropdown'
                      role='button'
                      aria-expanded='false'
                    >
                      <i className='fa fa-wrench'></i>
                    </a>
                    <div
                      className='dropdown-menu'
                      aria-labelledby='dropdownMenuButton'
                    >
                      <a className='dropdown-item' href='#'>
                        Settings 1
                      </a>
                      <a className='dropdown-item' href='#'>
                        Settings 2
                      </a>
                    </div>
                  </li>
                  <li>
                    <a className='close-link'>
                      <i className='fa fa-close'></i>
                    </a>
                  </li>
                </ul>
                <div className='clearfix'></div>
              </div>
              <div className='x_content'>
                <div className='dashboard-widget-content'>
                  <ul className='list-unstyled timeline widget'>
                    <li>
                      <div className='block'>
                        <div className='block_content'>
                          <h2 className='title'>
                            <a>
                              Who Needs Sundance When You’ve
                              Got&nbsp;Crowdfunding?
                            </a>
                          </h2>
                          <div className='byline'>
                            <span>13 hours ago</span> by <a>Jane Smith</a>
                          </div>
                          <p className='excerpt'>
                            Film festivals used to be do-or-die moments for
                            movie makers. They were where you met the producers
                            that could fund your project, and if the buyers
                            liked your flick, they’d pay to Fast-forward and…{' '}
                            <a>Read&nbsp;More</a>
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='block'>
                        <div className='block_content'>
                          <h2 className='title'>
                            <a>
                              Who Needs Sundance When You’ve
                              Got&nbsp;Crowdfunding?
                            </a>
                          </h2>
                          <div className='byline'>
                            <span>13 hours ago</span> by <a>Jane Smith</a>
                          </div>
                          <p className='excerpt'>
                            Film festivals used to be do-or-die moments for
                            movie makers. They were where you met the producers
                            that could fund your project, and if the buyers
                            liked your flick, they’d pay to Fast-forward and…{' '}
                            <a>Read&nbsp;More</a>
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='block'>
                        <div className='block_content'>
                          <h2 className='title'>
                            <a>
                              Who Needs Sundance When You’ve
                              Got&nbsp;Crowdfunding?
                            </a>
                          </h2>
                          <div className='byline'>
                            <span>13 hours ago</span> by <a>Jane Smith</a>
                          </div>
                          <p className='excerpt'>
                            Film festivals used to be do-or-die moments for
                            movie makers. They were where you met the producers
                            that could fund your project, and if the buyers
                            liked your flick, they’d pay to Fast-forward and…{' '}
                            <a>Read&nbsp;More</a>
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className='block'>
                        <div className='block_content'>
                          <h2 className='title'>
                            <a>
                              Who Needs Sundance When You’ve
                              Got&nbsp;Crowdfunding?
                            </a>
                          </h2>
                          <div className='byline'>
                            <span>13 hours ago</span> by <a>Jane Smith</a>
                          </div>
                          <p className='excerpt'>
                            Film festivals used to be do-or-die moments for
                            movie makers. They were where you met the producers
                            that could fund your project, and if the buyers
                            liked your flick, they’d pay to Fast-forward and…{' '}
                            <a>Read&nbsp;More</a>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-8 col-sm-8 '>
            <div className='row'>
              <div className='col-md-12 col-sm-12 '>
                <div className='x_panel'>
                  <div className='x_title'>
                    <h2>
                      Visitors location <small>geo-presentation</small>
                    </h2>
                    <ul className='nav navbar-right panel_toolbox'>
                      <li>
                        <a className='collapse-link'>
                          <i className='fa fa-chevron-up'></i>
                        </a>
                      </li>
                      <li className='dropdown'>
                        <a
                          href='#'
                          className='dropdown-toggle'
                          data-toggle='dropdown'
                          role='button'
                          aria-expanded='false'
                        >
                          <i className='fa fa-wrench'></i>
                        </a>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='dropdownMenuButton'
                        >
                          <a className='dropdown-item' href='#'>
                            Settings 1
                          </a>
                          <a className='dropdown-item' href='#'>
                            Settings 2
                          </a>
                        </div>
                      </li>
                      <li>
                        <a className='close-link'>
                          <i className='fa fa-close'></i>
                        </a>
                      </li>
                    </ul>
                    <div className='clearfix'></div>
                  </div>
                  <div className='x_content'>
                    <div className='dashboard-widget-content'>
                      <div className='col-md-4 hidden-small'>
                        <h2 className='line_30'>
                          125.7k Views from 60 countries
                        </h2>

                        <table className='countries_list'>
                          <tbody>
                            <tr>
                              <td>United States</td>
                              <td className='fs15 fw700 text-right'>33%</td>
                            </tr>
                            <tr>
                              <td>France</td>
                              <td className='fs15 fw700 text-right'>27%</td>
                            </tr>
                            <tr>
                              <td>Germany</td>
                              <td className='fs15 fw700 text-right'>16%</td>
                            </tr>
                            <tr>
                              <td>Spain</td>
                              <td className='fs15 fw700 text-right'>11%</td>
                            </tr>
                            <tr>
                              <td>Britain</td>
                              <td className='fs15 fw700 text-right'>10%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        id='world-map-gdp'
                        className='col-md-8 col-sm-12 '
                        style={{ height: '230px' }}
                      >
                        {' '}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              {/* <!-- Start to do list --> */}
              <div className='col-md-6 col-sm-6 '>
                <div className='x_panel'>
                  <div className='x_title'>
                    <h2>
                      To Do List <small>Sample tasks</small>
                    </h2>
                    <ul className='nav navbar-right panel_toolbox'>
                      <li>
                        <a className='collapse-link'>
                          <i className='fa fa-chevron-up'></i>
                        </a>
                      </li>
                      <li className='dropdown'>
                        <a
                          href='#'
                          className='dropdown-toggle'
                          data-toggle='dropdown'
                          role='button'
                          aria-expanded='false'
                        >
                          <i className='fa fa-wrench'></i>
                        </a>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='dropdownMenuButton'
                        >
                          <a className='dropdown-item' href='#'>
                            Settings 1
                          </a>
                          <a className='dropdown-item' href='#'>
                            Settings 2
                          </a>
                        </div>
                      </li>
                      <li>
                        <a className='close-link'>
                          <i className='fa fa-close'></i>
                        </a>
                      </li>
                    </ul>
                    <div className='clearfix'></div>
                  </div>
                  <div className='x_content'>
                    <div className=''>
                      <ul className='to_do'>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Schedule
                            meeting with new client{' '}
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Create
                            email address for new intern
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Have IT
                            fix the network printer
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Copy
                            backups to offsite location
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Food
                            truck fixie locavors mcsweeney
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Food
                            truck fixie locavors mcsweeney
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Create
                            email address for new intern
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Have IT
                            fix the network printer
                          </p>
                        </li>
                        <li>
                          <p>
                            <input type='checkbox' className='flat' /> Copy
                            backups to offsite location
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- End to do list -->

                <!-- start of weather widget --> */}
              <div className='col-md-6 col-sm-6 '>
                <div className='x_panel'>
                  <div className='x_title'>
                    <h2>
                      Daily active users <small>Sessions</small>
                    </h2>
                    <ul className='nav navbar-right panel_toolbox'>
                      <li>
                        <a className='collapse-link'>
                          <i className='fa fa-chevron-up'></i>
                        </a>
                      </li>
                      <li className='dropdown'>
                        <a
                          href='#'
                          className='dropdown-toggle'
                          data-toggle='dropdown'
                          role='button'
                          aria-expanded='false'
                        >
                          <i className='fa fa-wrench'></i>
                        </a>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='dropdownMenuButton'
                        >
                          <a className='dropdown-item' href='#'>
                            Settings 1
                          </a>
                          <a className='dropdown-item' href='#'>
                            Settings 2
                          </a>
                        </div>
                      </li>
                      <li>
                        <a className='close-link'>
                          <i className='fa fa-close'></i>
                        </a>
                      </li>
                    </ul>
                    <div className='clearfix'></div>
                  </div>
                  <div className='x_content'>
                    <div className='row'>
                      <div className='col-sm-12'>
                        <div className='temperature'>
                          <b>Monday</b>, 07:30 AM
                          <span>F</span>
                          <span>
                            <b>C</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <div className='weather-icon'>
                          <canvas
                            height='84'
                            width='84'
                            id='partly-cloudy-day'
                          ></canvas>
                        </div>
                      </div>
                      <div className='col-sm-8'>
                        <div className='weather-text'>
                          <h2>
                            Texas <br />
                            <i>Partly Cloudy Day</i>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-12'>
                      <div className='weather-text pull-right'>
                        <h3 className='degrees'>23</h3>
                      </div>
                    </div>

                    <div className='clearfix'></div>

                    <div className='row weather-days'>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Mon</h2>
                          <h3 className='degrees'>25</h3>
                          <canvas
                            id='clear-day'
                            width='32'
                            height='32'
                          ></canvas>
                          <h5>
                            15 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Tue</h2>
                          <h3 className='degrees'>25</h3>
                          <canvas height='32' width='32' id='rain'></canvas>
                          <h5>
                            12 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Wed</h2>
                          <h3 className='degrees'>27</h3>
                          <canvas height='32' width='32' id='snow'></canvas>
                          <h5>
                            14 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Thu</h2>
                          <h3 className='degrees'>28</h3>
                          <canvas height='32' width='32' id='sleet'></canvas>
                          <h5>
                            15 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Fri</h2>
                          <h3 className='degrees'>28</h3>
                          <canvas height='32' width='32' id='wind'></canvas>
                          <h5>
                            11 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='col-sm-2'>
                        <div className='daily-weather'>
                          <h2 className='day'>Sat</h2>
                          <h3 className='degrees'>26</h3>
                          <canvas height='32' width='32' id='cloudy'></canvas>
                          <h5>
                            10 <i>km/h</i>
                          </h5>
                        </div>
                      </div>
                      <div className='clearfix'></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- end of weather widget --> */}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /page content --> */}
    </Layout>
  );
}
