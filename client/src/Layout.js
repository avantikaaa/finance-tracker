import { Outlet } from "react-router-dom";
import Header from "./components/Layout/Header";
import LeftNav from "./components/Layout/LeftNav"

export default function Layout({user}){
    return (
        <main>
            <LeftNav/>
            {/* <Header /> */}
            <Outlet />
        </main>
    );
}