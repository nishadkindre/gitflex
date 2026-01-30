import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date utilities
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return 'Unknown';
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = dateString => {
  if (!dateString) return 'Unknown';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Number formatting utilities
export const formatNumber = num => {
  if (num === null || num === undefined) return '0';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const kebabToTitle = str => {
  return str
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

// URL utilities
export const isValidUrl = string => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const extractDomain = url => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return url;
  }
};

// GitHub specific utilities
export const getLanguageColor = language => {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#007acc',
    Python: '#3776ab',
    Java: '#ed8b00',
    'C++': '#00599c',
    'C#': '#239120',
    PHP: '#777bb4',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
    Go: '#00add8',
    Rust: '#000000',
    Ruby: '#cc342d',
    HTML: '#e34c26',
    CSS: '#1572b6',
    SCSS: '#c6538c',
    Vue: '#4fc08d',
    React: '#61dafb',
    Angular: '#dd0031',
    Node: '#339933',
    Dart: '#0175c2',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    JSON: '#000000',
    YAML: '#cb171e',
    Markdown: '#083fa1'
  };

  return colors[language] || '#6b7280';
};

export const detectLiveDemo = repo => {
  // Check if repo has GitHub Pages enabled
  if (repo.has_pages) {
    return `https://${repo.owner.login}.github.io/${repo.name}`;
  }

  // Check for common demo patterns in description or homepage
  const description = repo.description?.toLowerCase() || '';
  const homepage = repo.homepage;

  if (homepage && isValidUrl(homepage)) {
    return homepage;
  }

  // Look for deploy indicators
  const deployKeywords = ['demo', 'live', 'deployed', 'preview'];
  if (deployKeywords.some(keyword => description.includes(keyword))) {
    // Try to extract URL from description
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = description.match(urlRegex);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }

  return null;
};

export const getRepositoryTopics = repo => {
  return repo.topics || [];
};

export const calculateRepositoryScore = repo => {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const watchers = repo.watchers_count || 0;
  const issues = repo.open_issues_count || 0;
  const hasDescription = repo.description ? 1 : 0;
  const hasReadme = repo.has_wiki ? 0.5 : 0; // Approximation
  const isRecent = new Date() - new Date(repo.updated_at) < 365 * 24 * 60 * 60 * 1000 ? 1 : 0;

  return stars * 3 + forks * 2 + watchers + hasDescription + hasReadme + isRecent - issues * 0.1;
};

// Array utilities
export const sortRepositories = (repos, sortBy = 'updated') => {
  const sortedRepos = [...repos];

  switch (sortBy) {
    case 'name':
      return sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
    case 'stars':
      return sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'forks':
      return sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
    case 'size':
      return sortedRepos.sort((a, b) => b.size - a.size);
    case 'created':
      return sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'updated':
    default:
      return sortedRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
};

export const filterRepositories = (repos, filters) => {
  let filtered = [...repos];

  if (filters.language) {
    filtered = filtered.filter(repo => repo.language?.toLowerCase() === filters.language.toLowerCase());
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      repo => repo.name.toLowerCase().includes(searchTerm) || repo.description?.toLowerCase().includes(searchTerm) || repo.topics?.some(topic => topic.toLowerCase().includes(searchTerm))
    );
  }

  if (filters.type) {
    switch (filters.type) {
      case 'public':
        filtered = filtered.filter(repo => !repo.private);
        break;
      case 'private':
        filtered = filtered.filter(repo => repo.private);
        break;
      case 'forks':
        filtered = filtered.filter(repo => repo.fork);
        break;
      case 'original':
        filtered = filtered.filter(repo => !repo.fork);
        break;
    }
  }

  return filtered;
};

// Local storage utilities
export const getStoredProfiles = () => {
  try {
    const stored = localStorage.getItem('gitflex-recent-profiles');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const addToStoredProfiles = profile => {
  try {
    const profiles = getStoredProfiles();
    const filtered = profiles.filter(p => p.login !== profile.login);
    const updated = [profile, ...filtered].slice(0, 10); // Keep only 10 recent profiles
    localStorage.setItem('gitflex-recent-profiles', JSON.stringify(updated));
  } catch (error) {
    console.error('Error storing profile:', error);
  }
};

// Animation utilities
export const getStaggerDelay = (index, baseDelay = 0.1) => {
  return index * baseDelay;
};

export const generateAnimationConfig = (index, direction = 'up') => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    scale: { scale: 0.9 }
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: { delay: getStaggerDelay(index), duration: 0.5, ease: 'easeOut' }
  };
};

// Theme utilities
export const getThemeColors = isDark => {
  return {
    background: isDark ? '#1C1C1E' : '#F5F5F5',
    surface: isDark ? '#2C2C2E' : '#EBEBEB',
    text: isDark ? '#FFFFFF' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    accent: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500'
  };
};

// Error utilities
export const getErrorMessage = error => {
  // Check for custom error messages first
  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status) {
    switch (error.response.status) {
      case 401:
        return 'GitHub authentication failed. Please check your token configuration.';
      case 403:
        const remainingRequests = error.response?.headers['x-ratelimit-remaining'];
        if (remainingRequests === '0') {
          return 'GitHub API rate limit exceeded. Please wait or add a GitHub token.';
        }
        return 'Access forbidden. You may need a GitHub token for this request.';
      case 404:
        return 'User not found';
      case 422:
        return 'Invalid request parameters';
      case 500:
        return 'GitHub server error occurred';
      case 502:
        return 'GitHub service temporarily unavailable';
      case 503:
        return 'GitHub service unavailable';
      default:
        return `GitHub API error (${error.response.status})`;
    }
  }

  // Handle network errors
  if (error.code === 'ENOTFOUND') {
    return 'Network error: Unable to connect to GitHub';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout: GitHub API took too long to respond';
  }

  return 'An unexpected error occurred while connecting to GitHub';
};

// Validation utilities
export const validateGitHubUsername = username => {
  if (!username) return false;

  // GitHub username rules
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return usernameRegex.test(username);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
