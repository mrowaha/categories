import React from "react";
import classes from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  text? : string;
  icon? : React.ReactNode;
  color : "primary" | "secondary";
}

function Button(props : ButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  
  React.useLayoutEffect(() => {
    if (buttonRef.current !== null) {
      buttonRef.current.setAttribute("variant", props.color)
    }
  }, [props.color])

  return (
    <button 
      className={`${classes.button} ${props.className ? props.className : ""}`}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      style={{...props.style}}
      ref={buttonRef}
    >
      {props.text}
      {props.icon &&
        <div style={{
          height : "100%",
          width : "20px"
        }}>
          {props.icon}
        </div>
      }
    </button>
  )
}

export default Button;