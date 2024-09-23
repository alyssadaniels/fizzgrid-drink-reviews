import { Children, ReactNode } from "react";
import {
  LG_SCREEN_BREAKPOINT,
  MD_SCREEN_BREAKPOINT,
} from "../../../util/constants";
import { ChildrenProps } from "../../../util/types";
import { useMediaQuery } from "@uidotdev/usehooks";

const LG_NUM_COLS = 3;
const MD_NUM_COLS = 2;
const SM_NUM_COLS = 1;

/**
 * Mason grid formatting
 * @param children grid children/content
 * @returns MasonGridContainer component
 */
function MasonGridContainer(props: ChildrenProps) {
  let lgScreen = useMediaQuery(`(min-width: ${LG_SCREEN_BREAKPOINT}px)`);
  let mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

  let childrenAsArr = Children.toArray(props.children);

  function setColumns(numCols: number) {
    // set initial column sizes
    let initColSize = Math.floor(childrenAsArr.length / numCols);

    let colSizes: number[] = new Array(numCols);
    colSizes.fill(initColSize);

    // add to each column for each leftover element
    let remainingElems = childrenAsArr.length % numCols;

    for (let i = 0; i < remainingElems; i++) {
      colSizes[i] += 1;
    }

    // split up elements
    let cols: ReactNode[] = [];

    let startIdx = 0;

    for (let i = 0; i < colSizes.length; i++) {
      let size = colSizes[i];

      cols.push(childrenAsArr.slice(startIdx, startIdx + size));
      startIdx += size;
    }

    return cols;
  }

  // return nothing if no children
  if (!props.children || childrenAsArr.length === 0) {
    return <></>;
  }

  if (lgScreen) {
    const cols = setColumns(LG_NUM_COLS);

    return (
      <div className={`grid gap-10 justify-center grid-cols-3`}>
        {/* columns */}
        {cols.map((column, index) => (
          <div key={index} className="col-span-1 flex flex-col gap-10">
            {column}
          </div>
        ))}
      </div>
    );
  } else if (mdScreen) {
    const cols = setColumns(MD_NUM_COLS);

    return (
      <div className={`grid gap-10 justify-center grid-cols-2`}>
        {/* columns */}
        {cols.map((column, index) => (
          <div key={index} className="col-span-1 flex flex-col gap-10">
            {column}
          </div>
        ))}
      </div>
    );
  } else {
    const cols = setColumns(SM_NUM_COLS);

    return (
      <div className={`grid gap-10 justify-center grid-cols-1`}>
        {/* columns */}
        {cols.map((column, index) => (
          <div key={index} className="col-span-1 flex flex-col gap-10">
            {column}
          </div>
        ))}
      </div>
    );
  }
}

export default MasonGridContainer;
