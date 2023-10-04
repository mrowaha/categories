import React, { use } from "react";
import classes from "./Tree.module.css";

import { useTreeRef, useAnimator} from "@/context/AppContext";

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

const Tree = React.forwardRef<HTMLDivElement, {}>((props, container) => {

  const treeRef = useTreeRef();
  const animator = useAnimator();
  const isClicked = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (treeRef.current === null) return;
    
    animator.setTree(treeRef.current);

    const onMouseDown = (e : MouseEvent) => {
      isClicked.current = true;
      animator.onTreeClick(e);
    }

    const onMouseUp = (e : MouseEvent) => {
      isClicked.current = false;
      animator.onTreeRelease(treeRef.current!, e);
    }

    const onMouseMove = (e : MouseEvent) => {
      if (treeRef.current !== null) {
        if (!isClicked.current) return;
        animator.onTreeDrag(treeRef.current!, e);
      }
    }

    treeRef.current.addEventListener("mousedown", onMouseDown);
    treeRef.current.addEventListener("mouseup", onMouseUp);
    // @ts-ignore
    container.current.addEventListener("mousemove", onMouseMove);
    // @ts-ignore
    container.current.addEventListener("mouseleave", onMouseUp);

    return () => {
      treeRef.current?.removeEventListener("mousedown", onMouseDown);
      treeRef.current?.removeEventListener("mouseup", onMouseUp);
      // @ts-ignore
      container.current.removeEventListener("mousemove", onMouseMove);
      // @ts-ignore
      container.current.removeEventListener("mouseleave", onMouseUp);
    }
  }, [])


  return (
    <div
      style={{
        width : "200px",
        height : "200px",
        backgroundColor : "blue",
        position : "absolute",
        cursor : "pointer"
      }}
      ref={treeRef}
    />
  )

}) 



function TreeContainer () {

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={classes.treeContainer} ref={containerRef}>
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
        <Tree 
          ref={containerRef}
        />
        <div id="drawing-board-center" 
          style={{
            width : containerRef.current?.style.width, 
            height : containerRef.current?.style.height,
            backgroundColor : "green",
          }}
        />
      </div>
    </div>
  )
}

export default TreeContainer;