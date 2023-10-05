import React from "react";
import AnimatorEngine from "@/animator/engine";
import AppContext, {useActiveZoom, useServices, useZoomContext} from "@/context/AppContext";
import type { AppStore } from "@/context/AppContext";

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ListView from "@/components/ListView";

export default function App({ Component, pageProps }: AppProps) {

  const [animator, _] = React.useState<AnimatorEngine>(new AnimatorEngine());
  const servicesState = useServices();
  const treeRef = React.useRef<HTMLDivElement | null>(null);
  const zoomState = useActiveZoom();
  const listViewRef = React.useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider value={{
      servicesState : servicesState,
      animator : animator,
      treeRef : treeRef,
      zoomState : zoomState,
      listViewRef : listViewRef
    } as AppStore}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}
