import { useState } from "react";
import { Navigate } from "react-router-dom";
export default function AddExpense() {
  const options = [
    "Food",
    "Medical",
    "Educational",
    "Travel",
    "Miscellaneous",
  ];

  const [amount, setAmount] = useState();
  const [to, setTo] = useState();
  const [date, setDate] = useState();
  const [category, setCategory] = useState(options[0]);
  const [redirect, setRedirect] = useState(false);

  async function submit(ev) {
    ev.preventDefault();
    const resp = await fetch("http://localhost:4000/addExpense", {
      method: "POST",
      credentials:"include",
      body: JSON.stringify({ amount, to, date, category }),
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/homepage"} />;
  }
  return (
    <form onSubmit={submit}>
      <h2>Add an expense</h2>
      <input
        type="number"
        placeholder={"Amount"}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder={"To"}
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        type="date"
        placeholder={"Date"}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label>Choose a category for the transaction </label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {options.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>

      <button type="submit" style={{ marginTop: "6px" }}>
        Add Transaction
      </button>
    </form>
  );
}
