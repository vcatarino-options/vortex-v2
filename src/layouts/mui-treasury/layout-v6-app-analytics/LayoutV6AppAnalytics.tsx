import { Typography, Box } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Content, Header, Root } from "../layout-core-v6";
import { Outlet } from "react-router";

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
          bgcolor: "rgba(255,255,255,0.5)",
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

          <Typography
            variant="h6"
            sx={{ fontSize: "clamp(18px, 1vw + 1rem, 24px)" }}
          >
            <b>Analytics</b>
          </Typography>
        </Box>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Root>
  );
}
