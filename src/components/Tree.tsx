import React from "react";
import classes from "./Tree.module.css";

import { useTreeRef, useAnimator} from "@/context/AppContext";

import Button from "./Button";
import TreeNode from "./TreeNode";

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
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
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
      className={classes.treeWrapper}
      ref={treeRef}
    >
      <div className={classes.tree}>
        <TreeNode 
          root
          // @ts-ignore
          level={-1}
          isService={false}
          // revalidateHorizontals={() => {}}
        />
      </div>
      <div className={classes.treeCanvasBackdrop} />
    </div>
  )

}) 


function TreeContainer () {

  const containerRef = React.useRef<HTMLDivElement>(null);
  const drawingBoxRef = React.useRef<HTMLDivElement>(null);
  const treeRef = useTreeRef();
  const actionInterval = React.useRef<any>(null);

  const verticalTranslate = React.useRef<number>(0);
  const horizontalTranslate = React.useRef<number>(0);

  const handleDrawingBoxMove = (dir : "top" | "bottom" | "left" | "right") => {
    if (treeRef.current === null) return;

    switch(dir) {
      case "top":
        treeRef.current.style.transform = `translate(${horizontalTranslate.current}px, ${verticalTranslate.current+10}px)`;
        verticalTranslate.current += 10; 
        break;
      case "bottom":
        treeRef.current.style.transform = `translate(${horizontalTranslate.current}px, ${verticalTranslate.current-10}px)`;
        verticalTranslate.current -= 10;
        break;
      case "left":
        treeRef.current.style.transform = `translate(${horizontalTranslate.current+10}px, ${verticalTranslate.current}px)`;
        horizontalTranslate.current += 10;  
        break;
      case "right":
        treeRef.current.style.transform = `translate(${horizontalTranslate.current-10}px, ${verticalTranslate.current}px)`;
        horizontalTranslate.current -= 10;  
        break;  
    }
  }

  const handleDrawingBoxMoveWrapper  = (dir : ArrowButtonProps["direction"]) => {
    actionInterval.current = setInterval(handleDrawingBoxMove, 25, dir);
  }

  React.useEffect(() => {
    const resetTranslation = () => {
      horizontalTranslate.current = 0;
      verticalTranslate.current = 0;
    }

    window.addEventListener("tree:resetBox", resetTranslation);
    return () => window.removeEventListener("tree:resetBox", resetTranslation)
  }, [])


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
                // @ts-ignore
                onMouseEnter={() => handleDrawingBoxMoveWrapper(dir)}
                onMouseLeave={() => {
                  if (actionInterval.current) {
                    clearInterval(actionInterval.current);
                    actionInterval.current = null;
                  }
                }}
              />
            )
          })
        )
      }
      <div ref={drawingBoxRef} style={{gridArea : "draw", overflow : "hidden"}}>
        <div  className={classes.drawingBox}>
          <Tree 
            ref={containerRef}
          />
          <div id="drawing-board-center" 
            style={{
              width : containerRef.current?.style.width, 
              height : containerRef.current?.style.height,
              backgroundColor : "none",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default TreeContainer;