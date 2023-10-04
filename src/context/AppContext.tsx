import AnimatorEngine from "@/animator/engine";
import React from "react";

export const useServices = () => React.useState<number>(0);

export interface AppStore {
  animator : AnimatorEngine;
  servicesState : ReturnType<typeof useServices>;
  // maintain a reference to the tree in the DOM
  treeRef : React.MutableRefObject<HTMLDivElement | null>;
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


export default AppContext;