import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LayoutDashboard,
  Globe,
  LogOut,
  Search,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import api from "../services/api";

const drawerWidth = 280;
const collapsedWidth = 88;

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  const currentDrawerWidth = isSidebarOpen ? drawerWidth : collapsedWidth;

  return (
    <Box
      sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}
    >
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: currentDrawerWidth,
            boxSizing: "border-box",
            bgcolor: "rgba(15, 23, 42, 0.95)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            backgroundImage: "none",
          },
        }}
        open={isSidebarOpen}
      >
        <Box
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: isSidebarOpen ? "space-between" : "center",
            minHeight: 96,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "rgba(99, 102, 241, 0.1)",
                borderRadius: 3,
                border: "1px solid rgba(99, 102, 241, 0.2)",
                display: "flex",
              }}
            >
              <Globe size={24} color="#6366f1" />
            </Box>
            {isSidebarOpen && (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                World
                <Box component="span" sx={{ color: "primary.main" }}>
                  Pop
                </Box>
              </Typography>
            )}
          </Box>
        </Box>

        <List sx={{ px: 2, flexGrow: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                disablePadding
                sx={{ display: "block", mb: 1 }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 56,
                    justifyContent: isSidebarOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: 3,
                    bgcolor: isActive
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid transparent",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isSidebarOpen ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    <item.icon size={22} />
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? "white" : "text.secondary",
                        letterSpacing: "0.02em",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mb: 2, mx: 2, opacity: 0.1 }} />

        <Box sx={{ p: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 56,
              justifyContent: isSidebarOpen ? "initial" : "center",
              px: 2.5,
              borderRadius: 3,
              color: "error.main",
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarOpen ? 3 : "auto",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LogOut size={22} />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText
                primary="Sign Out"
                primaryTypographyProps={{ fontWeight: 800 }}
              />
            )}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Toggle Button Container */}
      <IconButton
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sx={{
          position: "fixed",
          left: currentDrawerWidth - 14,
          top: 36,
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: theme.shadows[10],
          "&:hover": { bgcolor: "rgba(30, 41, 59, 1)" },
          transition: theme.transitions.create("left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        size="small"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
      </IconButton>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Background Decor */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: 500,
            bgcolor: "rgba(99, 102, 241, 0.03)",
            filter: "blur(120px)",
            borderRadius: "50%",
            transform: "translate(200px, -200px)",
            zIndex: 0,
          }}
        />

        {/* Topbar */}
        <AppBar
          position="static"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "none",
            zIndex: 10,
          }}
        >
          <Toolbar sx={{ height: 96, px: { xs: 4, md: 6 } }}>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 480,
                  bgcolor: "rgba(15, 23, 42, 0.5)",
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  "&:focus-within": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(15, 23, 42, 0.8)",
                  },
                }}
              >
                <Search
                  size={20}
                  color={theme.palette.text.secondary}
                  style={{ transition: "color 0.2s" }}
                />
                <InputBase
                  placeholder="Find a country..."
                  sx={{
                    ml: 2,
                    flex: 1,
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  textAlign: "right",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  sx={{ fontWeight: 900, color: "white", fontSize: "0.875rem" }}
                >
                  Administrator
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Global Status
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "background.paper",
                  border: "2px solid",
                  borderColor: "primary.main",
                  fontWeight: 900,
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
              >
                AD
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Container */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: { xs: 4, md: 6 },
            zIndex: 5,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
