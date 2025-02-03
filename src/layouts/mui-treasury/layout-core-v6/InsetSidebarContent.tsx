import React from "react";
import { ComponentProps } from "react";
import { Box } from "@mui/material";
import { layoutClasses } from "./layoutClasses";
import { styled } from "./zero-styled";

const InsetSidebarContentRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "inherit",
  overflow: "auto",
  background: (theme.vars || theme).palette.background.paper,
  boxSizing:
    "var(--sticky, border-box) var(--fixed, content-box) var(--absolute, border-box)" as any,
  position:
    "var(--sticky, sticky) var(--fixed, fixed) var(--absolute, absolute)" as any,
  height:
    "var(--sticky, initial) var(--fixed, calc(100% - var(--Header-height, 0px))) var(--absolute, calc(var(--Root-height, 100vh) - var(--Content-insetBottom, 0px) - var(--Header-height, 0px)))",
  width: "var(--sticky, inherit) var(--fixed, inherit) var(--absolute, 100%)",
  top: 0,
  marginLeft:
    "var(--fixed, var(--anchor-left, -9999px)) var(--absolute, initial) var(--sticky, initial)",
  paddingLeft:
    "var(--fixed, var(--anchor-left, 9999px)) var(--absolute, initial) var(--sticky, initial)",
  marginRight:
    "var(--fixed, var(--anchor-right, -9999px)) var(--absolute, initial) var(--sticky, initial)",
  paddingRight:
    "var(--fixed, var(--anchor-right, 9999px)) var(--absolute, initial) var(--sticky, initial)",
  marginTop: "var(--fixed, var(--Header-height))",
}));

const InsetSidebarContent = React.forwardRef<HTMLDivElement, ComponentProps<typeof Box>>(
  function InsetSidebarContent({ className, children, ...props }, ref) {
    return (
      <InsetSidebarContentRoot
        ref={ref}
        className={`${layoutClasses.InsetSidebarContent} ${className || ""}`}
        {...props}
      >
        {children}
      </InsetSidebarContentRoot>
    );
  },
);

export default InsetSidebarContent;
