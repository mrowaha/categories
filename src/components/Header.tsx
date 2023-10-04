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