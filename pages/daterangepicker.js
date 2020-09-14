import { addDays } from 'date-fns';
import { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Modal, Button } from 'react-bootstrap';

export default function DateRange({
  handleSelectForDate,
  modalshow,
  handleClose,
}) {
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
  
      let now = new Date();
      let nowMonth = now.getMonth();
      let nowDay = now.getDate();
      let nowYear = now.getFullYear();
  
      if (now < dt) {
        setendDate(`${nowYear}-${Number(nowMonth) + 1}-${nowDay}`);
      } else {
        setendDate(`${endYear}-${Number(endMonth) + 1}-${endDay}`);
      }
    }

  
  }, []);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  const handledate = (item) => {
    handleSelectForDate(item.selection);
    setState([item.selection]);
  };
  return (
    <>
      <Modal show={modalshow} onHide={handleClose} className='modal-width'>
        <Modal.Header closeButton>
          <Modal.Title>Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DateRangePicker
            onChange={handledate}
            showSelectionPreview={false}
            moveRangeOnFirstSelection={false}
            // months={2}
            ranges={state}
            minDate={new Date(startDate)}
            maxDate={new Date(endDate)}
            direction='horizontal'
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
