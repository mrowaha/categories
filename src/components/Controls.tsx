import React from "react";
import classes from "./Controls.module.css";

import { useTreeRef, useAnimator} from "@/context/AppContext";
import type { AllowedZoomLevels } from "@/animator/engine";

import Button from "./Button";
import useOutsideAlerter from "@/hooks/useOutsideAlert";

function ZoomHandler () {

  const dropDownRef = React.useRef<HTMLDivElement | null>(null);
  const dropDownCallback = React.useCallback(() => {
    if (dropDownRef.current) {
      if (dropDownRef.current.hasAttribute("show")) {
        dropDownRef.current.removeAttribute("show");
      }
    }
  }, [dropDownRef])
  useOutsideAlerter(dropDownRef, dropDownCallback);
  /* maintain a list of zoom options on client side */
  const zoomOptions = React.useRef<AllowedZoomLevels[]>([
    25,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    125,
    150,
  ])

  const [activeZoom, setActiveZoom] = React.useState<AllowedZoomLevels>(100);
  const animator = useAnimator();
  const treeRef = useTreeRef();

  return (
    <div className={classes.zoom}>
      <Button 
        color="primary"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        }
        onClick={() => {
          const index = zoomOptions.current.indexOf(activeZoom);
          let nextIndex = index-1;
          if (nextIndex === -1) {
            nextIndex = zoomOptions.current.length-1;
          } else if (nextIndex === zoomOptions.current.length) {
            nextIndex = 0;
          }
          const zoomLevel = zoomOptions.current[nextIndex];
          setActiveZoom(zoomLevel);
          animator.onZoom(treeRef.current!, zoomLevel);
        }}
      />
      <div className={classes.dropdown}>
        <Button
          color="primary"
          text={`${activeZoom}%`}
          className={classes.zoomLevel}
          onClick={() => {
            if (dropDownRef.current) {
              dropDownRef.current.setAttribute("show", "");
            }
          }}
        />
        <div ref={dropDownRef} className={classes.dropdownMenu}>
          {
            React.Children.toArray(
              zoomOptions.current.map((value) => {
                return (
                  <div onClick={(e) => {
                    e.stopPropagation();
                    setActiveZoom(value);
                    animator.onZoom(treeRef.current!, value);
                  }}>
                    <div>{value}%</div>
                    {value === activeZoom ? 
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                     : <></>}
                  </div>
                )
              })
            )
          }
        </div>
      </div>
      <Button 
        color="primary"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        }
        onClick={() => {
          const index = zoomOptions.current.indexOf(activeZoom);
          let nextIndex = index+1;
          if (nextIndex === -1) {
            nextIndex = zoomOptions.current.length-1;
          } else if (nextIndex === zoomOptions.current.length) {
            nextIndex = 0;
          }
          const zoomLevel = zoomOptions.current[nextIndex];
          setActiveZoom(zoomLevel);
          animator.onZoom(treeRef.current!, zoomLevel);
        }}
      />
    </div>
  )
}

function Controls () {

  const animator = useAnimator();
  const treeRef = useTreeRef();

  React.useEffect(() => {
    animator.setTree(treeRef.current!);
  }, [animator])

  const handleCenterTree = React.useCallback(() => {
    animator.centerTree(treeRef.current as HTMLDivElement);
  }, [])

  return (
    <div className={classes.controls}>
      <Button 
        color="secondary"
        text="List View"
      />
      <Button 
        color="primary"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        }
        onClick={handleCenterTree}
      />
      <ZoomHandler />
    </div>
    
  )
}

export default Controls;