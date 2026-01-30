import axios from 'axios';

const BASE_URL = 'https://api.github.com';

// Create axios instance with default config
const githubAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication if token exists
githubAPI.interceptors.request.use(
  config => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token && token !== 'your_github_personal_access_token_here' && token.trim() !== '') {
      // Use Bearer token format for modern GitHub API
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
githubAPI.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token || token === 'your_github_personal_access_token_here') {
        throw new Error('GitHub token not configured. Please set VITE_GITHUB_TOKEN in your .env file.');
      } else {
        throw new Error('Invalid GitHub token. Please check your VITE_GITHUB_TOKEN in your .env file.');
      }
    }

    // Handle rate limiting
    if (error.response?.status === 403) {
      const remainingRequests = error.response?.headers['x-ratelimit-remaining'];
      const resetTime = error.response?.headers['x-ratelimit-reset'];
      
      if (remainingRequests === '0') {
        const resetDate = new Date(resetTime * 1000);
        throw new Error(`Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
      } else {
        throw new Error('Access forbidden. You may need a GitHub token for this request.');
      }
    }

    // Handle not found
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ENETUNREACH') {
      throw new Error('Network error. Please check your internet connection.');
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    // Log the error for debugging
    console.error('GitHub API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      headers: error.config?.headers
    });

    throw error;
  }
);

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (url, params = {}) => {
  const paramString = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
  return `${url}${paramString}`;
};

const getCachedData = key => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// GitHub API service functions
export const githubService = {
  // Get user profile
  async getUser(username) {
    const cacheKey = getCacheKey(`/users/${username}`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}`);
      const userData = response.data;
      setCachedData(cacheKey, userData);
      return userData;
    } catch (error) {
      throw error;
    }
  },

  // Get user repositories
  async getUserRepos(username, options = {}) {
    const params = {
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
      page: options.page || 1,
      type: options.type || 'owner'
    };

    const cacheKey = getCacheKey(`/users/${username}/repos`, params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}/repos`, { params });
      const reposData = response.data;
      setCachedData(cacheKey, reposData);
      return reposData;
    } catch (error) {
      throw error;
    }
  },

  // Get repository details
  async getRepository(owner, repo) {
    const cacheKey = getCacheKey(`/repos/${owner}/${repo}`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}`);
      const repoData = response.data;
      setCachedData(cacheKey, repoData);
      return repoData;
    } catch (error) {
      throw error;
    }
  },

  // Get repository languages
  async getRepositoryLanguages(owner, repo) {
    const cacheKey = getCacheKey(`/repos/${owner}/${repo}/languages`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/languages`);
      const languagesData = response.data;
      setCachedData(cacheKey, languagesData);
      return languagesData;
    } catch (error) {
      throw error;
    }
  },

  // Get repository collaborators
  async getRepositoryCollaborators(owner, repo, options = {}) {
    const params = {
      per_page: options.perPage || 30,
      page: options.page || 1
    };

    const cacheKey = getCacheKey(`/repos/${owner}/${repo}/collaborators`, params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/collaborators`, { params });
      const collaboratorsData = response.data;
      setCachedData(cacheKey, collaboratorsData);
      return collaboratorsData;
    } catch (error) {
      // If collaborators are not accessible (private repo, no access), return empty array
      if (error.response?.status === 403 || error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Get user's organizations
  async getUserOrganizations(username) {
    const cacheKey = getCacheKey(`/users/${username}/orgs`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}/orgs`);
      const orgsData = response.data;
      setCachedData(cacheKey, orgsData);
      return orgsData;
    } catch (error) {
      throw error;
    }
  },

  // Get user's followers
  async getUserFollowers(username, options = {}) {
    const params = {
      per_page: options.perPage || 30,
      page: options.page || 1
    };

    const cacheKey = getCacheKey(`/users/${username}/followers`, params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}/followers`, { params });
      const followersData = response.data;
      setCachedData(cacheKey, followersData);
      return followersData;
    } catch (error) {
      throw error;
    }
  },

  // Get user's following
  async getUserFollowing(username, options = {}) {
    const params = {
      per_page: options.perPage || 30,
      page: options.page || 1
    };

    const cacheKey = getCacheKey(`/users/${username}/following`, params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}/following`, { params });
      const followingData = response.data;
      setCachedData(cacheKey, followingData);
      return followingData;
    } catch (error) {
      throw error;
    }
  },

  // Search users
  async searchUsers(query, options = {}) {
    const params = {
      q: query,
      sort: options.sort || 'best-match',
      order: options.order || 'desc',
      per_page: options.perPage || 10,
      page: options.page || 1
    };

    const cacheKey = getCacheKey('/search/users', params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get('/search/users', { params });
      const searchData = response.data;
      setCachedData(cacheKey, searchData);
      return searchData;
    } catch (error) {
      throw error;
    }
  },

  // Get rate limit info
  async getRateLimit() {
    try {
      const response = await githubAPI.get('/rate_limit');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Test token validity and API connectivity
  async testConnection() {
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      
      if (!token || token === 'your_github_personal_access_token_here' || token.trim() === '') {
        // Test unauthenticated request
        const response = await githubAPI.get('/rate_limit');
        return {
          authenticated: false,
          valid: true,
          rateLimit: response.data.rate
        };
      } else {
        // Test authenticated request
        const response = await githubAPI.get('/user');
        return {
          authenticated: true,
          valid: true,
          user: response.data.login,
          rateLimit: await this.getRateLimit()
        };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          authenticated: false,
          valid: false,
          error: 'Invalid token'
        };
      }
      throw error;
    }
  },

  // Get user's social accounts
  async getUserSocialAccounts(username) {
    const cacheKey = getCacheKey(`/users/${username}/social_accounts`);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await githubAPI.get(`/users/${username}/social_accounts`);
      const socialAccounts = response.data;
      setCachedData(cacheKey, socialAccounts);
      return socialAccounts;
    } catch (error) {
      // If the API returns 404 or another error, return empty array
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Clear cache
  clearCache() {
    cache.clear();
  },

  // Get cache size
  getCacheSize() {
    return cache.size;
  }
};

export default githubService;
