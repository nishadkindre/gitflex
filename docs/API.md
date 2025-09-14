# GitHub APIs Used in GitFlex

This document outlines the GitHub APIs utilized in GitFlex and their specific purposes within the application.

## API Overview

GitFlex leverages the **GitHub REST API v3** to fetch user and repository data. All API calls are made through our centralized `githubService` with built-in caching, rate limiting, and error handling.

### Base Configuration
- **Base URL**: `https://api.github.com`
- **API Version**: v3 (`application/vnd.github.v3+json`)
- **Authentication**: Optional GitHub Personal Access Token
- **Rate Limiting**: Handles 60 requests/hour (unauthenticated) or 5,000/hour (authenticated)
- **Caching**: 5-minute client-side cache to reduce API calls

## API Endpoints

### 1. User Profile API
**Endpoint**: `GET /users/{username}`

**Purpose**: Fetches comprehensive user profile information for the main profile display.

**Data Retrieved**:
- Basic profile info (name, bio, avatar, location)
- Public metrics (followers, following, public repos)
- Account details (join date, company, website)
- Social links and contact information

**Used In**:
- `UserInfoCard` component
- Profile header section
- User statistics display

---

### 2. User Repositories API
**Endpoint**: `GET /users/{username}/repos`

**Purpose**: Retrieves all public repositories for a user with detailed metadata.

**Parameters**:
- `sort`: Repository sorting (updated, created, pushed, full_name)
- `direction`: Sort order (desc, asc)
- `per_page`: Results per page (default: 30)
- `type`: Repository type (owner, public, private, forks, sources, member)

**Data Retrieved**:
- Repository metadata (name, description, language)
- Engagement metrics (stars, forks, watchers)
- Technical details (size, topics, license)
- Timestamps (created, updated, pushed)
- URLs (clone, homepage, issues)

**Used In**:
- `RepositoryShowcase` component
- Repository cards and filtering
- Analytics and statistics calculations
- Project portfolio display

---

### 3. Repository Details API
**Endpoint**: `GET /repos/{owner}/{repo}`

**Purpose**: Fetches detailed information about specific repositories for enhanced displays.

**Data Retrieved**:
- Extended repository metadata
- Detailed statistics and metrics
- Branch and release information
- License and contribution details

**Used In**:
- Repository detail modals
- Enhanced project information
- Deep-dive analytics

---

### 4. Repository Languages API
**Endpoint**: `GET /repos/{owner}/{repo}/languages`

**Purpose**: Retrieves programming language statistics for repositories.

**Data Retrieved**:
- Language distribution by bytes
- Primary and secondary languages
- Technology stack insights

**Used In**:
- Language distribution charts
- Technology analytics
- Skill assessment visualizations

---

### 5. Repository Contributors API
**Endpoint**: `GET /repos/{owner}/{repo}/contributors`

**Purpose**: Fetches contributor information for collaboration insights.

**Data Retrieved**:
- Contributor profiles and statistics
- Contribution counts and patterns
- Collaboration metrics

**Used In**:
- Repository collaboration analysis
- Team project identification
- Community engagement metrics

## External APIs

### GitHub Calendar Integration
**Service**: `react-github-calendar`
**Purpose**: Displays GitHub contribution calendar with activity heatmap

**Data Source**: GitHub's contribution graph data
**Features**:
- Daily contribution visualization
- Streak tracking
- Activity intensity mapping
- Theme-aware color schemes

## Rate Limiting & Optimization

### Built-in Protections
- **Request Caching**: 5-minute cache prevents duplicate calls
- **Rate Limit Detection**: Automatic handling of 403 rate limit responses
- **Error Recovery**: Graceful fallbacks for API failures
- **Progressive Enhancement**: App remains functional with limited API access

### Best Practices
- **Batch Requests**: Minimize API calls through intelligent caching
- **Error Boundaries**: Graceful degradation when APIs fail
- **Loading States**: Progressive data loading for better UX
- **Token Authentication**: Recommended for higher rate limits

## Authentication

### Optional GitHub Token
Set `VITE_GITHUB_TOKEN` environment variable for:
- **Higher Rate Limits**: 5,000 requests/hour vs 60/hour
- **Private Repository Access**: If user grants permissions
- **Enhanced Data**: Additional metadata availability

### Security
- Token is client-side environment variable
- No server-side storage or processing
- Users control their own authentication
- Respects GitHub's API terms of service

## Error Handling

### Common Scenarios
- **404 User Not Found**: Clean error display with retry options
- **403 Rate Limited**: Shows reset time and retry suggestions  
- **Network Issues**: Offline-friendly with cached data fallbacks
- **Invalid Usernames**: Input validation and error prevention

### User Experience
- Skeleton loading states during API calls
- Progressive data loading for perceived performance
- Graceful degradation when APIs are unavailable
- Clear error messages with actionable solutions