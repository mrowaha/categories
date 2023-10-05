import React from "react";
import classes from "./TreeNode.module.css";
import { useAnimator, useServicesContext, useTreeRef } from "@/context/AppContext";
import useOutsideAlerter from "@/hooks/useOutsideAlert";

interface TreeActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon : React.ReactNode;  
  variant : "primary" | "secondary" | "error" | "warning" | "success";
  disabled? : boolean
}

function TreeActionButton(props : TreeActionButtonProps) {
  return (
    // @ts-ignore
    <button disabled={props.disabled} className={classes.actionBtn} variant={props.variant} onClick={props.onClick}>
      {props.icon}
    </button>
  )
}

interface TreeNodeProps {
  root? : boolean;
  level : number;
  onCancel? : () => void;
  id? : number;
  allowService?: boolean;
  isService : boolean;
}

interface TreeChildNode {
  id : number;
  isService : boolean;
}

function TreeNode(props : TreeNodeProps) {

  const nodeColorCode = props.level % 3;
  const animator = useAnimator();
  const treeRef = useTreeRef();
  const [nextId, setNextId] = React.useState<number>(1);
  const [nodeChildren, setNodeChildren] = React.useState<TreeChildNode[]>([]);
  const [name, setName] = React.useState<string>("");
  const [save, setSave] = React.useState<boolean>(false);
  const [_, setServices] = useServicesContext();

  const parentNodeRef = React.useRef<HTMLDivElement>(null);
  const horizontalLineRef = React.useRef<SVGSVGElement>(null);

  const newNodeModalRef = React.useRef<HTMLDivElement>(null);
  useOutsideAlerter(newNodeModalRef, () => {
    if (newNodeModalRef.current) {
      newNodeModalRef.current.style.display = "none";
    }
  })

  const handleOnCancel = React.useCallback((id : number) => {
    setNodeChildren(prev => {
      const newArray = prev.filter(node => node.id !== id);
      return newArray;
    })
  }, []);

  const handleNewNodeType = () => {
    if (newNodeModalRef.current)
      newNodeModalRef.current.style.display = "block";
  }

  const handleNewNode = (isService : boolean) => {
    if (isService) setServices(prev => prev+1);
    setNodeChildren(prev => [...prev, {id : nextId, isService : isService}]);
    setNextId(prev => prev+1);
    if (newNodeModalRef.current)                 
      newNodeModalRef.current.style.display = "none";
  }

  React.useEffect(() => {
    // return a cleanup function to decrement service count if
    // the node unmounts
    // required to also decrement nested services
    return () => {
      if (props.isService) setServices(prev => prev-1)
    }
  }, [props.isService]) 

  React.useEffect(() => {
    const cleanup = animator.drawHorizontalBranch(
      treeRef.current!,
      parentNodeRef.current!,
      horizontalLineRef.current!,
      classes.nodeChildren
    )

    return () => cleanup()
  }, [])

  return (
    <div
      ref={parentNodeRef}
      style={{
        display : "flex",
        flexDirection : "column",
        alignItems : "center",
        justifyContent : "flex-start"
      }}
    >
      { !props.root && 
        <div>
          <div className={classes.treeNodeBranchVertical}>         
          </div> 
        </div> 
      }
      <div className={`${classes.treeNodeContainer} ` + (props.root && classes.rootContainer)}>
        {
          props.root ? 
          // @ts-ignore
          <div className={`${classes.treeNode} ${classes.root}`}>
            <h1>Categories</h1>
          </div> :
          <>
          {
            save ? 
            <>
              {/* @ts-ignore */}
              <div level={nodeColorCode} className={`${classes.treeNode}`} isService={props.isService ? "yes" : "no"}>
                {
                  props.isService && 
                  <span className={classes.serviceTag}/>
                }
                <h1>{name}</h1>        
                <div ref={newNodeModalRef} className={classes.newNodeModal}>
                  <h1>What do you want to create?</h1>
                  <button 
                    className={classes.newNodeAction} 
                    onClick={() => handleNewNode(false)}
                  >
                    Category
                  </button>
                  <button 
                    className={classes.newNodeAction}
                    onClick={() => handleNewNode(true)}
                  >Service</button>
                </div>
              </div>
            </>
              :
              <div className={`${classes.treeNode}`}>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
          }
          
          </> 
        } 
        {/* render actions based on usage */}
        {
          !props.root ? 
          save ?
          // the actions to be performed if the node is not a root and is saved 
          <>
          <TreeActionButton 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            }
            variant="primary"
            onClick={handleNewNodeType} 
          />
          <TreeActionButton 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            }
            variant="primary"
            onClick={() => setSave(false)} 
          />
          <TreeActionButton 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            variant="error"
            onClick={props.onCancel} 
          />
          </> :
          // the actions to be performed if the node is not a root but is not saved
          <>
            <TreeActionButton 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              variant="warning"
              onClick={props.onCancel} 
            />
            <TreeActionButton 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              }
              variant="success"
              onClick={() => {
                if (name === "") return;
                setSave(true);
              }}
              disabled={name === ""}
            />
          </> :
          // actions to be performed if the node is a root node
          <TreeActionButton 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          }
          variant="primary"
          onClick={() => handleNewNode(false)} 
        />
        }
      </div>
      {
        !props.root ? 
          <div>
            <div className={classes.treeNodeBranchVertical}>
              <div className={classes.treeNodeBranchHorizontal}>
                <svg ref={horizontalLineRef} xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="10" x2="0" y2="10" stroke="grey" stroke-width="1" />
                </svg> 
              </div>
            </div>
          </div> :
          <div>
          {/* @ts-ignore */}
            <div className={classes.treeNodeBranchVertical} type="large">
              <div className={classes.treeNodeBranchHorizontal}>
                <svg ref={horizontalLineRef}  xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="10" x2="0" y2="10" stroke="grey" stroke-width="1" />
                </svg> 
              </div>
            </div>
          </div>
      } 
      {/* @ts-ignore */}
      <div className={classes.nodeChildren}>
        {
          nodeChildren.map(({id, isService}, index, arr) => {
            return (
              <div className="node" key={id}>
                <TreeNode 
                onCancel={() => handleOnCancel(id)} 
                id={id} 
                level={props.level+1}
                allowService
                isService={isService}
                />
              </div> 
            )
          })
        }
      </div>
    </div>
  )
}

export default TreeNode;