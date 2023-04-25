import { useEffect, useContext, useState } from "react";
import DetailsCard from "../components/DetailsCard";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { PieChart } from "react-minimal-pie-chart";
import { differenceInCalendarDays } from "date-fns";
export default function HomePage() {
  const options = [
    "Travel",
    "Food",
    "Medical",
    "Educational",
    "Peer-Lending",
    "Miscellaneous",
    "Total",
  ];
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [transactions, setTransactions] = useState({});
  const [currentTrend, setCurrentTrend] = useState({});
  const [previousData, setPreviousData] = useState({});
  const [labels, setLabels] = useState();
  const [data, setData] = useState();
  const [dues, setDues] = useState();
  const [category, setCategory] = useState("Food");
  const [redirect, setRedirect] = useState(false);
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/getCurrentExpense", {
        credentials: "include",
      }),
      fetch("http://localhost:4000/getCurrentTr", {
        credentials: "include",
      }),
      fetch("http://localhost:4000/getDues", {
        credentials: "include",
      }),
    ])
      .then(([resTransactions, resCurrentTrend, resDues]) =>
        Promise.all([
          resTransactions.json(),
          resCurrentTrend.json(),
          resDues.json(),
        ])
      )
      .then(([dataTransactions, dataCurrentTrend, dataDues]) => {
        setTransactions(dataTransactions);
        setCurrentTrend(dataCurrentTrend);
        setDues(dataDues);
      });
  }, []);


  // useEffect(() => {
  //   fetch(`http://localhost:4000/getMonthly/${category}`, {
  //     credentials: "include",
  //   })
  //     .then((resPreviousData) => resPreviousData.json())
  //     .then((dataPrevious) => setPreviousData(dataPrevious));
  // }, [category]);

  function getAmount(amount, interest, date, dueDate) {
    const diff = differenceInCalendarDays(new Date(dueDate), new Date(date));
    const num_months = diff / 30.0;
    const amt = amount * Math.pow(1 + interest / 100.0, num_months);
    return amt;
  }

  if (userInfo) {
    return (
      <>
                  <Link to="/addLending"> Add Lending Transaction </Link>
                  <Link to="/addExpense"> Add Expense </Link>
                  <Link to="/addIncome"> Add Income </Link>

        {userInfo ? <h1>Hello {userInfo.username}</h1> : <></>}
        <h2>Upcoming payments are as follows:</h2>
        <ul>
          {dues?.length > 0 &&
            dues.map((due) => (
              <li>
                Pay {due.from} an amount ={" "}
                {getAmount(due.amount, due.interest, due.date, due.dueDate)} at
                date = {due.dueDate}
              </li>
            ))}
        </ul>
        {currentTrend.bal?.length > 0 && (
          <h1>
            {" "}
            Your current balance, expenses and limit is{" "}
            {currentTrend.bal[0].balance},{" "}
            {currentTrend.exp.length > 0 ? currentTrend.exp[0].amount : 0} and{" "}
            {currentTrend.bal[0].limit}
          </h1>
        )}

        <h2>Credits are below</h2>
        {transactions.clist?.length > 0 &&
          transactions.clist.map((transaction) => (
            <DetailsCard {...transaction} />
          ))}
        <h2>Debits are below</h2>

        {transactions.dlist?.length > 0 &&
          transactions.dlist.map((transaction) => (
            <DetailsCard {...transaction} />
          ))}
        <h2>Lending transactions are below</h2>

        {transactions.lending?.length > 0 &&
          transactions.lending.map((transaction) => (
            <DetailsCard {...transaction} />
          ))}

        {currentTrend.pie_data?.length > 0 && (
          <PieChart
            animate="true"
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            data={[
              {
                title: currentTrend.pie_data[0]?._id,
                value: currentTrend?.pie_data[0]?.amount,
                color: "#E38627",
              },
              {
                title: currentTrend.pie_data[1]?._id,
                value: currentTrend?.pie_data[1]?.amount,
                color: "#C13C37",
              },
            ]}
          />
        )}

        <label>Choose a category for past analysis </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {options.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
        <h2>Past Transactions for histogram are</h2>
        <ul>
          {previousData?.length > 0 &&
            previousData.map((data) => (
              <li>
                Month - {months[data._id]}, and amount = {data.amount}
              </li>
            ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <Navigate to={"/"} />
    </>
  );
}
