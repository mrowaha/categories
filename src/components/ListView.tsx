import React from "react"
import classes from "./ListView.module.css";
import treeClasses from "./TreeNode.module.css";

import type { TreeListElement } from "@/animator/engine";
import { useTreeRef, useAnimator } from "@/context/AppContext";

import Chip from "./Chip";

interface TreeListItemProps {
  element : TreeListElement | null;
}

function TreeListItem(props : TreeListItemProps) {
  
  if (props.element === null) {
    return (
      <div>Tree is Emtpy</div>
    )
  }
  
  return (
    <div className={classes.listItem}>
      <h3 className={classes.listItemTitle}>{props.element.name}         
        <Chip style={{backgroundColor : props.element.type === "category" ? "orange" : "#2196f3", color : "white"}}>
          {props.element.type}
        </Chip>
      </h3>
      <hr />
      <div className={classes.listItemChildren}>
        {
          React.Children.toArray(
            props.element.children.map(child => (
              <TreeListItem 
                element={child}
              />
          )))
        }
      </div>
    </div>
  )
}


interface ListViewProps {
  triggerRender : {}
}
const ListView = React.forwardRef<HTMLDivElement, ListViewProps>((props, modalRef) => {
  
  const [treeSnapshot, setTreeSnapshot] = React.useState<TreeListElement | null>(null);

  const treeRef = useTreeRef();
  const animator = useAnimator();

  React.useEffect(() => {
    const treeJson = animator.getTreeSnapshot(
      treeRef.current!,
      treeClasses.nodeChildren,
      treeClasses.treeNodeContainer,
      treeClasses.treeNode
    );
    setTreeSnapshot(JSON.parse(treeJson) as TreeListElement);
  }, [props.triggerRender])


  if (typeof window === "object") {
    return (
      <div className={classes.modal} ref={modalRef}>
        <TreeListItem 
          element={treeSnapshot}
        />
      </div>
    )
  }

  return null;
})

export default ListView;