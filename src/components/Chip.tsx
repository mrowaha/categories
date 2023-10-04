import React from "react";
import classes from "./Chip.module.css";

interface ChipProps {
  children : React.ReactNode;
  style? : React.CSSProperties;
}

function Chip(props : ChipProps) {
  return (
    <div 
      className={classes.chipContainer}
      style={props.style}
      >
      {props.children}
    </div>
  )
}

export default Chip;