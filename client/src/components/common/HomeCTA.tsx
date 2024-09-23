import { STOCK_IMG_URL } from "../../util/constants";
import Button from "./ui/Button";

/**
 * Home CTA component - header for landing page
 * @returns Home CTA component
 */
function HomeCTA() {
  return (
    <div className="bg-text-primary w-screeen relative">
      <div className="w-9/12 mx-auto py-20 grid grid-cols-1 items-center gap-40 md:grid-cols-2">
        <div>
          {/* text */}
          <h1 className="text-background-light font-bold text-6xl mb-4">
            Read. Drink. Review.
          </h1>
          <p className="text-background-dark my-4">
            Join a community of soda lovers! Read reviews, write reviews, and
            track your favorites.
          </p>

          {/* buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              text="Get Started"
              onClick={() => {
                window.location.href = "/signup";
              }}
              isPrimary={true}
            />
            <Button
              text="Log in"
              onClick={() => {
                window.location.href = "/login";
              }}
              isPrimary={false}
            />
          </div>
        </div>

        {/* stock image */}
        <img
          className="rounded-lg"
          src={STOCK_IMG_URL}
          alt="Fridge with soda"
        />
      </div>
    </div>
  );
}

export default HomeCTA;
