import { useState, useEffect } from 'react';
import { githubService } from '../services/githubService';
import { getErrorMessage, addToStoredProfiles } from '../utils/helpers';

export const useGitHubUser = username => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async username => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await githubService.getUser(username);
      setUser(userData);
      addToStoredProfiles(userData);
    } catch (err) {
      setError(getErrorMessage(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(username);
  }, [username]);

  const refetch = () => fetchUser(username);

  return { user, loading, error, refetch };
};

export const useGitHubRepos = (username, options = {}) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = async (username, fetchOptions = {}) => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const reposData = await githubService.getUserRepos(username, {
        sort: fetchOptions.sort || 'updated',
        direction: fetchOptions.direction || 'desc',
        perPage: fetchOptions.perPage || 30,
        type: fetchOptions.type || 'owner',
        ...fetchOptions
      });

      setRepos(reposData);
    } catch (err) {
      setError(getErrorMessage(err));
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(username, options);
  }, [username, JSON.stringify(options)]);

  const refetch = (newOptions = {}) => {
    fetchRepos(username, { ...options, ...newOptions });
  };

  return { repos, loading, error, refetch };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = toast => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after 5 seconds for non-error toasts
    if (toast.type !== 'error') {
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }

    return id;
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };
};

export const useGitHubSocialAccounts = username => {
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSocialAccounts = async username => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const socialData = await githubService.getUserSocialAccounts(username);
      setSocialAccounts(socialData || []);
    } catch (err) {
      setError(getErrorMessage(err));
      setSocialAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialAccounts(username);
  }, [username]);

  const refetch = () => fetchSocialAccounts(username);

  return { socialAccounts, loading, error, refetch };
};
