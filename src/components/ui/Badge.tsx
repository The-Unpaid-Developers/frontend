import React from "react";
import { DocumentState, getStateColor } from "../../types/solutionReview";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "state";
  state?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  state,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";

  let variantClasses = "bg-gray-100 text-gray-800 border-gray-300";

  if (variant === "state" && state) {
    variantClasses = getStateColor(state);
  }

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  return <span className={classes}>{children}</span>;
};
