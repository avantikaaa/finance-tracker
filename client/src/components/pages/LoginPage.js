import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import {UserContext} from '../../contexts/UserContext';
import LoginImage1 from '../../images/LoginImage1.svg'
import logo from '../../images/Logo.jpg'
import { Link } from "react-router-dom";


import './css/LoginPage.css'

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(ev){
        ev.preventDefault();
        const resp = await fetch('http://localhost:4000/login', {
            method : 'POST',
            body : JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });
        if(resp.ok){
            resp.json().then(userInfo =>{
                setUserInfo(userInfo);
                setRedirect(true);
            });
        }else{
          alert('Invalid Credentials')
        }
    }
    if(redirect){
        return <Navigate to= {"/homepage"} replace={true} />
    }
    return (
        <div className="total">
            <div className="left-part">
                <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto voluptatum ratione natus consequatur necessitatibus fugit quae ea eveniet rem molestiae? Accusamus officia hic, sed alias excepturi incidunt? Quidem, voluptatum? Voluptate? Lorem ipsum, dolor sit amet consectetur</h4>
                <img src={LoginImage1} alt="Pay" className='loginImage1'/>
                <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto voluptatum ratione natus consequatur necessitatibus fugit quae ea eveniet rem molestiae? Accusamus officia hic, sed alias excepturi incidunt? Quidem, voluptatum? Voluptate?</h4>
            </div>
            <div className="right-part">
                <br /><br />
                <div className="ms-5">
                    <Link to="/" className="title"><img src={logo} alt="Pay" className='logo'/><span className="logo-name"> FinMate</span></Link>
                </div>
                <br /><br /><br />
                <form onSubmit = {login} className="p-4 loginForm">
                    <h4 className='pb-4 text-center'>Login</h4><br />
                    <div className="mb-3">
                            <label>Username</label>
                            <input type="text" className="form-control"
                            value={username}
                            onChange = {ev => setUsername(ev.target.value)}
                        />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control"
                            value={password}
                            onChange = {ev=> setPassword(ev.target.value)}
                        />
                        </div>
                        <div>
                            <br />
                            <button className="login-button"> Login </button>
                        </div>
                    <Link className="signup-link" to="/register"><span className="text-dark">Don't have an account?</span> Sign Up</Link>
                </form>

            </div>

        </div>
    );
}