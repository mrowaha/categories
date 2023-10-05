# N-Children Tree Animation Engine

**A simple, lightweight, frontend-framework agnostic tree animation engine**<br/>
**[engine source code](https://github.com/mrowaha/categories/blob/main/src/animator/engine.ts)**

The animation engine's interface depends only on the __CSS classnames__, __HTML Elements__, __Native Browser API__ and the exported types

Provides the following functionality for animating the N-Children Tree:
1. Tree drag
2. Tree re-centering and re-setting animations
3. Tree translation on drawing board
4. Tree zoom
5. Tree branch connectors transformations
6. Tree snapshot into JSON object [see definition](https://github.com/mrowaha/categories/blob/main/src/animator/engine.ts#L28)

This project uses Nextjs, without any additional third-party libraries, to demonstrate the integration of the engine