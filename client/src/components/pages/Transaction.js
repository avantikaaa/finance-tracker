import React, {useState, useEffect} from 'react';
import History from './History';
import Card from 'react-bootstrap/Card';
import './css/Transaction.css'
import { UserContext } from "../../contexts/UserContext";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoneyBillTransfer} from '@fortawesome/free-solid-svg-icons';



function Transaction() {
  const [history, setHistory] = useState();
  useEffect(()=>{
    fetch("http://localhost:4000/getHistory", {
      credentials:"include",
    }).then((resHistory)=>resHistory.json()).then((dataHistory) => setHistory(dataHistory));
  }, [])
  return (
    <div className='transaction'>    
      <div className='d-flex align-items-center'>
        <div>
          <FontAwesomeIcon className='icon-3' icon={faMoneyBillTransfer}/>
        </div>
        <div className='ms-3'>
          <h3 className='main-heading'>Transactions</h3>
          <p className='mb-0'>Obtain a summary of all of your transactions.</p>
        </div>
      </div>
        
      <br />
      
      <div>
        <History transactions={history} />
      </div>
    </div>
    
  );
}

export default Transaction;