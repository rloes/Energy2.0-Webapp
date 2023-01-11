import React from 'react';
import {ContactPage, Dashboard, Person, Phone, RequestQuote, Settings, SolarPower} from "@mui/icons-material";
import {Link} from "react-router-dom";
import StyledButton from "../StyledButton";

const menuStructure = {
    "Verwaltung": [
        {name: "Dashboard", link: "", icon: <Dashboard/>},
        {name: "Kunden", link: "/kunden/erstellen", icon: <Person/>},
        {name: "Solaranlagen", link: "/solaranlagen", icon: <SolarPower/>},
        {name: "Tarife", link: "", icon: <RequestQuote/>},
    ],
    "Support": [
        {name: "Kontakt", link: "", icon: <Phone/>},
        {name: "Impressum", link: "", icon: <ContactPage/>}
    ]
}

function SidebarMenu(props) {
    return (
        <aside className={"w-[25vw] px-5 flex flex-col justify-between items-start max-w-[300px] h-screen"}>
            <div className={"flex flex-col justify-start items-center gap-3"}>
                <h2 className={"uppercase"}>
                    Energy 2.0
                </h2>
                <hr className={"border-b-1 border-black w-full"}/>
                <img src={"/logo-fb.png"} className={""}/>
            </div>
            <nav className={"flex flex-col justify-between items-start gap-0.5"}>
                {
                    Object.entries(menuStructure).map(([key, buttons], index) => (
                        <React.Fragment>
                            <h3 className={"text-[1.5rem] font-semibold"}>
                                {key}
                            </h3>
                            {buttons.map((button) => (
                                <Link to={button.link}>
                                    <StyledButton startIcon={button.icon} className={"font-medium"}>
                                        {button.name}
                                    </StyledButton>
                                </Link>
                            ))}
                            {index < Object.entries(menuStructure).length - 1 &&
                                <hr className={"border-b-1 border-black w-full"}/>
                            }
                        </React.Fragment>
                    ))
                }
            </nav>
            <StyledButton endIcon={<Settings/>}>
                Administrator
            </StyledButton>
        </aside>
    );
}

export default SidebarMenu;