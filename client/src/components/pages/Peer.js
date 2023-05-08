import React, {useState, useContext, useEffect } from 'react';
import './css/Peer.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Card from 'react-bootstrap/Card';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandHoldingUsd} from '@fortawesome/free-solid-svg-icons';
import {UserContext} from '../../contexts/UserContext'
import {Navigate} from 'react-router-dom'


function Peer() {
    
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState("lend");
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState();
  const [to, setTo] = useState(userInfo.username);
  const [from, setFrom] = useState(userInfo.username);
  const [interest, setInterest] = useState();
  const [redirect, setRedirect] = useState(false);
  const [dueDate, setDueDate] =  useState(new Date())

  useEffect(() => {
    setTo(userInfo.username);
    setFrom(userInfo.username);
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    if(selectedOption == "lend"){
      setFrom(userInfo.username);
    }else{
      setTo(userInfo.username);
    }
    if(selectedOption == "lend"){
      setFrom(userInfo.username);
    }else{
      setTo(userInfo.username);
    }
  };
  async function submit(ev) {
    ev.preventDefault();
    console.log(to, from);
    const resp = await fetch("http://localhost:4000/addLending", {
      method: "POST",
      body: JSON.stringify({ amount, to, from, interest, date, dueDate }),
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/homepage"} />;
  }

  return (
    <div className="peer">
        <div className='d-flex align-items-center'>
          <div>
            <FontAwesomeIcon className='icon-3' icon={faHandHoldingUsd}/>
          </div>
          <div className='ms-3'>
            <h3 className='main-heading'>Peer Lending</h3>
            <p>Maintain a record of people that owe you money and the ones that you owe money to.</p>
          </div>
        </div>
        
        <br />

        <div className='peer-body'>
          <div>
            <form>
              <div className='radio-button'>
                <input type="radio" id='lend' name="option" value="lend" checked={selectedOption === 'lend'} onChange={handleOptionChange}/>
                <label htmlFor='lend' className='ms-2'>Lend</label>
              </div>
              <div className='radio-button'>
                <input type="radio" id='borrow' name="option" value="borrow" checked={selectedOption === 'borrow'} onChange={handleOptionChange} />
                <label htmlFor='borrow' className='ms-2'>Borrow</label>
              </div>
            </form>
          </div>
          <br />
          <div>
          {selectedOption === 'lend' ? (
            <div className="">
              <form className="form-group" onSubmit={submit}>
                <div>
                  <label htmlFor="to">To:</label>
                  <input type="text" id="to" name='name' value={to} onChange={(e) => setTo(e.target.value)} className="form-control"/>
                </div>
                <br />
                <div>
                  <label htmlFor="amount">Amount:</label>
                  <input type="number" id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control"/>
                </div>
                <br />
                <div>
                  <label htmlFor="interest">Interest Rate:</label>
                  <input type="number" id="interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="form-control"/>
                </div>
                <br />
                <div className="two-col">
                  <div className="col1">
                    <label htmlFor="date">Lent Time:</label>
                    <DatePicker className='form-control' selected = {date} value = {date} onChange={(newValue) => setDate(newValue)} dateFormat="dd/MM/yyyy"/>
                  </div>
                  <br />
                  <div className="col2">
                    <label htmlFor="date" >Due Date:</label>
                    <DatePicker className='form-control' selected ={dueDate} value = {dueDate} onChange={(e) => setDueDate(e)} dateFormat="dd/MM/yyyy"/>
                  </div>
                </div>
                <br />
                <button type="submit" className='submit-button'>Submit</button>
              </form>
            </div>
          ) : (
            <div>
              <form className="form-group" onSubmit={submit}>
                  <div>
                    <label htmlFor="From">From:</label>
                    <input type="text" id="name" name='name' value = {from} onChange= {(e)=> setFrom(e.target.value)} className='form-control'/>
                  </div>
                  <br />
                  <div>
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" value = {amount} onChange = {(e) => setAmount(e.target.value)} className="form-control"/>
                  </div>
                  <br />
                  <div>
                    <label htmlFor="interest">Interest Rate:</label>
                    <input type="number" id="interest" name="interest" value = {interest} onChange = {(e) => setInterest(e.target.value)} className="form-control"/>
                  </div>
                  <br />
                  <div className="two-col">
                    <div className="col1">
                      <label htmlFor="date" >Borrowed on:</label>
                      <DatePicker className="form-control" selected ={date} value ={date} onChange={(e) => setDate(e)} dateFormat="dd/MM/yyyy" />
                    </div>
                    <br />
                    <div className="col2">
                      <label htmlFor="date" >Due Date:</label>
                      <DatePicker className="form-control" selected={dueDate} value ={dueDate} onChange={(e) => setDueDate(e)} dateFormat="dd/MM/yyyy"/>
                    </div>
                  </div>
                  <br />
                  <button type="submit" className='submit-button'>Submit</button>
              </form>
            </div>
          )}
          </div>
        </div>
    </div>
  );
}

export default Peer;