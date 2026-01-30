import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/githubService';
import { AlertTriangle, CheckCircle, ExternalLink, Info } from 'lucide-react';

const GitHubTokenStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    setLoading(true);
    try {
      const result = await githubService.testConnection();
      setStatus(result);
    } catch (error) {
      setStatus({
        authenticated: false,
        valid: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800 dark:text-blue-200">Checking GitHub API status...</span>
        </div>
      </div>
    );
  }

  if (status?.valid && status?.authenticated) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-green-800 dark:text-green-200 font-semibold mb-1">
              GitHub API Connected
            </h4>
            <p className="text-green-700 dark:text-green-300 text-sm mb-2">
              Authenticated as <strong>{status.user}</strong>
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs">
              Rate limit: {status.rateLimit?.rate?.remaining || 'N/A'}/{status.rateLimit?.rate?.limit || 'N/A'} requests remaining per hour
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status?.valid && !status?.authenticated) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="text-yellow-600 dark:text-yellow-400 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
              GitHub API (Unauthenticated)
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
              Working with limited rate limits (60 requests/hour)
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 text-xs mb-3">
              Rate limit: {status.rateLimit?.remaining || 'N/A'}/{status.rateLimit?.limit || 'N/A'} requests remaining
            </p>
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 text-sm underline"
            >
              Get a GitHub token for higher limits
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="text-red-600 dark:text-red-400 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-red-800 dark:text-red-200 font-semibold mb-1">
            GitHub API Configuration Issue
          </h4>
          <p className="text-red-700 dark:text-red-300 text-sm mb-3">
            {status?.error || 'Unable to connect to GitHub API'}
          </p>
          <div className="space-y-2">
            <div className="text-red-600 dark:text-red-400 text-sm">
              <strong>To fix this:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                <li>Create a <code className="bg-red-100 dark:bg-red-800 px-1 rounded">.env</code> file in your project root</li>
                <li>Add: <code className="bg-red-100 dark:bg-red-800 px-1 rounded">VITE_GITHUB_TOKEN=your_token_here</code></li>
                <li>Get a token from GitHub Settings → Developer settings → Personal access tokens</li>
                <li>Restart your development server</li>
              </ol>
            </div>
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 text-sm underline"
            >
              Create GitHub Token
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubTokenStatus;