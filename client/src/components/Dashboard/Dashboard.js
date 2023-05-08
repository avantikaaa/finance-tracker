import React, {useState, useEffect} from 'react';
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoneyBill, faCreditCard, faMoneyBillTransfer} from '@fortawesome/free-solid-svg-icons';
import "./css/Dashboard.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BarGraph from './BarGraph';
import Pipi from './Pipi';
import TransactionHistoryCard from './TransactionHistoryCard';
import Details from './Details';


function Dashboard(){
    const bar_options = [
        "Food",
        "Travel",
        "Shopping",
        "Medical",
        "Educational",
        "Peer Lending",
        "Miscellaneous",
        "Total",
      ];
      const [category, setCategory] = useState("Food");
      const [balanceData, setBalanceData] = useState();
      const [pieData, setPieData] = useState();
      const [previousData, setPreviousData] = useState();
      const [dues, setDues] = useState();
      useEffect(() => {
        Promise.all([
          fetch("http://localhost:4000/getBalance", {
            credentials: "include",
          }),
          fetch("http://localhost:4000/getCurrentExpense", {
            credentials: "include",
          }),
          fetch("http://localhost:4000/getDues", {
            credentials: "include",
          }),
        ])
          .then(([resBalance, resPieData, resDues]) =>
            Promise.all([
              resBalance.json(),
              resPieData.json(),
              resDues.json(),
            ])
          )
          .then(([dataBalance, dataPie, dataDues]) => {
            setBalanceData(dataBalance);
            setPieData(dataPie);
            setDues(dataDues);
          });
      }, []);
    
      useEffect(() => {
        fetch(`http://localhost:4000/getMonthly/${category}`, {
          credentials: "include",
        })
          .then((resPreviousData) => resPreviousData.json())
          .then((dataPrevious) => setPreviousData(dataPrevious));
      }, [category]);
    
    return(
      <div className='sap'>
          <div className='part1'>
            <div className='card-type-1'>
              <FontAwesomeIcon className='icon-3' icon={faMoneyBill}/>
              <div>
                <h3 className='card1-heading'>Balance</h3>
                <h3 className='card1-body'>Rs.{balanceData?.balance}</h3>
              </div>
            </div>

            <div className='card-type-1'> 
              <FontAwesomeIcon className='icon-3' icon={faCreditCard} />
              <div>
                <h3 className='card1-heading'>Credit</h3>
                <h3 className='card1-body'>Rs.{balanceData?.totalCred}</h3>
              </div>
            </div>

            <div className='card-type-1'>
              <FontAwesomeIcon className='icon-3' icon={faMoneyBillTransfer} /> 
              <div>
                <h3 className='card1-heading'>Debit</h3>
                <h3 className='card1-body'>Rs.{balanceData?.totalDebit}</h3>
              </div>
            </div>
          </div>
            <div className='part2'>
              <div className='card-type-2'>                 
                <h3 className='heading3 mb-3'>Monthly Expenditure</h3>
                <label>Choose a category for past analysis </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="ms-3 p-1">
                  {bar_options.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <BarGraph data={previousData} />
              </div>
              <div className='card-type-2'>
                <h3 className='heading3 mb-3'>Account Details</h3>
                <Details balance={balanceData} />
              </div>
            </div>
            <div className='part3'>
              <div className='card-type-3'>
                <h3 className='heading3 mb-3'>Sectors</h3>
                <Pipi pieData={pieData} />
              </div>
              <div className='card-type-3' id='upcoming'>
                <h3 className='heading3 mb-3'>Upcoming Payments</h3>
                <TransactionHistoryCard dues={dues} />
              </div>
                
            </div>
      </div>
    )
}


export default Dashboard;