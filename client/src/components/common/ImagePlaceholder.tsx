import { LogoIcon } from "./icons";

export default function ImagePlaceholder() {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <LogoIcon />
      <p className="text-sm text-background-dark">No images yet</p>
    </div>
  );
}
