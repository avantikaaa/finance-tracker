import React, {useState, useEffect} from 'react';
import './css/Friend.css';
import {format, differenceInCalendarDays} from 'date-fns';

const Friend = ({ friend }) => {
  let status = '';
  if (friend.amount > 0) {
    status = 'owes you Rs.' + friend.amount;
  } else if (friend.amount < 0) {
    status = 'you owe Rs.' + Math.abs(friend.amount);
  } else {
    status = 'Settled';
  }
  function getAmount(amount, interest, date, dueDate) {
    const diff = differenceInCalendarDays(new Date(dueDate), new Date(date));
    const num_months = diff / 30.0;
    const amt = (amount * Math.pow(1 + interest / 100.0, num_months))
    return amt.toFixed(2);
  }
  
  const [friendData, setFriendData] = useState(friend);
  async function settle(ev, trans_Id){
    ev.preventDefault();
    const resp =  await fetch(`http://localhost:4000/settleTransaction/${trans_Id}`, {
      method:"PATCH", 
      credentials:"include",
      headers: { "Content-Type": "application/json" },
    });
    if(resp.ok){
      alert("Settled Successfully");
      console.log(friendData.data);
      const friend_data = friendData.data.map((doc)=>{
        if(doc.trans_id == trans_Id){
          doc.status = "settled";
        }
        return doc;
      });
      console.log(friend_data);
      setFriendData({_id: friendData._id, data: friend_data});
    }
  }
  return (
    <div>
      <div>
        <div className='friend-card'>
          <p className='name'>{friendData?._id}</p>
          <div>
            <div className='friend-header'>
              <p className='friend-text'><b>Interest</b></p>
              <p className='friend-text'><b>Date</b></p>
              <p className='friend-text'><b>Due Date</b></p>
              <p className='friend-text'><b>Amount</b></p>
            </div>
            {friendData?.data?.length > 0 && friendData.data.map((doc)=>
            <div className='friend-rows'>
              <p className='friend-text'>{doc.interest}%</p>
              <p className='friend-text'>{format(new Date(doc.date), 'dd/MM/yyyy')}</p>
              <p className='friend-text'>{format(new Date(doc.dueDate), 'dd/MM/yyyy')}</p>
              <p className='friend-text'>{doc.amount}</p>
              {
                (doc?.status === "pending"? <p><button className='settle-button' onClick={(ev)=>settle(ev, doc.trans_id)}>Settle</button></p>:<p>Settled</p>)
              }
            </div>)}
          </div>
          {/* <p className="status">{status}</p> */}
        </div>
      </div>
    </div>
  );
};

export default Friend;