import { Typography, Box } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Content, Header, Root } from "../layout-core-v6";
import { Outlet } from "react-router";
import logo from "../../../assets/images/backgrounds/image.svg"
export function LayoutV6AppAnalytics() {
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true,
  });
  return (
    <Root>
      <Header
        sx={{
          height: { xs: 48, sm: 64, md: 72 },
          bgcolor: (theme) => theme.palette.primary.dark,
          backdropFilter: "blur(12px)",
          ...(trigger && {
            transition: "0.2s",
            boxShadow: "0 0 4px 0 #e2e8f0",
            "&:before": {
              content: '""',
              position: "absolute",
              display: "block",
              width: "100%",
              height: "1px",
              bgcolor: "grey.200",
              bottom: 0,
            },
          }),
        }}
      >
        <Box
          sx={{
            px: { xs: 1, md: 2.5 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: { xs: 52, sm: 64, md: 72 },
          }}
        >
         <img width={160} src={logo} />
        </Box>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Root>
  );
}
