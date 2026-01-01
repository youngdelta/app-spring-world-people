import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Users, Globe2, MapPin, TrendingUp, ExternalLink } from "lucide-react";
import api from "../services/api";
import ImageWithFallback from "../components/ImageWithFallback";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState({
    countries: [],
    pageInfo: {},
    continentStats: [],
    totalPopulation: 0,
    topCountries: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [countriesRes, statsRes, totalRes, topRes] = await Promise.all([
        api.get(
          `/api/population/countries?page=${currentPage}&size=${pageSize}`
        ),
        api.get("/api/population/statistics/continents"),
        api.get("/api/population/statistics/total"),
        api.get("/api/population/top/10"),
      ]);

      setData({
        countries: countriesRes.data.list,
        pageInfo: countriesRes.data,
        continentStats: statsRes.data,
        totalPopulation: totalRes.data,
        topCountries: topRes.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading && !data.countries.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <LinearProgress sx={{ width: "200px", borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-end" },
          mb: 6,
          mt: 4,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              color: "white",
              mb: 1,
            }}
          >
            Global{" "}
            <Box component="span" sx={{ color: "secondary.main" }}>
              Overview
            </Box>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
                animation: "pulse 2s infinite",
              }}
            />
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Live demographic intelligence and world metrics
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<TrendingUp size={18} />}
          sx={{
            mt: { xs: 3, md: 0 },
            borderColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            color: "white",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "rgba(99, 102, 241, 0.05)",
            },
          }}
        >
          Insight Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {[
          {
            label: "Global Population",
            value: data.totalPopulation.toLocaleString(),
            icon: Users,
            color: "#6366f1",
            bg: "rgba(99, 102, 241, 0.1)",
          },
          {
            label: "Monitored Nations",
            value: data.pageInfo.total,
            icon: Globe2,
            color: "#a855f7",
            bg: "rgba(168, 85, 247, 0.1)",
          },
          {
            label: "Active Continents",
            value: data.continentStats.length,
            icon: MapPin,
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.1)",
          },
        ].map((stat, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-8px)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: stat.bg,
                      display: "flex",
                    }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.625rem",
                      color: "success.main",
                      bgcolor: "rgba(16,185,129,0.1)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <TrendingUp size={10} /> +0.8%
                  </Box>
                </Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: "white", fontWeight: 900, mt: 0.5 }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Top Countries Section */}
      <Card
        sx={{
          p: { xs: 4, md: 6 },
          mb: 8,
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 250,
            height: 250,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            transform: "translate(100px, -100px)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "rgba(99, 102, 241, 0.2)",
                display: "flex",
              }}
            >
              <TrendingUp size={20} color="#818cf8" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Dominant Populations
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/dashboard"
            endIcon={<ExternalLink size={14} />}
            sx={{
              color: "primary.light",
              fontWeight: 800,
              fontSize: "0.75rem",
            }}
          >
            View All Insights
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          {data.topCountries.map((country) => (
            <Grid item xs={6} sm={4} md={2.4} key={country.countryCode}>
              <Box
                component={Link}
                to={`/country/${country.countryCode}`}
                sx={{
                  display: "block",
                  p: 2.5,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    height: 70,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <ImageWithFallback
                    src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.png`}
                    fallbackSrc="https://via.placeholder.com/160x100?text=Flag"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                    }}
                  />
                </Box>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    fontSize: "0.875rem",
                    mb: 0.5,
                  }}
                >
                  {country.countryName}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "primary.light",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {(country.population / 1000000).toFixed(1)}M
                  <Box
                    component="span"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                    }}
                  >
                    CITIZENS
                  </Box>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Main Table */}
      <TableContainer
        component={Paper}
        sx={{ mb: 8, borderRadius: 6, overflow: "hidden" }}
      >
        <Box
          sx={{
            p: 4,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Geographic Data Ledger
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.03)" }}>
              <Globe2 size={16} />
            </IconButton>
          </Box>
        </Box>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Region Identity</TableCell>
              <TableCell>Sovereign Entity</TableCell>
              <TableCell>Demographic Density</TableCell>
              <TableCell>Total Inhabitants</TableCell>
              <TableCell align="right" sx={{ pr: 4 }}>
                Economic Tier (GDP)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.countries.map((country) => (
              <TableRow
                key={country.countryCode}
                hover
                sx={{
                  "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" },
                }}
              >
                <TableCell sx={{ pl: 4 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      bgcolor: "background.default",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "primary.light",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {country.countryCode}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    component={Link}
                    to={`/country/${country.countryCode}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <ImageWithFallback
                      src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.png`}
                      alt=""
                      style={{
                        width: 32,
                        height: 20,
                        borderRadius: 4,
                        objectFit: "cover",
                      }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                      {country.countryName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                      maxWidth: 150,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        100,
                        (country.populationDensity / 1000) * 100
                      )}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          background:
                            "linear-gradient(90deg, #6366f1, #a855f7)",
                        },
                      }}
                    />
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {country.populationDensity?.toFixed(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 900, color: "white" }}>
                  {country.population.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "secondary.light",
                      bgcolor: "rgba(168, 85, 247, 0.1)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      display: "inline-block",
                      fontSize: "0.75rem",
                    }}
                  >
                    ${country.gdpPerCapita?.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Page{" "}
            <Box component="span" sx={{ color: "white" }}>
              {currentPage}
            </Box>{" "}
            of {data.pageInfo.pages}
          </Typography>
          <Pagination
            count={data.pageInfo.pages || 0}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "text.secondary",
                borderColor: "rgba(255,255,255,0.1)",
                fontWeight: 700,
              },
              "& .Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                borderColor: "primary.main",
              },
            }}
          />
        </Box>
      </TableContainer>
    </Container>
  );
}
