import React from "react";
import AnimatorEngine from "@/animator/engine";
import AppContext, {useServices} from "@/context/AppContext";
import type { AppStore } from "@/context/AppContext";

import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {

  const [animator, _] = React.useState<AnimatorEngine>(new AnimatorEngine());
  const servicesState = useServices();
  const treeRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <AppContext.Provider value={{
      servicesState : servicesState,
      animator : animator,
      treeRef : treeRef
    } as AppStore}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}
