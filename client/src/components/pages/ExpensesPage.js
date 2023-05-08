import React, { useState } from "react";
import "./css/ExpensesPage.css";
import { Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";

function ExpensesPage() {
  const expense_options = [
    "Food",
    "Medical",
    "Educational",
    "Travel",
    "Shopping",
    "Other",
  ];
  const income_options = [
    "Home", 
    "Stipend", 
    "Scholarship", 
    "Award",
    "Other"
  ]
  const [amount, setAmount] = useState();
  const [to, setTo] = useState();
  const [category, setCategory] = useState(expense_options[0]);
  const [redirect, setRedirect] = useState(false);
  const [from, setFrom] = useState();
  const [selectedOption, setSelectedOption] = useState("Expense");
  const [date, setDate] = useState(new Date());

  async function submitExpense(ev) {
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

  async function submitIncome(ev) {
    ev.preventDefault();
    const resp = await fetch("http://localhost:4000/addIncome", {
      method: "POST",
      credentials:"include",
      body: JSON.stringify({ amount, from, date, category }),
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      setRedirect(true);
    }
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  if (redirect) {
    return <Navigate to={"/homepage"} />;
  }
  return (
    <div className="expenses">
      <div className='d-flex align-items-center'>
          <div>
            <FontAwesomeIcon className='icon-3' icon={faIndianRupee}/>
          </div>
          <div className='ms-3'>
            <h3 className='main-heading'>Add expenses</h3>
            <p className="pb-0 mb-0">Track your expenses and assess your spending habits.</p>
          </div>
      </div>
      <br />
      <div className="peer-body">
        <form className="form-group">
          <div className="radio-button">
            <input type="radio" name="option" value="Expense" checked={selectedOption === "Expense"} onChange={handleOptionChange}/>
              <label className='ms-2'>Expense</label>
          </div>

          <div className="radio-button">
            <input type="radio" name="option" value="Income" checked={selectedOption === "Income"} onChange={handleOptionChange}/>
            <label className='ms-2'>Income</label>
          </div>
        </form>
        <br />
        <div className="label-container">
          {selectedOption === "Expense" ? (
          <div className="label Expense">
            <form onSubmit={submitExpense}>
              <div>
                <label htmlFor="Title">Paid to</label>
                <input className="form-control" type="text" id="name" name="name" value = {to} onChange = {(e) => setTo(e.target.value)}/>
              </div>
              <br />
              <div>
                <label htmlFor="amount"> Amount </label>
                <input className="form-control" type="number" id="amount" name="amount" value= {amount} onChange = {(e) => setAmount(e.target.value)}/>
              </div>
              <br />
              <div>
                <label htmlFor="date"> Date of Transaction </label>
                <DatePicker className="form-control" selected={date} value={date} onChange={(e) => setDate(e)} dateFormat = "dd/MM/yyyy"/>
              </div>
              <br />
              <div>
                <div>
                  <label htmlFor="category" value={category} onChange={(e) => setCategory(e.target.value)}>Category</label>
                </div>
                <select className="form-select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {expense_options.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <br />
              <button className="calculate-button" type="submit">Add Expense</button>
            </form>
          </div>
              ) : (
          <div className="label Income">
            <form onSubmit={submitIncome}>
              <div>
                <label htmlFor="Title"> Received from </label>
                <input className="form-control" type="text" id="name" name="name" value = {from} onChange = {(e) => setFrom(e.target.value)} />
              </div>
              <br />
              <div>
                <label htmlFor="amount">Amount:</label>
                <input className="form-control" type="number" id="amount" name="amount" value = {amount} onChange = {(e)=> setAmount(e.target.value)}/>
              </div>
              <br />
              <div>
                <label htmlFor="date">Date of Transaction</label>
                <DatePicker className="form-control" selected={date}  value ={date} onChange={(e) => setDate(e)} dateFormat = "dd/MM/yyyy"/>
              </div>
              <br />
              <div>
                <div>
                  <label htmlFor="category">Category</label>
                </div>
                <select className="form-select" id="category"value = {category}onChange = {(e)=>setCategory(e.target.value)}>
                  {income_options.map((value) => (
                    <option value={value} key={value}>
                      {value}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <button className="calculate-button" type="submit"> Add Income </button>
            </form>
          </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;
