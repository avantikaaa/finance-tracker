import React, { useState, useEffect} from 'react';
import './css/ReminderScreen.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import {format} from 'date-fns';

function ReminderPopup({ onSubmit}) {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reminder = { date, amount, description };
    onSubmit(reminder);
  };

  const [show, setShow] = useState(true);
  const modalClose = () => setShow(false);

  return (
    <Modal show={show} onHide={modalClose}>
      <Modal.Header closeButton>  
        <Modal.Title>Add reminder</Modal.Title>  
      </Modal.Header>  
      
      <Modal.Body>  
        <form className='form-group' onSubmit={handleSubmit}>
        <label>Date</label>
        <input className='form-control' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <br />

        <label>Amount </label>
        <input className='form-control' type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <br />

        <label>Description</label>
        <input className='form-control' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <br />

        <button className='reminder-button' type="submit">Set Reminder</button>
      </form>  
      </Modal.Body>
    </Modal>
  );
}

function ReminderScreen() {
  const [reminders, setReminders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(()=>{
    fetch(`http://localhost:4000/getReminder`, {
      credentials:"include",
    }).then((res)=>res.json()).then((resp)=>{
      setReminders(resp);
    });   
  }, [])

  async function handleReminderSubmit(reminder){
    const resp = await fetch("http://localhost:4000/addReminder", {
      method: "POST",
      credentials:"include",
      body: JSON.stringify(reminder),
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      setShowPopup(false);
      setReminders([...reminders, reminder]);
    }
  };

  return (
    <div className='reminder-screen'>
      <div className='d-flex align-items-center'>
        <div>
          <FontAwesomeIcon className='icon-3' icon={faCalendarDays}/>
        </div>
        <div className='ms-3'>
          <h3 className='main-heading'>Reminders</h3>
        </div>
      </div>
      <br />

      <div className='peer-body'>
        <div>
          {reminders?.length > 0  && reminders.map((reminder, index) => (
          <div className='reminder-card' key={index}>
            <div>
              <p className='mb-0 reminder-desc'>{reminder.description}</p>
              <p className='reminder-date'>{format(new Date(reminder.date),'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p className='reminder-amount'>{reminder.amount}</p>
            </div>
          </div>
          ))}
        </div>
        <button className='calculate-button' onClick={() => setShowPopup(true)}>Add Reminder</button>
        {showPopup && <ReminderPopup onSubmit={handleReminderSubmit}/>}
      </div>
    </div>
  );
}

export default ReminderScreen;