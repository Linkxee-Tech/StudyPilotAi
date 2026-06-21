import Image from "next/image";
import logo from "../../assets/logo.png";

type StudyPilotLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function StudyPilotLogo({ size = 40, className = "", priority = false }: StudyPilotLogoProps) {
  const height = Math.round(size * 1.08);

  return (
    <Image
      src={logo}
      alt="StudyPilot AI logo"
      width={size}
      height={height}
      priority={priority}
      className={"h-auto w-auto object-contain " + className}
    />
  );
}
