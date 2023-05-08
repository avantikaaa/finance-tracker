import React, { useState, useContext} from 'react';
import { Navigate } from 'react-router-dom';
import './css/Logoutpop.css';
import { UserContext } from '../../contexts/UserContext';

function LogoutPopup(props) {
  return (
    <div className="logout-popup">
      <p className='confirmation'>Are you sure you want to log out?</p>
      <button className='cancel-button' onClick={props.onCancel}>No</button>
      <button className='save-button' onClick={props.onConfirm}>Yes</button>
    </div>
  );
}

function Logoutpop() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  }

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  }

  const handleConfirmLogout = () => {
    fetch('http://localhost:4000/logout', {
      credentials:'include',
      method:'POST'
    }).then((res) => res.json()).then((info)=>{
      setUserInfo(null);
      setShowLogoutPopup(false);
      setRedirect(true);
    })
  }
  if(redirect){
    return <Navigate to = "/intro" replace = {true}/>
  }
  return (
    <div className="button">
      <button onClick={handleLogout}>Logout</button>
      {showLogoutPopup && <LogoutPopup onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />}
    </div>
  );
}

export default Logoutpop;