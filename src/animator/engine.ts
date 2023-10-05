/**
 * this class provides animations required by the tree in the drawing component
 * such as centering capabilites and zooming in and out the drawing board
 * @method setTree intialize some values of tree
 * @method centerTree to center the tree in the viewport
 * @method onTreeClick animator handler on tree click
 * @method onTreeRelease animator handler on tree release
 * @method onTreeDrag animator handler on tree drag
 * @method onZoom animator handler on tree zoom
 */

export type AllowedZoomLevels = 
  25 |
  30 |
  40 |
  50 |
  60 |
  70 |
  80 |
  90 |
  100 |
  125 |
  150;

class AnimatorEngine {


  private __zoomLevel: number;

  // used for dragging
  private __startX : number;
  private __startY : number;

  private __lastX : number;
  private __lastY : number;


  constructor() {
    this.__zoomLevel = 100;

    this.__startX = 0;
    this.__startY = 0;
    this.__lastX = 0;
    this.__lastY = 0;

    this.setTree = this.setTree.bind(this);
    this.centerTree = this.centerTree.bind(this);
    this.onTreeClick = this.onTreeClick.bind(this);
    this.onTreeRelease = this.onTreeRelease.bind(this);
    this.onTreeDrag = this.onTreeDrag.bind(this);
    this.onZoom = this.onZoom.bind(this);
  }

  /**
   * setTree maintains a reference to the tree and 
   * its initial x and y positions
   * @param {HTMLDivElement} tree
   */
  setTree(
    tree : HTMLDivElement
  ) {
    this.__lastX = tree.offsetLeft;
    this.__lastY = tree.offsetTop;
  }

  /**
   * animator click handler when the tree is clicked
   * @param {MouseEvent} e event when the mouse is clicked
   */
  onTreeClick(
    e : MouseEvent
  ) {
    e.stopPropagation();
    this.__startX = e.clientX;
    this.__startY = e.clientY;
  }

  /**
   * animator click handler when the tree is released
   * @param {HTMLDivElement} tree the tree div element
   * @param {MouseEvent} e event when the mouse is released
   */
  onTreeRelease(
    tree : HTMLDivElement,
    e : MouseEvent
  ) {
    e.stopPropagation();
    this.__lastX = tree.offsetLeft;
    this.__lastY = tree.offsetTop ;

    // update the center div widths and heights accordingly
    const centerDiv : HTMLDivElement = document.getElementById("drawing-board-center") as HTMLDivElement;
    const treeRect = tree.getBoundingClientRect();
    centerDiv.style.width = `${treeRect.width}px`;
    centerDiv.style.height = `${treeRect.height}px`;
  }

  onTreeDrag(
    tree : HTMLDivElement,
    e : MouseEvent
  ) {
    const nextX = e.clientX - this.__startX + this.__lastX;
    const nextY = e.clientY - this.__startY + this.__lastY;

    tree.style.left = `${nextX}px`;
    tree.style.top = `${nextY}px`;

  }

  /**
   * animator callback on tree when zooming in or out
   * @param {HTMLDivElement} tree the tree div element
   * @param {AllowedZoomLevels} zoomLevel
   */
  onZoom(
    tree : HTMLDivElement,
    zoomLevel : AllowedZoomLevels
  ) {
    tree.style.transform = `scale(${zoomLevel / 100})`;
    const centerDiv : HTMLDivElement = document.getElementById("drawing-board-center") as HTMLDivElement;
    const treeRect = tree.getBoundingClientRect();
    centerDiv.style.width = `${treeRect.width}px`;
    centerDiv.style.height = `${treeRect.height}px`;
    this.setTree(tree);

  }

  /**
   * centerTree method to center the tree in the viewport
   * @param {HTMLDivElement} tree
   * @return cleanup function to cancel animations
   */
  centerTree(
    tree : HTMLDivElement,
  ) {
    if (tree === null) {
      console.warn("Animator Engine: received a null element to center");
      return;
    }

    
    tree.style.transform = "scale(1)";
    // the width and height of the center element should be negligible
    const centerDiv : HTMLDivElement = document.getElementById("drawing-board-center") as HTMLDivElement;
    const treeRect = tree.getBoundingClientRect();
    centerDiv.style.width = `${treeRect.width}px`;
    centerDiv.style.height = `${treeRect.height}px`;

    const finalOffsetTop = centerDiv.offsetTop;
    const finalOffsetLeft = centerDiv.offsetLeft; 

    let currentOffsetLeft = tree.offsetLeft;
    let currentOffsetTop = tree.offsetTop;

    console.log(`center top: ${finalOffsetTop} | center left: ${finalOffsetLeft}`);
    console.log(`tree top: ${currentOffsetTop} | tree left : ${currentOffsetLeft}`);


    let animationId : number;
    const animate = () => {
      /*
       * sign meanings of deltas
       * positive: the object is above / left of the initial position
       * negative: the object is below / right of the initial position 
       */
      const horizontalDiff = finalOffsetLeft - currentOffsetLeft;
      const verticalDiff = finalOffsetTop - currentOffsetTop;

      const moveX = horizontalDiff * 0.08;
      const moveY = verticalDiff * 0.08;
      currentOffsetTop += moveY;
      currentOffsetLeft += moveX;

      if (Math.abs(horizontalDiff) > 1 || Math.abs(verticalDiff) > 1) {
        tree.style.top = `${currentOffsetTop}px`;
        tree.style.left = `${currentOffsetLeft}px`;
        animationId = requestAnimationFrame(animate);
      } else {
        // has reached approximate center
        cancelAnimationFrame(animationId);
        this.setTree(tree);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId)
  }

  /**
   * animator support for drawing vertical branches between two nodes 
   * over the canvas backdrop for the tree
   * @param {HTMLDivElement} tree the tree container for selecting backdrop
   * @param {HTMLDivElement} parentNode the parent node to check the descendants for
   * @param {SVGSVGElement} horizontalsvg the embbed svg line
   * @param {string} nodeContainerClass the classname for the node container 
  */
  drawHorizontalBranch(
    tree : HTMLDivElement,
    parentNode : HTMLDivElement,
    horizontalsvg : SVGSVGElement,
    nodeContainerClass : string
  ) {

    const children = parentNode.querySelectorAll("*");
    const lowerBranch = children[children.length - 2];
    const line = horizontalsvg.querySelectorAll("*")[0];

    interface DOMResult {
      noChildren: boolean;
      hasFirstChild: boolean;
      hasLastChild: boolean;
      childrenCount : number;
      firstChild?: Element;
      lastChild?: Element;
    }
    const selectEndChildElements = (): DOMResult => {
      // this function will query the DOM to get the first
      // and the last child elements
      // this will determine the width of the horizontal branch
      // line required by the animator to draw
      const nodeContainer = parentNode.querySelector(`.${nodeContainerClass}`);
      console.log(nodeContainer);
      if (nodeContainer === null) {
        return {
          noChildren: true,
          hasFirstChild: false,
          hasLastChild: false,
          childrenCount : 0
        };
      }
    
      const childElements = nodeContainer.children;
      if (childElements.length === 0) {
        // there cannot be a last child if there were no children !
        return {
          noChildren: true,
          hasFirstChild: false,
          hasLastChild: false,
          childrenCount : 0
        };
      }
    
      // Get the first child element
      const firstChild = childElements[0];
    
      // If there's only one child element, return it as the first child and not as the last child
      if (childElements.length === 1) {
        return {
          noChildren: false,
          hasFirstChild: true,
          hasLastChild: false,
          firstChild: firstChild,
          childrenCount : 1
        };
      }
    
      // Get the last child element
      const lastChild = childElements[childElements.length - 1];
    
      return {
        noChildren: false,
        hasFirstChild: true,
        hasLastChild: true,
        firstChild: firstChild,
        lastChild: lastChild,
        childrenCount : nodeContainer.childElementCount
      };
    };
    

    const resizeCallback = () => {
      const {noChildren, 
        hasFirstChild, 
        hasLastChild,
        firstChild,
        lastChild,
        childrenCount
      } : DOMResult = selectEndChildElements();
      
      if (noChildren) {
        line.setAttribute("x2", "0");
        const svgContainer = horizontalsvg.parentElement!;
        svgContainer.style.transform = `translateX(0px)`;             
        return;
      }

      const lowerBranchRect = lowerBranch.getBoundingClientRect();
      if (hasFirstChild) {
          let children = firstChild?.querySelectorAll("*")!;
          const upperBranchFirst = children[1];
          // now we have upper and lower branches for the two nodes that we need to connect
          const upperBranchFirstRect = upperBranchFirst.getBoundingClientRect();
          let horizontalTranslate = Math.abs(lowerBranchRect.x - upperBranchFirstRect.x);
          let horizontalDiff;
          // has at least two nodes as determined by the dom accesses
          if (hasLastChild) {
            children = lastChild?.querySelectorAll("*")!;
            const upperBranchLast = children[1];
            const upperBranchLastRect = upperBranchLast.getBoundingClientRect();
            horizontalDiff = Math.abs(upperBranchFirstRect.x - upperBranchLastRect.x);
            horizontalTranslate = horizontalDiff;
            if (childrenCount > 2) {
              horizontalTranslate -= Math.abs(lowerBranchRect.x - upperBranchLastRect.x);
            }
          } else {
            horizontalDiff = horizontalTranslate;
          }
          line.setAttribute("x2", `${horizontalDiff+1}`);
          const svgContainer = horizontalsvg.parentElement!;
          svgContainer.style.transform = `translateX(-${horizontalTranslate}px)`;  
      }
    }
  
    const resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(tree);

    return () => resizeObserver.unobserve(tree);
  }

}




export default AnimatorEngine;