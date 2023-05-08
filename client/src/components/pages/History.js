import React,{useContext} from 'react';
import { UserContext } from '../../contexts/UserContext';
import './css/History.css';
import {format} from 'date-fns'
function HistoryCard(props) {
  const {key, date, to, from, amount, category } = props;
  const {userInfo, setUserInfo} = useContext(UserContext)
  const date_format = format(new Date(date), 'dd/MM/yyyy')

  return (
    <div className='transaction-card'>
      <p className='transaction-part'>{userInfo?.id == from ? "Debit": "Credit"}</p>
      <p className='transaction-part'>{userInfo?.id == from ? "Paid to " + to : "Received from " + from}</p>
      <p className='transaction-part'>{date_format}</p>
      <p className='transaction-part'>Rs. {amount}</p>
      <p className='transaction-part'>{category}</p>
    </div>
    
  );
}

function History(props) {
  const { transactions } = props;

  return (
    <div className="transaction-history">
      <div className='transaction-card'>
        <p className='transaction-part'><b>Type</b></p>
        <p className='transaction-part'><b>Paid / Received</b></p>
        <p className='transaction-part'><b>Date</b></p>
        <p className='transaction-part'><b>Amount</b></p>
        <p className='transaction-part'><b>Category</b></p>
      </div>
      {transactions?.map((transaction) => (
        <HistoryCard key={transaction._id} date={transaction.date} to = {transaction. to} from ={transaction.from} amount={transaction.amount} category = {transaction.category}/>
      ))}
    </div>
  );
}

export default History;