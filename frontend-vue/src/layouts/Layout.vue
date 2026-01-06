<template>
	<div class="layout-container">
		<!-- Sidebar -->
		<aside class="sidebar" :class="{ collapsed: !sidebarOpen }">
			<div class="sidebar-header">
				<div class="logo" v-if="sidebarOpen">
					<div class="logo-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2">
							<circle cx="12" cy="12" r="10"></circle>
							<path d="M2 12h20"></path>
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
						</svg>
					</div>
					<span>WorldPop</span>
				</div>
				<button class="toggle-btn" @click="sidebarOpen = !sidebarOpen">
					<svg v-if="sidebarOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
					<svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>

			<nav class="sidebar-nav">
				<router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="7" height="7"></rect>
						<rect x="14" y="3" width="7" height="7"></rect>
						<rect x="14" y="14" width="7" height="7"></rect>
						<rect x="3" y="14" width="7" height="7"></rect>
					</svg>
					<span v-if="sidebarOpen">Dashboard</span>
				</router-link>
			</nav>

			<div class="sidebar-footer">
				<button class="logout-btn" @click="handleLogout" :title="sidebarOpen ? '' : 'Logout'">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
						<polyline points="16 17 21 12 16 7"></polyline>
						<line x1="21" y1="12" x2="9" y2="12"></line>
					</svg>
					<span v-if="sidebarOpen">Logout</span>
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="main-content">
			<!-- Top Bar -->
			<header class="top-bar">
				<div class="search-bar">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.35-4.35"></path>
					</svg>
					<input v-model="searchQuery" type="text" placeholder="Search countries..." @keyup.enter="handleSearch" />
				</div>
				<div class="top-bar-right">
					<span class="user-name">{{ userInfo?.username || "User" }}</span>
				</div>
			</header>

			<!-- Router View -->
			<router-view />
		</main>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(true);
const searchQuery = ref("");
const userInfo = ref(null);

onMounted(async () => {
	// Get user info from localStorage or API
	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		userInfo.value = JSON.parse(storedUser);
	}
});

const handleLogout = async () => {
	try {
		await api.post("/api/auth/logout");
		localStorage.removeItem("user");
		router.push("/login");
	} catch (error) {
		console.error("Logout failed:", error);
		router.push("/login");
	}
};

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
	}
};
</script>

<style scoped>
.layout-container {
	display: flex;
	height: 100vh;
	background-color: var(--bg-default);
	color: var(--text-primary);
}

/* Sidebar */
.sidebar {
	width: 280px;
	background-color: rgba(15, 23, 42, 0.95);
	border-right: 1px solid var(--border-color);
	display: flex;
	flex-direction: column;
	transition: width 0.3s ease;
	overflow: hidden;
}

.sidebar.collapsed {
	width: 88px;
}

.sidebar-header {
	padding: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid var(--border-color);
	height: 96px;
}

.logo {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-weight: 700;
	color: var(--text-primary);
}

.logo-icon {
	padding: 0.5rem;
	background-color: rgba(99, 102, 241, 0.1);
	border-radius: 12px;
	border: 1px solid rgba(99, 102, 241, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
}

.toggle-btn {
	background: none;
	border: none;
	color: var(--text-secondary);
	cursor: pointer;
	padding: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s ease;
}

.toggle-btn:hover {
	color: var(--text-primary);
}

.sidebar-nav {
	flex: 1;
	padding: 1rem 0;
	display: flex;
	flex-direction: column;
}

.nav-item {
	padding: 1rem 1.5rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	color: var(--text-secondary);
	text-decoration: none;
	transition: all 0.2s ease;
	border-left: 3px solid transparent;
}

.nav-item:hover {
	color: var(--text-primary);
	background-color: rgba(99, 102, 241, 0.1);
}

.nav-item.active {
	color: var(--primary);
	background-color: rgba(99, 102, 241, 0.15);
	border-left-color: var(--primary);
}

.sidebar.collapsed .nav-item {
	padding: 1rem;
	justify-content: center;
}

.sidebar-footer {
	padding: 1rem;
	border-top: 1px solid var(--border-color);
}

.logout-btn {
	width: 100%;
	padding: 0.75rem;
	background: none;
	border: 1px solid var(--border-color);
	color: var(--text-secondary);
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	transition: all 0.2s ease;
}

.logout-btn:hover {
	color: var(--error);
	border-color: var(--error);
}

/* Main Content */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.top-bar {
	background-color: rgba(30, 41, 59, 0.5);
	border-bottom: 1px solid var(--border-color);
	padding: 1rem 2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
}

.search-bar {
	flex: 1;
	max-width: 400px;
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background-color: rgba(15, 23, 42, 0.5);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 0.5rem 1rem;
	color: var(--text-secondary);
}

.search-bar svg {
	flex-shrink: 0;
}

.search-bar input {
	flex: 1;
	background: none;
	border: none;
	color: var(--text-primary);
	font-size: 0.875rem;
}

.search-bar input::placeholder {
	color: var(--text-secondary);
}

.search-bar input:focus {
	outline: none;
}

.top-bar-right {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.user-name {
	font-weight: 600;
	color: var(--text-primary);
}

/* Router View */
:deep(main > *) {
	flex: 1;
	overflow-y: auto;
	padding: 2rem;
}

@media (max-width: 768px) {
	.sidebar {
		width: 70px;
	}

	.sidebar.collapsed {
		width: 70px;
	}

	.logo span {
		display: none;
	}

	.nav-item span {
		display: none;
	}

	.logout-btn span {
		display: none;
	}

	.search-bar {
		max-width: 100%;
	}
}
</style>
