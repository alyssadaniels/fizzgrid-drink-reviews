import { ReactNode } from "react";

interface ItemCountProps {
    n: number;
    icon: ReactNode;
    isVertical?: boolean;
}

/**
 * Item count component
 * @param n number
 * @param icon icon to show
 * @param isVertical indicator to display vertically or horizontally
 * @returns ItemCount component
 */
function ItemCount({ n, icon, isVertical = true }: ItemCountProps) {
    return (
        <div
            className={`flex items-center ${
                isVertical ? "flex-col" : "flex-row gap-2"
            }`}
        >
            {icon}
            <p className="text-xs text-center">{n}</p>
        </div>
    );
}

export default ItemCount;
