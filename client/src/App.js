import "./App.css";
import Post from "./components/DetailsCard";
import Header from "./components/Header";
import AddLending from "./components/AddLending";
import AddIncome from "./components/AddIncome";
import AddExpense from "./components/AddExpense";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./contexts/UserContext";
import IntroPage from "./pages/IntroPage";
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path= "/homepage" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path ="/addLending" element = {<AddLending />}></Route> 
          <Route path ="/addExpense" element = {<AddExpense/>}></Route>
          <Route path = "/addIncome" element = {<AddIncome />}></Route>
          <Route index element = {<IntroPage />}></Route>
          <Route path = "/intro" element = {<IntroPage/>}></Route>
          </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
