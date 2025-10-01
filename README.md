# GitFlex - Flex 💪 Your GitHub Profile

<div align="center">
  <img src="./public/gitflex-logo.svg" alt="GitFlex Logo" width="120" height="120">
  
  <h3>Transform your GitHub profile into a beautiful, professional showcase</h3>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-38B2AC.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-4+-646CFF.svg)](https://vitejs.dev/)

  ![Screenshot_20-9-2025_13364_gitflexx vercel app](https://github.com/user-attachments/assets/acde29eb-2a0d-41fb-9931-a1a12dad7cda)


</div>

## ✨ Features

### 🎨 **Neomorphic Design**
- Modern, elegant UI with soft shadows and depth
- Beautiful light and dark themes with smooth transitions
- Responsive design that works perfectly on all devices

### 📊 **Rich Data Visualization**
- Interactive contribution graphs and heatmaps
- Language distribution charts
- Repository statistics and trends
- Activity timelines and insights

### ⚡ **Performance First**
- Lightning-fast loading with intelligent caching
- Lazy loading and code splitting
- Optimized bundle size and runtime performance
- Progressive Web App capabilities

### 🔐 **Privacy Focused**
- No data collection or tracking
- Uses only public GitHub API data
- Completely client-side application
- Optional GitHub token for higher rate limits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- A modern web browser
- Optional: GitHub Personal Access Token for higher API rate limits

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishadkindre/gitflex.git
   cd gitflex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env and add your GitHub token if needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18+ with modern hooks
- **Styling**: Tailwind CSS with custom neomorphism design system
- **Animation**: Framer Motion for smooth, performant animations
- **Routing**: React Router for client-side navigation
- **Charts**: Chart.js with React integration
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Axios with intelligent caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Code Quality**: ESLint + Prettier for consistent code formatting

## 📁 Project Structure

```
gitflex/
├── docs/               # Documentation files
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components
│   │   ├── common/     # Layout components
│   │   └── profile/    # Profile-specific components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── context/        # React contexts
│   └── main.jsx        # Application entry point
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js     # Vite configuration
```

## 🎯 Usage

1. **Visit the landing page** and enter any GitHub username
2. **Explore the profile** with beautiful visualizations
3. **Use filters and search** to find specific repositories
4. **Toggle between themes** using the theme switcher
5. **View contribution patterns** and coding statistics

### Example URLs
- `https://gitflexx.vercel.app/octocat` - View GitHub's mascot profile
- `https://gitflexx.vercel.app/torvalds` - View Linus Torvalds' profile
- `https://gitflexx.vercel.app/microsoft` - View Microsoft's organization

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Optional: GitHub Personal Access Token for higher rate limits
VITE_GITHUB_TOKEN=your_token_here

# API Configuration
VITE_API_BASE_URL=https://api.github.com

```

### GitHub API Rate Limits

- **Without token**: 60 requests per hour
- **With token**: 5000 requests per hour

To get a GitHub token:
1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with public repository access
3. Add it to your `.env` file

## 🚢 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nishadkindre/gitflex)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nishadkindre/gitflex)

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Clean build artifacts
npm run clean
```

### Code Style

This project uses ESLint and Prettier for consistent code formatting. The configuration follows React best practices and modern JavaScript standards.

## 🎨 Design System

GitFlex uses a custom neomorphic design system built on top of Tailwind CSS:

### Colors
- **Light Mode**: Soft grays with subtle shadows
- **Dark Mode**: Deep grays with inner/outer shadows
- **Accent**: Vibrant blue (#007AFF) and green (#34C759)

### Typography
- **Headings**: Inter or SF Pro Display
- **Code**: JetBrains Mono
- **Body**: Inter with fluid scaling

### Shadows
- Multiple shadow layers for depth
- Responsive shadow system
- Theme-aware shadow colors

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [devb.io](https://devb.io/) for inspiration on design and layout
- [GitHub API](https://docs.github.com/en/rest) for providing the data
- [Vercel](https://vercel.com/) for free hosting and deployment

## 📊 Stats

<div align="center">
  <img src="https://img.shields.io/github/stars/nishadkindre/gitflex?style=social" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/nishadkindre/gitflex?style=social" alt="GitHub Forks">
  <img src="https://img.shields.io/github/issues/nishadkindre/gitflex" alt="GitHub Issues">
  <img src="https://img.shields.io/github/license/nishadkindre/gitflex" alt="License">
</div>

---

<div align="center">
  <p>Made with ❤️ by Nishad Kindre</p>
  <p>
    <a href="https://gitflexx.vercel.app">Live Demo</a> •
    <a href="https://github.com/nishadkindre/gitflex/issues">Report Bug</a> •
    <a href="https://github.com/nishadkindre/gitflex/issues">Request Feature</a>
  </p>
</div>
