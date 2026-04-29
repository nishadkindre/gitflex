const BASE_URL = 'https://api.github.com';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'gf_cache_';

// Build request headers, injecting auth token if available
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token && token !== 'your_github_personal_access_token_here' && token.trim() !== '') {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Translate HTTP error responses into friendly thrown errors
const handleResponse = async (response, url) => {
  if (response.status === 401) {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token || token === 'your_github_personal_access_token_here') {
      throw new Error('GitHub token not configured. Please set VITE_GITHUB_TOKEN in your .env file.');
    }
    throw new Error('Invalid GitHub token. Please check your VITE_GITHUB_TOKEN in your .env file.');
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining === '0') {
      const resetDate = new Date(reset * 1000);
      throw new Error(`Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
    }
    throw new Error('Access forbidden. You may need a GitHub token for this request.');
  }

  if (response.status === 404) {
    throw new Error('User not found');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('GitHub API Error:', { status: response.status, message: data.message, url });
    throw new Error(data.message || 'GitHub API request failed');
  }

  return response.json();
};

// Core fetch wrapper with timeout and error normalisation
const githubFetch = async (path, params = {}) => {
  const queryString = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
  const url = `${BASE_URL}${path}${queryString}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { headers: getHeaders(), signal: controller.signal });
    clearTimeout(timeoutId);
    return handleResponse(response, url);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw err;
  }
};

// localStorage-backed cache — survives page reloads within the TTL
const getCacheKey = (url, params = {}) => {
  const paramString = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
  return `${CACHE_PREFIX}${url}${paramString}`;
};

const getCachedData = key => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const cached = JSON.parse(item);
    if (Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;
    localStorage.removeItem(key);
  } catch {
    // Corrupt entry — ignore
  }
  return null;
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage quota exceeded — skip caching silently
  }
};

// GitHub API service functions
export const githubService = {
  // Get user profile
  async getUser(username) {
    const cacheKey = getCacheKey(`/users/${username}`);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const userData = await githubFetch(`/users/${username}`);
    setCachedData(cacheKey, userData);
    return userData;
  },

  // Get user repositories
  async getUserRepos(username, options = {}) {
    const params = {
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
      page: options.page || 1,
      type: options.type || 'owner',
    };

    const cacheKey = getCacheKey(`/users/${username}/repos`, params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const reposData = await githubFetch(`/users/${username}/repos`, params);
    setCachedData(cacheKey, reposData);
    return reposData;
  },

  // Get repository details
  async getRepository(owner, repo) {
    const cacheKey = getCacheKey(`/repos/${owner}/${repo}`);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const repoData = await githubFetch(`/repos/${owner}/${repo}`);
    setCachedData(cacheKey, repoData);
    return repoData;
  },

  // Get repository languages
  async getRepositoryLanguages(owner, repo) {
    const cacheKey = getCacheKey(`/repos/${owner}/${repo}/languages`);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const languagesData = await githubFetch(`/repos/${owner}/${repo}/languages`);
    setCachedData(cacheKey, languagesData);
    return languagesData;
  },

  // Get repository collaborators
  async getRepositoryCollaborators(owner, repo, options = {}) {
    const params = { per_page: options.perPage || 30, page: options.page || 1 };
    const cacheKey = getCacheKey(`/repos/${owner}/${repo}/collaborators`, params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      const collaboratorsData = await githubFetch(`/repos/${owner}/${repo}/collaborators`, params);
      setCachedData(cacheKey, collaboratorsData);
      return collaboratorsData;
    } catch (error) {
      // Private repo or no access — return empty array gracefully
      if (error.message.includes('forbidden') || error.message === 'User not found') return [];
      throw error;
    }
  },

  // Get user's organizations
  async getUserOrganizations(username) {
    const cacheKey = getCacheKey(`/users/${username}/orgs`);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const orgsData = await githubFetch(`/users/${username}/orgs`);
    setCachedData(cacheKey, orgsData);
    return orgsData;
  },

  // Get user's followers
  async getUserFollowers(username, options = {}) {
    const params = { per_page: options.perPage || 30, page: options.page || 1 };
    const cacheKey = getCacheKey(`/users/${username}/followers`, params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const followersData = await githubFetch(`/users/${username}/followers`, params);
    setCachedData(cacheKey, followersData);
    return followersData;
  },

  // Get user's following
  async getUserFollowing(username, options = {}) {
    const params = { per_page: options.perPage || 30, page: options.page || 1 };
    const cacheKey = getCacheKey(`/users/${username}/following`, params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const followingData = await githubFetch(`/users/${username}/following`, params);
    setCachedData(cacheKey, followingData);
    return followingData;
  },

  // Search users
  async searchUsers(query, options = {}) {
    const params = {
      q: query,
      sort: options.sort || 'best-match',
      order: options.order || 'desc',
      per_page: options.perPage || 10,
      page: options.page || 1,
    };

    const cacheKey = getCacheKey('/search/users', params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const searchData = await githubFetch('/search/users', params);
    setCachedData(cacheKey, searchData);
    return searchData;
  },

  // Get rate limit info
  async getRateLimit() {
    return githubFetch('/rate_limit');
  },

  // Test token validity and API connectivity
  async testConnection() {
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;

      if (!token || token === 'your_github_personal_access_token_here' || token.trim() === '') {
        const data = await githubFetch('/rate_limit');
        return { authenticated: false, valid: true, rateLimit: data.rate };
      } else {
        const userData = await githubFetch('/user');
        return {
          authenticated: true,
          valid: true,
          user: userData.login,
          rateLimit: await this.getRateLimit(),
        };
      }
    } catch (error) {
      if (error.message.includes('Invalid GitHub token')) {
        return { authenticated: false, valid: false, error: 'Invalid token' };
      }
      throw error;
    }
  },

  // Get user's social accounts
  async getUserSocialAccounts(username) {
    const cacheKey = getCacheKey(`/users/${username}/social_accounts`);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      const socialAccounts = await githubFetch(`/users/${username}/social_accounts`);
      setCachedData(cacheKey, socialAccounts);
      return socialAccounts;
    } catch (error) {
      if (error.message === 'User not found') return [];
      throw error;
    }
  },

  // Clear all cached entries created by this service
  clearCache() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  },

  // Count cached entries
  getCacheSize() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith(CACHE_PREFIX)) count++;
    }
    return count;
  },
};

export default githubService;
