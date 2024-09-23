import { DrinkImage } from "../../../util/types";
import ImagePlaceholder from "../../common/ImagePlaceholder";
import Carousel from "../../common/layouts/Carousel";

export default function DrinkImageCarousel({
    images,
}: {
    images: DrinkImage[];
}) {
    return (
        <div className="size-72 flex flex-col justify-center">
            {images.length === 0 ? (
                <ImagePlaceholder />
            ) : (
                <Carousel>
                    {images.map((image) => (
                        <img
                            key={image.id}
                            className="object-contain"
                            src={image.image}
                            alt={image.label}
                        />
                    ))}
                </Carousel>
            )}
        </div>
    );
}
