import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useGitHubUser, useGitHubRepos } from '../hooks/useGitHub';
import { validateGitHubUsername } from '../utils/helpers';
import { ProfileSkeleton } from '../components/ui/Loading';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import UserInfoCard from '../components/profile/UserInfoCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import RepositoryShowcase from '../components/profile/RepositoryShowcase';
import ContributionGraph from '../components/profile/ContributionGraph';

const ErrorCard = ({ error, onRetry, username }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Card className="text-center p-8">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">{error.includes('not found') ? 'User Not Found' : 'Something went wrong'}</h2>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
          {error.includes('not found') ? `The user "${username}" could not be found on GitHub. Please check the username and try again.` : error}
        </p>
        <div className="space-x-4">
          <Button variant="gradient" onClick={onRetry}>
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { username } = useParams();

  // Validate username format
  if (!username || !validateGitHubUsername(username)) {
    return <Navigate to="/404" replace />;
  }

  const { user, loading: userLoading, error: userError, refetch: refetchUser } = useGitHubUser(username);
  const { repos, loading: reposLoading, error: reposError, refetch: refetchRepos } = useGitHubRepos(username);

  const isLoading = userLoading || reposLoading;
  const hasError = userError || reposError;
  const error = userError || reposError;

  // Set page title
  useEffect(() => {
    if (user) {
      document.title = `${user.name || user.login} (@${user.login}) - GitFlex`;
    } else {
      document.title = `@${username} - GitFlex`;
    }

    // Cleanup
    return () => {
      document.title = 'GitFlex - GitHub Profile Showcase';
    };
  }, [user, username]);

  const handleRetry = () => {
    refetchUser();
    refetchRepos();
  };

  // Loading state
  if (isLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  // Error state
  if (hasError && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorCard error={error} onRetry={handleRetry} username={username} />
      </div>
    );
  }

  // Main content
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile/Tablet Layout (stacked) */}
        <div className="lg:hidden space-y-8">
          {/* Mobile User Info */}
          <UserInfoCard user={user} repos={repos} />

          {/* Mobile Repository Showcase */}
          <RepositoryShowcase repos={repos} loading={reposLoading} />

          {/* Mobile Contribution Analysis */}
          <ContributionGraph repos={repos} user={user} />
        </div>

        {/* Desktop Layout (side by side) */}
        <div className="hidden lg:flex lg:gap-8">
          {/* Left Sidebar - Fixed User Info Card */}
          <div className="w-80 flex-shrink-0">
            <UserInfoCard user={user} repos={repos} className="sticky top-20 z-10" />
          </div>

          {/* Right Content - Scrollable */}
          <div className="flex-1 min-w-0 space-y-12">
            {/* Repository Showcase */}
            <RepositoryShowcase repos={repos} loading={reposLoading} />

            {/* Contribution Analysis */}
            <ContributionGraph repos={repos} user={user} />
          </div>
        </div>
      </div>

      {/* Loading overlay for refreshing data */}
      {isLoading && user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed top-4 right-4 z-50">
          <div className="bg-card border border-border rounded-lg px-4 py-2 flex items-center space-x-2">
            <RefreshCw size={16} className="animate-spin text-primary" />
            <span className="text-sm text-foreground">Updating...</span>
          </div>
        </motion.div>
      )}

      {/* Error notifications for partial failures */}
      {reposError && user && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 right-4 z-50">
          <Card className="max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200">Partial Data Load</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{reposError && 'Repository data could not be loaded. '}</p>
                <Button variant="ghost" size="sm" onClick={handleRetry} className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
