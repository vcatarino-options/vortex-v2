import React from "react";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import { Tab, Typography, Box, Grid, Grid2, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import {
  applyEdgeSidebarStyles,
  Content,
  EdgeSidebar,
  EdgeSidebarContent,
  EdgeTemporaryClose,
  Header,
  layoutClasses,
  Root,
  toggleEdgeSidebarCollapse,
  toggleTemporaryEdgeSidebar,
} from "../layout-core-v6";
import {
  IconNavMockup,
  LinkNavMockup,
  SideNavUserInfoMockup,
  StatCardMockup,
  TopUsersCardMockup,
  UserActiveCardMockup,
} from "../mockup-dashboard";
import { UnderlineTabs } from "../mockup-tabs";
import EnhancedTable from "../../pages/options-dashboard/EnhancedTable"
import { TradeSetupWizard } from "../../pages/options-dashboard/TradeSetupWizard";

interface LayoutV6AppAnalyticsProps {
  tabsTitle: string[]
  handleCloseTab: (name: string) => void
  tabIndex: number,
  setTabIndex: () => void,
  handleClickOpen: () => void
}
export function LayoutV6AppAnalytics({ tabsTitle, tabIndex, handleCloseTab, setTabIndex, handleClickOpen }: LayoutV6AppAnalyticsProps) {
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
          {/* <IconButton
            className={layoutClasses.TemporaryEdgeSidebarTrigger}
            onClick={() => toggleTemporaryEdgeSidebar()}
          >
            <MenuRounded />
          </IconButton>

          <IconButton
            className={layoutClasses.EdgeSidebarCollapser}
            onClick={(event) => toggleEdgeSidebarCollapse({ event })}
            sx={{
              marginLeft:
                "var(--uncollapsed, max(0px, (1px - var(--EdgeSidebar-permanentWidth)) * 240))",
              transition: "margin-left 0.3s",
            }}
          >
            <MenuRounded
              className={layoutClasses.EdgeSidebarCollapsedVisible}
            />
            <ChevronLeftRounded
              className={layoutClasses.EdgeSidebarUncollapsedVisible}
            />
          </IconButton> */}

          <Typography
            variant="h6"
            sx={{ fontSize: "clamp(18px, 1vw + 1rem, 24px)" }}
          >
            <b>Analytics</b>
          </Typography>
        </Box>
      </Header>
      {/* <EdgeSidebar
        sx={(theme) => ({
          ...applyEdgeSidebarStyles({
            theme,
            config: {
              xs: {
                variant: "temporary",
              },
              md: {
                variant: "persistent",
                persistentBehavior: "none",
              },
              lg: {
                autoCollapse: "xl",
                variant: "permanent",
                width: "300px",
                collapsedWidth: "80px",
                expandOnHover: true,
              },
            },
          }),
        })}
      >
        <EdgeTemporaryClose />

        <EdgeSidebarContent>
          <SideNavUserInfoMockup />
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "grey.200",
              display: "flex",
              height: "100%",
            }}
          >
            <IconNavMockup size="small" />
            <LinkNavMockup />
          </Box>
        </EdgeSidebarContent>
      </EdgeSidebar> */}
      <Content>
        <Box sx={{ px: 2, py: 2 }}>
          <Button
            variant="contained"
            // color="info"
            onClick={handleClickOpen}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,
              background: (theme) => theme.palette.primary.light,
              fontWeight: 700,
              width: "200px"
            }}
          >
            NOVA ESTRATÉGIA
          </Button>
        </Box>
        {/* INÍCIO TABS */}
        <UnderlineTabs
          value={tabIndex}
          onChange={(event, index) => setTabIndex(index)}
          sx={{
            minHeight: { xs: 44, md: 48 },
            px: 2,
            "& .MuiTab-root": {
              minHeight: { xs: 44, md: 48 },
              minWidth: 0,
              fontSize: { md: 16 },
            },
          }}
        >
          {
            tabsTitle.length > 0 && tabsTitle.map(tab => (
              <Tab
                label={
                  <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "baseline" }}>
                    <Box>
                      {tab}
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique no botão "x" altere a aba
                          handleCloseTab(tab);
                        }}
                      >

                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                }
                disableTouchRipple
              />

            ))
          }
        </UnderlineTabs>
        {/* FIM TABS */}

        {/* INÍCIO INFORMAÇÕES DO ATIVO */}
        <Box sx={{ px: 2, pt: 1 }}>
          <Grid2 container spacing={2}>
            {/* <Grid2 size={{ xs: 12, sm: 6, md: 8 }} container spacing={2}> */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TradeSetupWizard />
            </Grid2>
            {/* <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <UserActiveCardMockup />
              </Grid2> */}
            {/* </Grid2> */}
            {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <TopUsersCardMockup sx={{ height: "100%" }} />
            </Grid2> */}
          </Grid2>
        </Box>
        {/* FIM INFORMAÇÕES DO ATIVO */}
        {/* INÍCIO TABELA */}
        <EnhancedTable />
        {/* FIM TABELA */}
        <Box
          sx={{
            height: "16vh",
            minHeight: 240,
            borderRadius: 2,
            bgcolor: "rgba(0 0 0 / 0.12)",
            m: 2,
          }}
        />

        <br />
        <br />
        <br />
      </Content>
    </Root>
  );
}
