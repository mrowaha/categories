import React from "react";
import classes from "./Header.module.css";

import { useServicesContext } from "@/context/AppContext";

import Chip from "./Chip";

interface TitleProps {
  title : string;
}

function Title (props : TitleProps) {

  const [services, _] = useServicesContext();

  return (
    <div>
      <div className={classes.titleContainer}>
        <h1 className={classes.title}>
          {props.title}
        </h1>
        <Chip
          style={{
            backgroundColor : "orange",
            color : "white",
            fontWeight : "bold",
            height : "1rem",
            padding : "0.35rem"
          }}
        >{services}</Chip>
      </div>
      <small style={{display : "flex"}}>
        <span><Chip style={{backgroundColor : "#cf6679", width : "2.5px", height : "2.5px"}}> </Chip></span> 
          : is a service
      </small>
   </div>
  )
}


function Header ({children} : {children : React.ReactNode}) {
  return (
    <header className={classes.header}>
      <Title 
        title="Services"
      />
      {children}
    </header>
  )
}

export default Header;