import React from 'react';
import SidebarMenu from "../components/SidebarMenu/SidebarMenu";
import {Outlet} from "react-router-dom";

function Layout(props) {
    return (
        <main className={"flex w-screen h-screen overflow-hidden"}>
            <SidebarMenu/>
            <div className={"relative w-full p-16 h-full overflow-y-auto flex"}>
                <img src={"/bg-img.jpg"} className={"fixed top-0 left-0 w-full object-cover opacity-30"}/>
                <section className={"relative w-full"}>
                    <Outlet />
                </section>
            </div>
        </main>
    );
}

export default Layout;