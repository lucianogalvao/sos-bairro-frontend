// src/theme/mui.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    nb: true;
    lg: true;
    xl: true;
  }
}
