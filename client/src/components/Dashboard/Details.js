import React from 'react';
import "./css/Details.css"

function Details({balance}) {
  return (
    <div>
      <div>
        <div className='d-flex justify-content-between'>
          <p className='para1'>Total money in wallet</p>
          <p className='para2'>{balance?.balance}</p>
        </div>

        <div className='d-flex justify-content-between'>
          <p className='para1'>Monthly Limit</p>
          <p className='para2'>{balance?.limit}</p>
        </div>

        <div className='d-flex justify-content-between'>
          <p className='para1'>Total balance for this month</p>
          <p className='para2'>{balance?.monthExpense}</p>
        </div>
      </div>
    </div>
    
    
  );
}
export default Details;