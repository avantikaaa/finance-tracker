import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./components/pages/RegisterPage";
import { UserContextProvider } from "./contexts/UserContext";
import AddTransaction from "./components/pages/AddTransaction";
import IntroPage from "./components/pages/IntroPage";
import Peer from "./components/pages/Peer"
import Transaction from "./components/pages/Transaction";
import Friends from "./components/pages/Friends";
import ReminderScreen from "./components/pages/ReminderScreen"
import Logoutpop from "./components/pages/Logoutpop"
import Settings from "./components/pages/Settings";
import ExpensesPage from "./components/pages/ExpensesPage";
import SavingsCalculator from "./components/pages/SavingsCalculator"
import Dashboard from "./components/Dashboard/Dashboard"
import LeftNav from "./components/Layout/LeftNav";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path = "/intro" element = {<IntroPage/>}></Route>
        <Route index element = {<IntroPage/>}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path = "/homepage" element={<Dashboard />}></Route>
          <Route path ="/create" element = {<ExpensesPage/>}></Route>   
          <Route path = "/peer" element = {<Peer/>}></Route>
          <Route path = "/transaction" element = {<Transaction/>}></Route>
          <Route path = "/friends" element = {<Friends/>}></Route>
          <Route path = "/reminder" element = {<ReminderScreen/>}></Route>
          <Route path = "/logout" element = {<Logoutpop/>}></Route>
          <Route path = "/settings" element = {<Settings/>}></Route>
          <Route path = "/savings" element = {<SavingsCalculator/>}></Route>
          </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
