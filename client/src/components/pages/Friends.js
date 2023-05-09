import React, { useState, useEffect } from 'react';
import Friend from './Friend';
import './css/Friends.css';
import FemaleUser from '../../images/FemaleUser.svg';
import MaleUser from '../../images/MaleUser.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserGroup } from '@fortawesome/free-solid-svg-icons';


const Friends = () => {

  const [friendData, setFriendData] = useState();
  useEffect(() => {
    fetch(`http://localhost:4000/getFriends`, {
      credentials: "include",
    })
      .then((resFriendData) => resFriendData.json())
      .then((friendData) => setFriendData(friendData));
  }, []);


  return (
    <div className="friends">
      <div className='d-flex align-items-center'>
        <div>
          <FontAwesomeIcon className='icon-3' icon={faUserGroup}/>
        </div>
        <div className='ms-3'>
          <h3 className='main-heading'>Friends</h3>
          <p className='mb-0'>Obtain a summary of all of your transactions.</p>
        </div>
      </div>
      <br />

      <div>
        <div>
          <div className='borrowed-part'> 
            <h3 className='friends-heading'>Borrowed From: </h3>
            <div className="friends-list">
              {friendData?.borrows?.length && friendData.borrows.map((friend) => (
                <Friend friend={friend} />
              ))}
            </div>
          </div>
          <div>
            <h3 className='friends-heading'>Lent To</h3>
            <div className='lent-part'>
              {friendData?.lends?.length && friendData.lends.map((friend) => (
                <Friend friend={friend} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
