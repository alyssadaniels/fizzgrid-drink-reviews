import { Drink, DrinkImage } from "../../../util/types";

export default function DrinkOption({
    drink,
    images,
}: {
    drink: Drink;
    images?: DrinkImage[];
}) {
    // const { data, isLoading } = useFetchD,rink(drink.id);

    return (
        <div className="grid grid-cols-6 p-2 hover:bg-background-dark hover:cursor-pointer">
            {images && images.length > 0 && (
                <img
                    className="col-span-1"
                    src={images[0].image}
                    alt={images[0].label}
                />
            )}
            <span className="col-span-5 col-start-2">{`${drink.product_name} - ${drink.brand_name}`}</span>
        </div>
    );
}
