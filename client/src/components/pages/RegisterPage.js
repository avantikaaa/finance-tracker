import { useState } from "react";
import './css/RegisterPage.css'
import RegisterImage1 from '../../images/RegisterImage1.svg'
import logo from '../../images/Logo.jpg'
import { Navigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // const [college, setCollege] = useState("");
  const [limit, setLimit] = useState(0)
  const years = [
    "B.Tech - First",
    "B.Tech - Second",
    "B.Tech - Third",
    "B.Tech - Fourth",
    "IDD - Fifth",
    "M.Tech",
    "PhD",
  ];
  // const [year, setYear] = useState(years[0]);
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password, name, limit}),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Registration successful! Please login");
      setRedirect(true);
    } else {
      alert("Username in already in use.");
    }
  }
  if(redirect){
    return <Navigate to= {"/login"} />
  }
  return (
    <div className="total">
      <div className="left-part">
        <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto voluptatum ratione natus consequatur necessitatibus fugit quae ea eveniet rem molestiae? Accusamus officia hic, sed alias excepturi incidunt? Quidem, voluptatum? Voluptate? Lorem ipsum, dolor sit amet consectetur</h4>
        <img src={RegisterImage1} alt="Pay" className='loginImage1'/>
        <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto voluptatum ratione natus consequatur necessitatibus fugit quae ea eveniet rem molestiae? Accusamus officia hic, sed alias excepturi incidunt? Quidem, voluptatum? Voluptate?</h4>
      </div>

      <div className="right-part">
        <br /><br />
        <div className="ms-5">
          <Link to="/" className="title"><img src={logo} alt="Pay" className='logo'/><span className="logo-name"> FinMate</span></Link>
        </div>
        <br /><br /><br />

        <h4 className='text-center'>Sign Up</h4>
        <form className="register mx-auto p-4 SignUpForm" onSubmit={register}>
          <div className="form-part">
            <label>Name</label>
            <input  type="text" className="form-control"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>

          {/* <div className="form-part">
            <label>College</label>
            <input type="text" className="form-control"
              value={college}
              onChange={(ev) => setCollege(ev.target.value)}
            />
          </div> */}

          <div className="form-part">
            <label>Username</label>
            <input type="text" className="form-control"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </div>

          <div className="form-part">
            <label>Password</label>
            <input type="password" className="form-control"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          {/* <div className="form-part">
            <label>Choose an year of study </label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="form-select">
              {years.map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </div> */}
      
          <div className="form-part">
            <label>Set a monthly expenditure limit </label>
            <input type="number" className="form-control" placeholder="5000"
              value={limit}
              onChange={(ev) => setLimit(ev.target.value)}
            />
          </div>

          <button className="login-button"> Register </button>
          <Link className="signup-link" to="/login"><span className="text-dark">Already a user?</span> Log in</Link>
        </form>
      </div>
    </div>
  );
}
