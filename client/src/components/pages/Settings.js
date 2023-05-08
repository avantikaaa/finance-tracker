import React, {useState, useContext, useEffect} from 'react'
import './css/Settings.css'
import dp from '../../images/ProfilePicture.svg'
import { UserContext } from '../../contexts/UserContext';
const years = [
  "B.Tech - First",
  "B.Tech - Second",
  "B.Tech - Third",
  "B.Tech - Fourth",
  "IDD - Fifth",
  "M.Tech",
  "PhD",
];

function Settings() {
  const {userInfo, setUserInfo} = useContext(UserContext)
  const [name, setName] = useState('');
  // const [college, setCollege ] = useState('');
  // const [year, setYear] = useState(years[0]);
  const [limit, setLimit] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(()=>{
    fetch("http://localhost:4000/getUserInfo", {
      credentials:"include",
    }).then((res)=>res.json()).then((userDoc)=>{
      setName(userDoc.name);
      // setCollege(userDoc.college);
      // setYear(userDoc.year);
      setLimit(userDoc.limit);
      setBalance(userDoc.balance);
    });   
  }, [])

  async function submit(ev){
    ev.preventDefault();
    const resp = await fetch("http://localhost:4000/updateInfo", {
      method: "PATCH",
      credentials:"include",
      body: JSON.stringify({ name, limit, balance}),
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      alert("Updated Successfully")
    }
  }
  return (
    <div className='settings'>
      {/* <h3>Settings</h3> */}
      <div className='d-flex align-items-center mb-3'>
        <img src={dp} className="dp"/>
        <div>
          <p className='text-dark mb-0 ms-3'>{userInfo?.username}</p>
        </div>
      </div>
      <form onSubmit = {submit}>
        <div>
          <label className='label2' htmlFor='name'>Name</label>
          <input type="text" name="name" id="name" className="form-control" value={name} onChange = {(e)=>setName(e.target.value)}/>
        </div>
        {/* <div>
          <label className='label2' htmlFor='clg'>College</label>
          <input type="text" name="clg" id="clg" className="form-control" value={college} onChange ={(e) => setCollege(e.target.value)} />
        </div> */}
        {/* <div className="form-part mb-0 pb-0">
            <label className='label2'>Choose an year of study </label>
            <select className="form-select" value={year} onChange = {(e)=>setYear(e.target.value)}>
              {years.map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
        </div> */}
        <div>
          <label className='label2' htmlFor='limit'>Limit</label>
          <input type="number" name="limit" id="limit" className="form-control" value={limit} onChange={(e)=>setLimit(e.target.value)}/>
        </div>

        <div>
          <label className='label2' htmlFor='limit'>Balance</label>
          <input type="number" name="limit" id="limit" className="form-control" value={balance} onChange={(e)=>setBalance(e.target.value)}/>
        </div>
        <br /><br />

        <div className='buttons'>
          <button className='cancel-button'>Cancel</button>
          <button className='save-button' type='submit'>Save changes</button>
        </div>
      </form>
    </div>
  )
}

export default Settings