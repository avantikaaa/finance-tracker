import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);

  useEffect(()=>{
    fetch('http://localhost:4000/profile', {
      credentials:'include',
    }).then(response =>{
      response.json().then(userinfo=>{
        setUserInfo(userinfo);
      });
    });
  }, []);


  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials:'include',
      method:'POST'
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
        My Portal
      </Link>
      <nav>
        {username && (
          <>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login"> Login </Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
