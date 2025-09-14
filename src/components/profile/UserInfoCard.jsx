import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, UserPlus, ExternalLink, Mail, Link as LinkIcon, Star, GitFork, Book } from 'lucide-react';
import { format } from 'date-fns';
import { getSocialIcon, detectSocialPlatform, ExternalLinkIcon, LocationIcon, CalendarIcon } from '../../utils/icons.jsx';
import { useGitHubSocialAccounts } from '../../hooks/useGitHub';

const UserInfoCard = ({ user, repos, className = '' }) => {
  if (!user) return null;

  // Fetch social accounts from GitHub API
  const { socialAccounts, loading: socialLoading, error: socialError } = useGitHubSocialAccounts(user.login);

  const totalStars = repos?.reduce((total, repo) => total + (repo.stargazers_count || 0), 0) || 0;
  const totalForks = repos?.reduce((total, repo) => total + (repo.forks_count || 0), 0) || 0;

  // Extract social links from user profile
  const socialLinks = [];

  // Extract from blog field
  if (user.blog) {
    const platform = detectSocialPlatform(user.blog);
    socialLinks.push({
      url: user.blog.startsWith('http') ? user.blog : `https://${user.blog}`,
      platform,
      label: platform === 'website' ? 'Website' : platform.charAt(0).toUpperCase() + platform.slice(1)
    });
  }

  // Extract from twitter_username field
  if (user.twitter_username) {
    socialLinks.push({
      url: `https://twitter.com/${user.twitter_username}`,
      platform: 'twitter',
      label: 'Twitter'
    });
  }

  // Extract from email field (if public)
  if (user.email) {
    socialLinks.push({
      url: `mailto:${user.email}`,
      platform: 'email',
      label: 'Email'
    });
  }

  // Extract social media URLs from bio
  if (user.bio) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = user.bio.match(urlRegex) || [];

    urls.forEach(url => {
      const platform = detectSocialPlatform(url);
      // Only add if it's a recognized social platform and not already added
      if (platform !== 'website' && !socialLinks.find(link => link.platform === platform)) {
        socialLinks.push({
          url,
          platform,
          label: platform.charAt(0).toUpperCase() + platform.slice(1)
        });
      }
    });
  }

  // Extract LinkedIn from company field if it's a LinkedIn URL
  if (user.company && user.company.includes('linkedin.com')) {
    const linkedinMatch = user.company.match(/linkedin\.com\/[^\/\s]+/);
    if (linkedinMatch && !socialLinks.find(link => link.platform === 'linkedin')) {
      socialLinks.push({
        url: `https://${linkedinMatch[0]}`,
        platform: 'linkedin',
        label: 'LinkedIn'
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
      // className={`sticky top-8 h-fit ${className}`}
    >
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6 space-y-6 shadow-neo dark:shadow-neo-dark">
        {/* Avatar and Basic Info */}
        <div className="text-center space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} className="relative inline-block">
            <img src={user.avatar_url} alt={user.name || user.login} className="w-24 h-24 rounded-full mx-auto ring-2 ring-border" />
            {user.type === 'Organization' && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                <Users size={12} />
              </div>
            )}
          </motion.div>

          <div>
            <h1 className="text-xl font-semibold text-foreground">{user.name || user.login}</h1>
            <p className="text-muted-foreground text-sm">@{user.login}</p>

            {/* Follower/Following counts right under username */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Users size={14} className="text-muted-foreground" />
                <span className="font-medium">{user.followers.toLocaleString()}</span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="flex items-center gap-1 text-sm">
                <UserPlus size={14} className="text-muted-foreground" />
                <span className="font-medium">{user.following.toLocaleString()}</span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>

            {user.bio && <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{user.bio}</p>}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <Book size={16} className="mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-medium">{user.public_repos}</div>
            <div className="text-xs text-muted-foreground">repos</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <Star size={16} className="mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-medium">{totalStars.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">stars</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <GitFork size={16} className="mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-medium">{totalForks.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">forks</div>
          </div>
        </div>

        {/* Location and Join Date */}
        <div className="space-y-2 text-sm">
          {user.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin size={14} className="mr-2 flex-shrink-0" />
              <span>{user.location}</span>
            </div>
          )}

          {user.created_at && (
            <div className="flex items-center text-muted-foreground">
              <Calendar size={14} className="mr-2 flex-shrink-0" />
              <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
            </div>
          )}

          {user.company && (
            <div className="flex items-center text-muted-foreground">
              <Users size={14} className="mr-2 flex-shrink-0" />
              <span>{user.company}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {(socialAccounts.length > 0 || socialLinks.length > 0) && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social</h3>
            <div className="flex flex-wrap gap-2">
              {/* GitHub API Social Accounts (priority) */}
              {socialAccounts.map((account, index) => {
                const platform = detectSocialPlatform(account.url);
                return (
                  <motion.a
                    key={`api-${index}`}
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
                    title={account.provider || platform}
                  >
                    {getSocialIcon(platform, 18)}
                  </motion.a>
                );
              })}

              {/* Fallback Profile Links (only if not covered by API) */}
              {socialLinks.map((link, index) => {
                // Skip if this platform is already covered by API social accounts
                const isDuplicate = socialAccounts.some(account => {
                  const apiPlatform = detectSocialPlatform(account.url);
                  return apiPlatform === link.platform;
                });

                if (isDuplicate) return null;

                return (
                  <motion.a
                    key={`fallback-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
                    title={link.label}
                  >
                    {getSocialIcon(link.platform, 18)}
                  </motion.a>
                );
              })}

              {/* GitHub Profile Link (always show) */}
              <motion.a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
                title="View on GitHub"
              >
                {getSocialIcon('github', 18)}
              </motion.a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserInfoCard;
