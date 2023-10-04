import AnimatorEngine from "@/animator/engine";
import React from "react";

export const useServices = () => React.useState<number>(0);

export interface AppStore {
  animator : AnimatorEngine;
  servicesState : ReturnType<typeof useServices>;
}

const AppContext = React.createContext<null | AppStore>(null);

export const useServicesContext = () => {
  const {servicesState} = React.useContext(AppContext)!;
  return servicesState;
}

export default AppContext;