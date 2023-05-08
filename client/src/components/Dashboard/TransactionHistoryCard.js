import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import React, {useContext} from 'react';
import "./css/TransactionHistoryCard.css"
import { UserContext } from '../../contexts/UserContext';
import {format, differenceInCalendarDays} from 'date-fns';

function getAmount(amount, interest, date, dueDate) {
  const diff = differenceInCalendarDays(new Date(dueDate), new Date(date));
  const num_months = diff / 30.0;
  const amt = (amount * Math.pow(1 + interest / 100.0, num_months))
  return amt.toFixed(2);
}


function DuesCardElement(props) {
  const { date, from, amount, dueDate, interest} = props;
  const {userInfo, setUserInfo} = useContext(UserContext)
  const date_format = format(new Date(dueDate), 'dd/MM/yyyy');
  const amt = getAmount(amount, interest, date, dueDate);

  return (
    <div className='d-flex justify-content-between align-items-center'>
    <div>
      <p className='para3'>Due on: {date_format} </p>
      <p className='para5'>You owe {from} </p>
    </div>
    <p className='para4'>{amt}</p>
  </div>
    
  );
}

function DuesCard({dues}) {

  return (
    <div>
    
         {dues?.length > 0 ? (dues?.map((transaction) => (
        <DuesCardElement
          key={transaction._id}
          date={transaction.date}
          from ={(transaction.from_username)[0].username}
          amount={(transaction.amount).toFixed(2)}
          dueDate = {transaction.dueDate}
          interest = {transaction.interest}
        />))):"No upcoming payments at the moment"
      }
        </div>

  );
}
export default DuesCard;