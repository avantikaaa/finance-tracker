import { useState } from "react";
import { Navigate } from "react-router-dom";
export default function AddLending() {

  const [amount, setAmount] = useState();
  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const [interest, setInterest] = useState();
  const [date, setDate] = useState();
  const [redirect, setRedirect] = useState(false);
  const [dueDate, setDueDate] = useState();

  async function submit(ev) {
    ev.preventDefault();
    const resp = await fetch("http://localhost:4000/addLending", {
      method: "POST",
      body: JSON.stringify({ amount, to, from, interest, date, dueDate }),
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
      <h2>Add a transaction</h2>
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
        type="text"
        placeholder={"From"}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        placeholder={"Interest Rate"}
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />

      <input
        type="date"
        placeholder={"Date"}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="date"
        placeholder={"Due Date for Peer Loan"}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button type="submit" style={{ marginTop: "6px" }}>
        Add transaction
      </button>
    </form>
  );
}
