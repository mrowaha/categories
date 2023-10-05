import React from "react";

import Header from "@/components/Header";
import Controls from "@/components/Controls";
import TreeContainer from "@/components/Tree";

export default function Home() {
  
  return (
    <>
      <Header>
        <Controls />      
      </Header>
      <TreeContainer />
    </>
  )
}
