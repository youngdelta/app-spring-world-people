import { Box, Button, Card, CardContent, Chip, Container, Grid, LinearProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, DollarSign, Heart, Map as MapIcon, Maximize, Newspaper, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import ImageWithFallback from "../components/ImageWithFallback";
import api from "../services/api";

export default function CountryDetail() {
	const { countryCode } = useParams();
	const [country, setCountry] = useState(null);
	const [history, setHistory] = useState([]);
	const [news, setNews] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCountryData();
	}, [countryCode]);

	const fetchCountryData = async () => {
		setLoading(true);
		try {
			const [countryRes, historyRes] = await Promise.all([
				api.get(`/api/population/countries/${countryCode}`),
				api.get(`/api/population/history/${countryCode}`),
			]);

			setCountry(countryRes.data);
			setHistory(historyRes.data);

			try {
				const newsRes = await api.get(`/api/news/country/${countryRes.data.countryName}`);
				setNews(newsRes.data);
			} catch (newsErr) {
				console.error("News fetch failed:", newsErr);
			}
		} catch (error) {
			console.error("Error fetching country detail:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
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

	if (!country) return <Typography color="white">Country not found.</Typography>;

	return (
		<Container maxWidth="xl" component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
			<Button
				component={Link}
				to="/dashboard"
				startIcon={<ArrowLeft size={16} />}
				sx={{
					mb: 6,
					mt: 2,
					color: "text.secondary",
					fontWeight: 800,
					"&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" },
				}}
			>
				Return to Command Center
			</Button>

			{/* Header Section */}
			<Card
				sx={{
					mb: 8,
					p: { xs: 4, md: 6 },
					borderRadius: 10,
					position: "relative",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%)",
						zIndex: 0,
					}}
				/>
				<Grid container spacing={8} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
					<Grid item xs={12} md={5} lg={4}>
						<Box
							sx={{
								position: "relative",
								overflow: "hidden",
								borderRadius: 6,
								boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
								border: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							<ImageWithFallback
								src={`https://flagcdn.com/w640/${country.countryCode.toLowerCase()}.png`}
								fallbackSrc="https://via.placeholder.com/640x400?text=Flag"
								alt={`${country.countryName} flag`}
								style={{ width: "100%", display: "block" }}
							/>
						</Box>
					</Grid>
					<Grid item xs={12} md={7} lg={8}>
						<Chip
							label={country.continent}
							icon={<MapIcon size={12} />}
							sx={{
								mb: 3,
								fontWeight: 900,
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								fontSize: "0.625rem",
								bgcolor: "rgba(99, 102, 241, 0.1)",
								color: "primary.light",
								border: "1px solid rgba(99, 102, 241, 0.2)",
								"& .MuiChip-icon": { color: "inherit" },
							}}
						/>
						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: "3rem", md: "5rem" },
								color: "white",
								mb: 1,
							}}
						>
							{country.countryName}
						</Typography>
						<Typography
							sx={{
								fontSize: "2rem",
								fontWeight: 900,
								color: "text.secondary",
								letterSpacing: "0.2em",
								fontFamily: "monospace",
							}}
						>
							{country.countryCode}
						</Typography>
					</Grid>
				</Grid>
			</Card>

			{/* Stats Grid */}
			<Grid container spacing={4} sx={{ mb: 8 }}>
				{[
					{
						label: "Population",
						value: country.population.toLocaleString(),
						unit: "Citizens",
						icon: Users,
						color: "#6366f1",
						bg: "rgba(99, 102, 241, 0.1)",
					},
					{
						label: "Land Area",
						value: country.areaSqKm.toLocaleString(),
						unit: "sq km",
						icon: Maximize,
						color: "#10b981",
						bg: "rgba(16, 185, 129, 0.1)",
					},
					{
						label: "Density",
						value: country.populationDensity.toFixed(2),
						unit: "p/km²",
						icon: Activity,
						color: "#f59e0b",
						bg: "rgba(245, 158, 11, 0.1)",
					},
					{
						label: "Economy (GDP)",
						value: `$${country.gdpPerCapita.toLocaleString()}`,
						unit: "per capita",
						icon: DollarSign,
						color: "#a855f7",
						bg: "rgba(168, 85, 247, 0.1)",
					},
					{
						label: "Longevity",
						value: country.lifeExpectancy.toFixed(1),
						unit: "years",
						icon: Heart,
						color: "#f43f5e",
						bg: "rgba(244, 63, 94, 0.1)",
					},
				].map((stat) => (
					<Grid item xs={12} sm={6} md={2.4} key={stat.label}>
						<Card sx={{ height: "100%" }}>
							<CardContent sx={{ p: 3 }}>
								<Box
									sx={{
										width: 44,
										height: 44,
										borderRadius: 3,
										bgcolor: stat.bg,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										mb: 3,
									}}
								>
									<stat.icon size={20} color={stat.color} />
								</Box>
								<Typography variant="h5" sx={{ fontWeight: 900, color: "white", mb: 0.5 }}>
									{stat.value}
								</Typography>
								<Typography
									variant="overline"
									sx={{
										display: "block",
										color: "text.secondary",
										fontWeight: 800,
										lineHeight: 1.2,
									}}
								>
									{stat.label}
								</Typography>
								<Typography
									variant="caption"
									sx={{
										color: "text.disabled",
										fontWeight: 700,
										textTransform: "uppercase",
									}}
								>
									{stat.unit}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Chart and News */}
			<Grid container spacing={6} sx={{ mb: 8 }}>
				<Grid item xs={12} lg={8}>
					<Card sx={{ p: { xs: 4, md: 6 }, borderRadius: 8 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 6,
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
									<Activity size={20} color="#818cf8" />
								</Box>
								<Typography variant="h6" sx={{ fontWeight: 800 }}>
									Population Chronology
								</Typography>
							</Box>
							<Typography
								variant="caption"
								sx={{
									fontWeight: 800,
									color: "text.secondary",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
								}}
							>
								Historical Growth Vector
							</Typography>
						</Box>
						<Box sx={{ height: 400, width: "100%" }}>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={history}>
									<defs>
										<linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
									<XAxis dataKey="year" stroke="#475569" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickSize={15} />
									<YAxis
										stroke="#475569"
										fontSize={10}
										fontWeight={700}
										tickLine={false}
										axisLine={false}
										tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
									/>
									<RechartsTooltip
										contentStyle={{
											backgroundColor: "#1e293b",
											borderRadius: "16px",
											border: "1px solid rgba(255,255,255,0.1)",
											boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
											padding: "12px 16px",
										}}
										itemStyle={{
											color: "#fff",
											fontWeight: 900,
											fontSize: "14px",
										}}
										labelStyle={{
											color: "#94a3b8",
											fontWeight: 800,
											fontSize: "11px",
											textTransform: "uppercase",
											marginBottom: "4px",
										}}
										formatter={(value) => [value.toLocaleString(), "CITIZENS"]}
									/>
									<Area type="monotone" dataKey="population" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPop)" animationDuration={2000} />
								</AreaChart>
							</ResponsiveContainer>
						</Box>
					</Card>
				</Grid>

				<Grid item xs={12} lg={4}>
					<Card sx={{ p: 4, height: "100%", borderRadius: 8 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
							<Box
								sx={{
									p: 1,
									borderRadius: 2,
									bgcolor: "rgba(244, 63, 94, 0.2)",
									display: "flex",
								}}
							>
								<Newspaper size={20} color="#fb7185" />
							</Box>
							<Typography variant="h6" sx={{ fontWeight: 800 }}>
								Regional Briefings
							</Typography>
						</Box>
						<Box sx={{ height: 420, overflowY: "auto", pr: 1 }}>
							{news.map((item, idx) => (
								<Box
									key={idx}
									component="a"
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									sx={{
										display: "block",
										p: 2.5,
										mb: 2,
										borderRadius: 4,
										bgcolor: "rgba(255,255,255,0.03)",
										border: "1px solid transparent",
										textDecoration: "none",
										transition: "all 0.3s",
										"&:hover": {
											bgcolor: "rgba(255,255,255,0.06)",
											borderColor: "rgba(255,255,255,0.1)",
											transform: "translateX(4px)",
										},
									}}
								>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											mb: 1,
										}}
									>
										<Typography
											variant="caption"
											sx={{
												fontWeight: 900,
												color: "primary.light",
												textTransform: "uppercase",
												letterSpacing: "0.1em",
											}}
										>
											{item.source}
										</Typography>
										<Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 700 }}>
											{item.date}
										</Typography>
									</Box>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 800,
											color: "white",
											mb: 1,
											lineClamp: 2,
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										{item.title}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											fontSize: "0.7rem",
											color: "text.secondary",
											fontStyle: "italic",
											lineClamp: 2,
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										"{item.description}"
									</Typography>
								</Box>
							))}
							{!news.length && (
								<Box sx={{ textAlign: "center", py: 10 }}>
									<Typography
										sx={{
											color: "text.disabled",
											fontWeight: 800,
											textTransform: "uppercase",
											fontSize: "0.75rem",
											letterSpacing: "0.1em",
										}}
									>
										Intelligence Unavailable
									</Typography>
								</Box>
							)}
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}
