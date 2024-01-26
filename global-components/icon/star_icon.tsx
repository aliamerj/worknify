import React from "react";

interface StarIconProps {
  isFilled: boolean; // Determines if the star is filled or not
  size?: number;
  height?: number;
  width?: number;
  label?: string;
  color?: string;
}

export const StarIcon: React.FC<StarIconProps> = ({
  isFilled,
  size = 24,
  height,
  width,
  color,
  label,
  ...props
}) => {
  const fillColor = isFilled ? color ?? "currentColor" : "none";
  const strokeColor = "currentColor";

  return (
    <svg
      aria-label={label}
      data-name="StarIcon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size || width}
      height={size || height}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={isFilled ? 0 : 2} // If not filled, give it a stroke width
      {...props}
    >
      <path d="M12 .587l3.668 7.429 8.332 1.209-6.001 5.85 1.417 8.265L12 18.897l-7.416 3.9 1.417-8.265-6.001-5.85 8.332-1.209L12 .587z" />
    </svg>
  );
};
