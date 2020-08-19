import { addDays } from 'date-fns';
import { useState , useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import {Modal , Button}  from 'react-bootstrap'


export default function DateRange ({handleSelectForDate , modalshow , handleClose}){

 

    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ]);

      const handledate = (item) =>{
        console.log(item , item.selection)
        handleSelectForDate(item.selection)
         setState([item.selection])
      }
      return(
        <>

         
     
     
     <Modal show={modalshow} onHide={handleClose} className="modal-width">
        <Modal.Header closeButton>
          <Modal.Title>Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DateRangePicker
        onChange={handledate}
        // showSelectionPreview={false}
        // moveRangeOnFirstSelection={false}
        // months={2}
        ranges={state}
        direction="horizontal"
      />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
)
}

;