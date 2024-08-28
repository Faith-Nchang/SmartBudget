"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// The type annotations from TypeScript are removed here as JavaScript doesn't use them
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
