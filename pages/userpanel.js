import Reactc, { useEffect, useState } from 'react';
import Layout from './LayoutForUser/layout';
import { Bar, Pie } from 'react-chartjs-2';
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
  const [brandNames, setBrandNames] = useState([]);
  const [startDate, setStartDate] = useState('2020-6-26');
  const [endDate, setendDate] = useState('2020-12-26');
  const [pieData, setPieData] = useState({
    labels: ['Week 1'],
    datasets: [
      {
        backgroundColor: [
          '#2ecc71',
          '#3498db',
          '#95a5a6',
          '#9b59b6',
          '#f1c40f',
          '#e74c3c',
          '#34495e',
        ],
        data: [0],
      },
    ],
  });
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

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
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

  var token;
  if (typeof window == 'object') {
    const gettokenfromLocalstorage = localStorage.getItem('token');
    token = `Bearer ${gettokenfromLocalstorage}`;
  }

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
    setCurrentMonth(new Date().getMonth());
    let { _id } = userData;
    let month = currentMonth;
    let day = currentDay;
    // day = 14;
    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + _id + '/' + month,
      {
        method: 'get',
        headers: {
          Authorization: token,
        },
      }
    );
    let Currmonthdata = await apiCall.json();

    let arr = [];
    let start = Currmonthdata.length > 0 ? Currmonthdata[0].startDay : 1;
    setstarttoendArr(arr);

    //Daily Data
    let dataarr = [];
    let response = await fetch(
      '/user/investorsdailyreturns/' + _id + '/' + month,
      {
        method: 'get',
        headers: {
          Authorization: token,
        },
      }
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

    for (let i = 0; i < data[0]?.dailyprofit.length; i++) {
      arr.push(i);
    }

    // console.log('d1', dataarr);

    let NumberofDays = arr.indexOf(day);
    // console.log(NumberofDays);
    // console.log(arr);
    console.log('dt', dataarr);
    if (NumberofDays > 6) {
      dataarr = dataarr.slice(NumberofDays - 6, NumberofDays + 1);
    } else {
      let resData = await fetch(
        '/user/investorsdailyreturns/' + _id + '/' + (month - 1),
        {
          method: 'get',
          headers: {
            Authorization: token,
          },
        }
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
      console.log('nmbrdays', NumberofDays);
      dataarr = newLastDays.concat(dataarr.slice(0, NumberofDays));
    }

    console.log('dt', dataarr);
    console.log('day', arr.indexOf(day), day);
    console.log('newLastDays', newLastDays);

    arr = [];
    for (let i = 0; i < 7; i++) {
      if (day - 6 + i < 1) {
        arr.push(30 + day - 6 + i);
      } else {
        arr.push(day - 6 + i);
      }
    }

    // console.log(dataarr);

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
    setCurrentMonth(new Date().getMonth());
    let { _id } = userData;
    let month = currentMonth;

    let allmonth = await fetch('/user/investorsmonthlyreturns/' + _id, {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });
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
    console.log(startmonth);
    let diff = month - startmonth > 0 ? month - startmonth : startmonth - month;
    console.log(diff, dataarr);

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
    let month = currentMonth;
    let { _id } = userData;
    let lastmonthCalc = month - 1 < 0 ? 11 : month - 1;

    let apiCall = await fetch(
      '/user/investorsmonthlyreturns/' + _id + '/' + lastmonthCalc,
      {
        method: 'get',
        headers: {
          Authorization: token,
        },
      }
    );
    let Currmonthdata = await apiCall.json();

    let arr = [];
    // let start = Currmonthdata.length > 0 ? Currmonthdata[0].startDay : 0;
    // let end = Currmonthdata.length > 0 ? Currmonthdata[0].endDay : 30;

    // setstarttoendArr(arr);

    //Daily Data
    let dataarr = [];
    let response = await fetch(
      '/user/investorsdailyreturns/' + _id + '/' + lastmonthCalc,
      {
        method: 'get',
        headers: {
          Authorization: token,
        },
      }
    );
    let data = await response.json();
    let sum = 0;
    setCurrentMonth(currentMonth - 1);
    data[0]?.dailyprofit.forEach((element) => {
      if (Number(element) < 0) {
        dataarr.push(0);
      } else {
        dataarr.push(Math.floor(Number(element)));
        sum += Number(element);
      }
    });
    console.log(data);
    let noofdays = data.length > 0 ? data[0].dailyprofit.length : 30;
    for (let i = 1; i <= noofdays; i++) {
      arr.push(i);
    }
    console.log(arr);
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
    setCurrentMonth(new Date().getMonth());

    const userDatas = localStorage.getItem('userData');
    let parsedUserData = await JSON.parse(userDatas);
    let month = currentMonth;
    if (parsedUserData) {
      // console.log('currentMonth', currentMonth);
      if (parsedUserData.month) {
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
        '/user/investorsmonthlyreturns/' + parsedUserData._id + '/' + month,
        {
          method: 'get',
          headers: {
            Authorization: token,
          },
        }
      );
      let Currmonthdata = await apiCall.json();

      // console.log(' curr monthly returns', Currmonthdata);

      //Daily Data
      let dataarr = [];
      let response = await fetch(
        '/user/investorsdailyreturns/' + parsedUserData._id + '/' + month,
        {
          method: 'get',
          headers: {
            Authorization: token,
          },
        }
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

      let arr = [];

      for (let i = 1; i <= data[0].dailyprofit.length; i++) {
        arr.push(i);
      }
      console.log(arr);

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

      if (dataarr.length > 7) {
        let finalData = [];
        let returnData = [];
        let brandValues = dataarr.slice(dataarr.length - 6, dataarr.length - 1);
        var brands = [
          'Slyde Sports',
          'Slides',
          'Toy Universe',
          'Clobbers',
          'Klein Watches',
        ];
        brandValues.map((num, index) =>
          finalData.push({ id: num, name: brands[index] })
        );
        let brandValuesSorted = brandValues.sort(function (a, b) {
          return b - a;
        });

        brandValuesSorted.map((num) => {
          finalData.map((val) => {
            if (val.id === num) {
              returnData.push(val.name);
            }
          });
        });
        setBrandNames(returnData);
      }
      let weeklySum = [];
      if (dataarr.length > 7) {
        let iterateNum = parseInt((dataarr.length / 7).toFixed(0));
        let iterateTill = 0;
        for (var index = 1; index < iterateNum + 1; index++) {
          weeklySum.push(
            dataarr.slice(iterateTill, 7 * index).reduce(function (a, b) {
              return a + b;
            }, 0)
          );
          iterateTill = 7 * index;
        }

        if (
          dataarr.reduce(function (a, b) {
            return a + b;
          }) !==
          weeklySum.reduce(function (a, b) {
            return a + b;
          })
        ) {
          weeklySum.push(
            dataarr.slice(iterateTill, dataarr.lenght).reduce(function (a, b) {
              return a + b;
            }, 0)
          );
        }
        let weekLabel = [];
        weeklySum.map((num, index) => {
          weekLabel.push('Week ' + (index + 1));
        });
        setPieData({
          labels: weekLabel,
          datasets: [
            {
              backgroundColor: [
                '#2ecc71',
                '#3498db',
                '#95a5a6',
                '#9b59b6',
                '#f1c40f',
                '#e74c3c',
                '#34495e',
              ],
              data: weeklySum,
            },
          ],
        });
        console.log(weeklySum);
      }
      function add_months(dt, n) {
        return new Date(dt.setMonth(dt.getMonth() + n));
      }

      // setStartDate(`${parsedUserData.date.split('T')[0]}`);
      let dt = new Date(`${parsedUserData.date.split('T')[0]}`);
      let lastDate = add_months(dt, 6);
      let endMonth = lastDate.getMonth();
      let endDay = lastDate.getDate();
      let endYear = lastDate.getFullYear();

      setendDate(`${endYear}-${Number(endMonth) + 1}-${endDay}`);
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
    // console.log('startDate', startDay, startMonth, endDay, endMonth);

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

    let firstmonth = await fetch('/user/investorsmonthlyreturns/' + _id, {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });
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
        '/user/investorsmonthlyreturns/' + _id + '/' + strtmnt,
        {
          method: 'get',
          headers: {
            Authorization: token,
          },
        }
      );
      let monthdata = await resmonth.json();

      let start = monthdata[0].startDay;
      let end = monthdata[0].endDay;

      if (diffinmnth == 0) {
        // Month Data
        arr = [];

        let responseRange = await fetch(
          '/user/investorsdailyreturns/' + _id + '/' + strtmnt,
          {
            method: 'get',
            headers: {
              Authorization: token,
            },
          }
        );
        let data = await responseRange.json();

        data[0]?.dailyprofit.forEach((element, index) => {
          if (Number(element) < 0) {
            dataarr.push(0);
          } else {
            dataarr.push(Math.floor(Number(element)));
          }
        });
        console.log(data[0]?.dailyprofit);
        for (let i = strday; i <= endday; i++) {
          if (i > 30) {
            arr.push(i - 30);
          } else {
            arr.push(i);
          }
        }
        console.log(dataarr);

        dataarr.splice(0, strday - 1);
        console.log('las', dataarr);

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
          '/user/investorsdailyreturns/' + _id + '/' + strtmnt,
          {
            method: 'get',
            headers: {
              Authorization: token,
            },
          }
        );
        let resstrtdata = await responseRange.json();

        resstrtdata[0]?.dailyprofit.forEach((element, index) => {
          if (Number(element) < 0) {
            dataarr.push(0);
          } else {
            dataarr.push(Math.floor(Number(element)));
          }
        });
        //   console.log(dataarr)
        //  dataarr =  dataarr.splice(strday, endday);
        //  console.log(dataarr)

        for (let i = strday; i < resstrtdata[0]?.dailyprofit.length; i++) {
          if (i > 30) {
            arr.push(i - 30);
          } else {
            arr.push(i);
          }
        }

        let resendmnth = await fetch(
          '/user/investorsdailyreturns/' + _id + '/' + endmnt,
          {
            method: 'get',
            headers: {
              Authorization: token,
            },
          }
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
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i),
              {
                method: 'get',
                headers: {
                  Authorization: token,
                },
              }
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
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i),
              {
                method: 'get',
                headers: {
                  Authorization: token,
                },
              }
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
              '/user/investorsdailyreturns/' + _id + '/' + (strtmnt + i),
              {
                method: 'get',
                headers: {
                  Authorization: token,
                },
              }
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

  const Formate = (num) => {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
      : Math.sign(num) * Math.abs(num);
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
              <div className='count green'>{Formate(userData.amount)}</div>
            </div>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-clock-o'></i> Today Earning{' '}
              </span>
              <div className='count blue'>{Formate(TodayEarning)}</div>
              {/* <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>3% </i> From last Week</span> */}
            </div>
            <div className='col-md-3 col-sm-4  tile_stats_count'>
              <span className='count_top'>
                <i className='fa fa-clock'></i> Yesterday Earning
              </span>
              <div className='count purple'>{Formate(YesterdayEarning)}</div>
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
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        xAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                              callback: function (value, index, values) {
                                console.log(value, index, values);
                                let month = currentMonth;
                                if (
                                  values.indexOf(1) !== 0 &&
                                  values.length == 7
                                ) {
                                  month =
                                    index < values.indexOf(1)
                                      ? month - 1
                                      : month;
                                }

                                var d = new Date();
                                let newmonth = Math.floor(index / 30);
                                d.setMonth(month + newmonth);

                                d.setDate(value);

                                return typeof value == 'string'
                                  ? value
                                  : d.toDateString();
                              },
                            },
                          },
                        ],
                      },
                    }}
                  />
                </div>
              </div>

              <div className='clearfix'></div>
            </div>
          </div>
          <br />
          <br />
        </div>
        <br />
        <div className='row'>
          <div className='col-md-4 col-sm-4 pb-3'>
            <div className='x_panel tile'>
              <div className='x_title'>
                <h5>Top Earning Brands This Week</h5>
              </div>
              <div style={{ height: '277px' }} className='x_content'>
                <ul className='pl-1'>
                  {brandNames.length === 0
                    ? 'Data will be generated after a week'
                    : brandNames.map((name) => (
                        <h5>
                          <img
                            width='100px'
                            src={
                              name === 'Clobbers'
                                ? 'https://cdn.shopify.com/s/files/1/0304/8289/0811/files/logo3_500x@2x.png?v=1580948324'
                                : name === 'Slyde Sports'
                                ? 'https://cdn.shopify.com/s/files/1/0252/4955/files/Logo-slyde.jpg?11408428979176859774'
                                : name === 'Slides'
                                ? 'https://cdn.shopify.com/s/files/1/1808/3269/files/slyders-black-logo_180x.png?v=1552653150'
                                : name == 'Toy Universe'
                                ? 'https://cdn.shopify.com/s/files/1/1598/2739/t/80/assets/img-logo.svg?v=11199241676725470910'
                                : name === 'Klein Watches'
                                ? 'https://cdn.shopify.com/s/files/1/1720/7857/files/logo_d5d80075-9c05-4858-baaf-dd92354e54d5_210x.jpg?v=1517027205'
                                : ''
                            }
                            className='img img-responsive'
                          />
                        </h5>
                      ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='col-md-4 col-sm-4 pb-3'>
            <div className='x_panel tile'>
              <div className='x_title'>
                <h5>Top Earning Brands This Week</h5>
              </div>
              <div style={{ height: '277px' }} className='x_content py-5'>
                <Pie
                  data={pieData}
                  width={500}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          <div className='col-md-4 col-sm-4 pb-3'>
            <div className='x_panel tile'>
              <div className='x_title'>
                <h5>Contract Renewal</h5>
              </div>
              <div style={{ height: '277px' }} className='x_content'>
                <h5>Start Date: {startDate}</h5>
                <h5>End Date: {endDate}</h5>
                <hr />
                For renewal talk to agent.{' '}
                <a href='https://wa.me/03362009368'>Click here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /page content --> */}
    </Layout>
  );
}
