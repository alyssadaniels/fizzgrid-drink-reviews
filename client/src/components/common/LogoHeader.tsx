import { LogoIcon } from "./icons";

interface LogoHeaderProps {
  title: string;
}

/**
 * Header with logo
 * @param title text to display beneath logo
 * @returns LogoHeader component
 */
function LogoHeader(props: LogoHeaderProps) {
  return (
    <div className="flex flex-col items-center">
      <LogoIcon />

      <h2 className="text-xl font-bold">{props.title}</h2>
    </div>
  );
}

export default LogoHeader;
