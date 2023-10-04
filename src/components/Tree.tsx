import React from "react";
import classes from "./Tree.module.css";
import Button from "./Button";

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  direction : "top" | "bottom" | "left" | "right";
  icon : React.ReactNode;
  alignment : "vertical" | "horizontal";
}

function ArrowButton(props : ArrowButtonProps) {
  return (
    <div className={
      `${
        {
          "top" : classes.topArrow,
          "bottom" : classes.bottomArrow,
          "left" : classes.leftArrow,
          "right" : classes.rightArrow
       }[props.direction]
      } ${classes.directionArrow}`
      }
      // @ts-ignore
      align={props.alignment}
    >
      <Button 
        color="primary"
        icon={props.icon}
      />
    </div>
  )
}

function Tree() {
  return (
    <div
      style={{
        width : "200px",
        height : "200px",
        backgroundColor : "blue"
      }}
    />
  )
}

function TreeContainer () {
  return (
    <div className={classes.treeContainer}>
      {
        React.Children.toArray(
          [
            {
              dir : "top", svg :                   
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            },
            {
              dir : "bottom", svg :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            },
            {
              dir : "left", svg : 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            },
            {
              dir : "right", svg :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            }
          ].map(({dir, svg}) => {
            return (
              <ArrowButton 
                direction={dir as ArrowButtonProps["direction"]}
                icon={svg as React.ReactNode}
                alignment={dir === "top" || dir === "bottom" ? "horizontal" : "vertical"}
              />
            )
          })
        )
      }
      <div className={classes.drawingBox}>
        <Tree />
      </div>
    </div>
  )
}

export default TreeContainer;