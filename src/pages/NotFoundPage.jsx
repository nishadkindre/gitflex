import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Github, Users, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ProfileCard } from '../components/ui/Card';
import { getStoredProfiles, validateGitHubUsername } from '../utils/helpers';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [recentProfiles] = useState(() => getStoredProfiles().slice(0, 6));

  const handleSearch = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername && validateGitHubUsername(trimmedUsername)) {
      navigate(`/${trimmedUsername}`);
    }
  };

  const handleProfileClick = profileUsername => {
    navigate(`/${profileUsername}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* 404 Animation */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <motion.div
            className="text-8xl md:text-9xl font-bold gradient-text"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            404
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Developer Not Found</h1>
            <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary max-w-2xl mx-auto">
              The GitHub profile you're looking for doesn't exist or might have been moved. Let's help you find the right developer!
            </p>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Search for a GitHub User</h2>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={e => setUsername(e.target.value)}
              leftIcon={<Github size={20} />}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button variant="gradient" onClick={handleSearch} disabled={!username.trim()}>
              <Search size={16} className="mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* Recent Profiles */}
        {recentProfiles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="space-y-6">
            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Recently Viewed Profiles</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {recentProfiles.map((profile, index) => (
                <motion.div key={profile.login} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}>
                  <ProfileCard profile={profile} onClick={() => handleProfileClick(profile.login)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="space-y-6">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Popular GitHub Profiles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                username: 'torvalds',
                name: 'Linus Torvalds',
                description: 'Creator of Linux & Git',
                icon: <TrendingUp size={20} />
              },
              {
                username: 'octocat',
                name: 'The Octocat',
                description: "GitHub's mascot",
                icon: <Github size={20} />
              },
              {
                username: 'microsoft',
                name: 'Microsoft',
                description: 'Technology company',
                icon: <Users size={20} />
              }
            ].map((suggestion, index) => (
              <motion.div
                key={suggestion.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="card-neo p-6 text-center cursor-pointer"
                onClick={() => navigate(`/${suggestion.username}`)}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-neo bg-gradient-to-br from-light-accent to-light-success dark:from-dark-accent dark:to-dark-success text-white mb-4">
                  {suggestion.icon}
                </div>
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">{suggestion.name}</h3>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">@{suggestion.username}</p>
                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">{suggestion.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>

          <Button variant="ghost" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
