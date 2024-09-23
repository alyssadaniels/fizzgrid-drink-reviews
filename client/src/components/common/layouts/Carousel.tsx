import { Children, useState } from "react";
import { LeftArrowIcon, RightArrowIcon } from "../icons";
import { ChildrenProps } from "../../../util/types";

/**
 * Carousel component for displaying elements one at a time
 * Arrows can be clicked to cycle through elements
 * @param children Carousel children/content
 * @returns Carousel component
 */
function Carousel(props: ChildrenProps) {
    const [elementIdx, setElementIdx] = useState(0);

    const childrenAsArr = Children.toArray(props.children);

    // return nothing if no children
    if (!props.children || childrenAsArr.length === 0) {
        return <></>;
    }
    const showArrows = childrenAsArr.length > 1;

    /**
     * Updates element index (by scale of 1)
     * @param updateBy number to change element index
     */
    const increaseElementIdx = (updateBy: number) => {
        if (updateBy < 0) {
            // go down
            if (elementIdx - 1 < 0) {
                setElementIdx(childrenAsArr.length - 1);
            } else {
                setElementIdx(elementIdx - 1);
            }
        } else if (updateBy > 0) {
            // go up
            if (elementIdx + 1 >= childrenAsArr.length) {
                setElementIdx(0);
            } else {
                setElementIdx(elementIdx + 1);
            }
        }
    };

    return (
        <div
            className={`flex items-center ${
                showArrows ? "justify-between" : "justify-center"
            }`}
        >
            {/* left arrow */}
            {showArrows && (
                <button
                    className="hover:text-highlight-light hover:cursor-pointer"
                    onClick={() => {
                        increaseElementIdx(-1);
                    }}
                >
                    <LeftArrowIcon />
                </button>
            )}

            {/* content */}
            <div className="flex flex-col items-center" data-testid="display">
                {childrenAsArr[elementIdx]}
            </div>

            {/* right arrow */}
            {showArrows && (
                <button
                    className="hover:text-highlight-light hover:cursor-pointer"
                    onClick={() => {
                        increaseElementIdx(1);
                    }}
                >
                    <RightArrowIcon />
                </button>
            )}
        </div>
    );
}

export default Carousel;
