import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import React from 'react'
import './css/Header.css'
import {Navbar, Nav} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/Logo.jpg'

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials:'include',
      method:'POST'
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;

  return (
    <div>
        <div className="nav">
          <Link to="/" className="title"><img src={logo} alt="Pay" className='logo'/><span className="logo-name"> FinMate</span></Link>
          <Navbar expand="md">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto nav2">
                {username && (
                  <>
                    <Link to="/create"> Add Transaction </Link>
                    <a onClick={logout}>Logout</a>
                  </>
                )}
                {!username && (
                  <>
                    <Link className="login" to="/login"><FontAwesomeIcon className='icons' icon={faArrowRightToBracket}/><span className='items login-word'> Login</span></Link>
                    <Link className="signUp" to="/register"><FontAwesomeIcon className='text-white icons' icon={faUserPlus}/><span className='items signUp-word'> Sign Up</span></Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
    </div>
  );
}
