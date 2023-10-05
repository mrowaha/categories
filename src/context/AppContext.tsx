import React from "react";

import AnimatorEngine from "@/animator/engine";
import type { AllowedZoomLevels } from "@/animator/engine";

export const useServices = () => React.useState<number>(0);
export const useActiveZoom = () => React.useState<AllowedZoomLevels>(100);

export interface AppStore {
  animator : AnimatorEngine;
  servicesState : ReturnType<typeof useServices>;
  // maintain a reference to the tree in the DOM
  treeRef : React.MutableRefObject<HTMLDivElement | null>;
  listViewRef : React.MutableRefObject<HTMLDivElement | null>;
  zoomState : ReturnType<typeof useActiveZoom>;  
}

const AppContext = React.createContext<null | AppStore>(null);

export const useServicesContext = () => {
  const {servicesState} = React.useContext(AppContext)!;
  return servicesState;
}

export const useAnimator = () => {
  const {animator} = React.useContext(AppContext)!;
  return animator;
}

export const useTreeRef = () => {
  const {treeRef} = React.useContext(AppContext)!;
  return treeRef;
}

export const useListViewRef = () => {
  const {listViewRef} = React.useContext(AppContext)!;
  return listViewRef;
}

export const useZoomContext = () => {
  const {zoomState} = React.useContext(AppContext)!;
  return zoomState;
}


export default AppContext;