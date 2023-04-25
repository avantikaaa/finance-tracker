import { useState } from "react";
export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
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
  const [year, setYear] = useState(years[0]);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password, name, college, year, limit}),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Registration successful! Please login");
    } else {
      alert("Registration failed! Try again");
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <input
        type="text"
        placeholder="College"
        value={college}
        onChange={(ev) => setCollege(ev.target.value)}
      />

      <label>Choose a year of study </label>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        {years.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>

      
      <input
        type="number"
        placeholder="Set a monthly expenditure limit"
        value={limit}
        onChange={(ev) => setLimit(ev.target.value)}
      />


      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      ></input>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      ></input>

      <button> Register </button>
    </form>
  );
}
