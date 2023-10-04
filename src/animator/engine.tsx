/**
 * this class provides animations required by the tree in the drawing component
 * such as centering capabilites and zooming in and out the drawing board
 * @method centerTree to center the tree in the viewport
 */

class AnimatorEngine {

  private __zoomLevel: number;
  

  constructor() {
    this.__zoomLevel = 100;
  }

  /**
   * centerTree method to center the tree in the viewport
   * @param {HTMLDivElement} tree
   * @return cleanup function to cancel animations
   */
  centerTree(
    tree : HTMLDivElement  
  ) {
    if (tree === null) {
      console.warn("Animator Engine: received a null element to center");
    }
    
    const treeRect =  tree.getBoundingClientRect();
    const centerTargetX = (window.innerWidth - treeRect.width) / 2;
    const centerTargetY = (window.innerWidth - treeRect.height) / 2;

    let currentX = treeRect.left;
    let currentY = treeRect.top;

    let animationId : number;
    const animate = () => {
      const horizontalDif = centerTargetX - currentX;
      const verticalDif = centerTargetY - currentY;

      const stepX = horizontalDif * 0.08;
      const stepY = verticalDif * 0.08;

      currentX += stepX;
      currentY += stepY;
      tree.style.transform = `translate(${currentX}px, ${currentY}px)`;
      if (Math.abs(horizontalDif) > 1 || Math.abs(verticalDif) > 1) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId)
  }

}

export default AnimatorEngine;