import { LeftArrowIcon, RightArrowIcon } from "../icons";

/**
 * Page indicator component, page state controlled by parent
 * 1-indexed 
 * @param page current page, linked to setPage
 * @param setPage function to set page state, linked to page
 * @param numPages total number of pages
 * @returns PageIndicator component
 */
export default function PageIndicator({
    page,
    setPage,
    numPages,
}: {
    page: number;
    setPage(page: number): void;
    numPages: number;
}) {
    return (
        <div className="text-background-dark flex items-center justify-center gap-x-4">
            <button
                className={`${
                    page <= 1
                        ? "text-background-light"
                        : "hover:text-highlight-light hover:cursor-pointer"
                }`}
                onClick={() => {
                    setPage(page - 1);
                }}
                disabled={page <= 1}
            >
                <LeftArrowIcon />
            </button>
            <p>
                Page {page} / {numPages}
            </p>
            <button
                className={`${
                    page >= numPages
                        ? "text-background-light"
                        : "hover:text-highlight-light hover:cursor-pointer"
                }`}
                onClick={() => {
                    setPage(page + 1);
                }}
                disabled={page >= numPages}
            >
                <RightArrowIcon />
            </button>
        </div>
    );
}
