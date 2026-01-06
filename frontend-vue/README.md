# World Population Dashboard - Vue Frontend

This is a Vue 3 frontend implementation of the World Population Dashboard, which mirrors the functionality of the React version but uses Vue 3 Composition API.

## Project Structure

```
frontend-vue/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # Global styles
│   ├── components/
│   ├── layouts/
│   │   └── Layout.vue            # Main layout with sidebar and navigation
│   ├── pages/
│   │   ├── Login.vue             # Login page
│   │   ├── Dashboard.vue         # Main dashboard with countries list
│   │   └── CountryDetail.vue     # Country details page
│   ├── router/
│   │   └── index.js              # Vue Router configuration
│   ├── services/
│   │   └── api.js                # API service with axios
│   ├── App.vue                   # Root component
│   └── main.js                   # Entry point
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies and scripts
```

## Features

- ✅ **User Authentication**: Login page with JWT token support
- ✅ **Dashboard**: Display world population statistics and continental data
- ✅ **Country List**: Paginated list of countries with search and filtering
- ✅ **Country Details**: Individual country pages with detailed statistics and population trends
- ✅ **Responsive Design**: Dark theme with gradient colors
- ✅ **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to the frontend-vue directory
cd frontend-vue

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
# API calls are proxied to http://localhost:8080
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Configuration

### API Proxy

The Vite configuration automatically proxies API requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
}
```

Make sure your Spring Boot backend is running on `http://localhost:8080`.

## Pages

### Login Page (`/login`)
- User authentication form
- Demo credentials: `admin` / `admin123`
- JWT token stored in secure HTTP-only cookie

### Dashboard (`/dashboard`)
- Display total world population statistics
- Continent statistics table with GDP and life expectancy data
- Paginated countries list (10, 20, or 50 items per page)
- Click on country to view detailed information

### Country Detail (`/country/:countryCode`)
- Comprehensive country statistics
- Population trend visualization (2018-2023)
- Links to related continent information
- Back navigation to dashboard

## Key Components

### Layout.vue
Main layout wrapper with:
- Collapsible sidebar navigation
- Top search bar
- User information display
- Logout functionality

### Pages Components
All pages use Vue 3 Composition API with:
- `ref` for reactive state
- `onMounted` for lifecycle hooks
- `useRouter` and `useRoute` for navigation
- API calls via axios service

## Styling

The project uses a custom CSS system with:
- CSS Custom Properties (variables) for colors
- Glassmorphism effects with backdrop-filter
- Gradient backgrounds
- Responsive grid layouts
- Dark theme optimized for readability

### Color Scheme
- Primary: `#6366f1` (Indigo)
- Secondary: `#a855f7` (Purple)
- Background: `#0f172a` (Dark Navy)
- Paper: `#1e293b` (Dark Slate)

## API Integration

The `api.js` service provides:
- Axios instance with base configuration
- Request/Response interceptors
- CORS credentials support
- Automatic 401 redirect to login

### Available Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/population/countries` - Get paginated countries
- `GET /api/population/countries/:code` - Get specific country
- `GET /api/population/statistics/continents` - Get continent stats
- `GET /api/population/statistics/total` - Get world population
- `GET /api/population/history/:code` - Get population history

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting via Vite
- Lazy route loading (can be added)
- CSS optimization
- Image lazy loading for flags

## Security Features

- JWT token handling
- HTTP-only cookies
- CORS configuration
- Request validation

## Comparison with React Version

| Feature | React | Vue |
|---------|-------|-----|
| Framework | React 19 | Vue 3 |
| Routing | React Router v7 | Vue Router v4 |
| UI Library | Material-UI v7 | Custom CSS |
| Build Tool | Vite | Vite |
| API Client | Axios | Axios |
| Package Size | Larger | Smaller |
| Learning Curve | Steeper | Gentler |

## Troubleshooting

### API calls not working
- Ensure Spring Boot backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify JWT token is in cookies (use DevTools)

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check if CSS custom properties are supported
- Use modern browser (latest Chrome/Firefox)

### Login issues
- Use demo credentials: `admin` / `admin123`
- Check browser console for errors
- Verify API endpoint is accessible

## Development Tips

### Adding a New Page
1. Create `.vue` file in `src/pages/`
2. Import in `src/router/index.js`
3. Add route configuration
4. Use `<script setup>` syntax for Composition API

### Adding API Calls
```javascript
import api from '../services/api'

const fetchData = async () => {
  try {
    const response = await api.get('/api/endpoint')
    // Handle response
  } catch (error) {
    // Handle error
  }
}
```

### Styling Components
```vue
<style scoped>
/* Scoped styles only affect this component */
.component {
  color: var(--primary);
}
</style>
```

## License

MIT

## Support

For issues or questions, please refer to:
- Vue 3 Documentation: https://vuejs.org/
- Vite Documentation: https://vite.dev/
- Axios Documentation: https://axios-http.com/
