import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, GitFork, Eye, ExternalLink, Calendar, Code, Tag, Info, Users } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { RepositoryCardSkeleton } from '../ui/Loading';
import { getSocialIcon, getLanguageIcon, ExternalLinkIcon } from '../../utils/icons.jsx';
import { formatRelativeTime, formatNumber, getLanguageColor, detectLiveDemo, sortRepositories, filterRepositories, truncateText } from '../../utils/helpers';
import { githubService } from '../../services/githubService';

const RepositoryCard = ({ repo, index, onInfoClick }) => {
  const liveDemo = detectLiveDemo(repo);
  const primaryLanguage = repo.language;

  // Get project preview image using appropriate API
  const getProjectPreview = liveDemo => {
    if (liveDemo) {
      // Use microlink.io API for live sites
      return `https://api.microlink.io?url=${encodeURIComponent(liveDemo)}&screenshot=true&embed=screenshot.url`;
    } else {
      // Use GitHub OpenGraph API for repositories without live demos
      return `https://opengraph.githubassets.com/show/${repo.owner.login}/${repo.name}`;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.5 }} whileHover={{ y: -4 }}>
      <div className="h-full flex flex-col bg-card text-card-foreground border border-border rounded-lg shadow-neo dark:shadow-neo-dark p-6 transition-all duration-200">
        {/* Project Preview Image */}
        <div className="mb-4 -mx-6 -mt-6">
          <img
            src={getProjectPreview(liveDemo)}
            alt={`${repo.name} preview`}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
            onError={e => {
              // Fallback to GitHub OpenGraph if microlink fails
              if (liveDemo && e.target.src.includes('microlink.io')) {
                e.target.src = `https://opengraph.githubassets.com/show/${repo.owner.login}/${repo.name}`;
              }
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <motion.h3 className="font-semibold text-foreground truncate">{repo.name}</motion.h3>

              {/* Info Icon */}
              <motion.button
                onClick={() => onInfoClick && onInfoClick(repo)}
                className="p-1 hover:bg-muted/50 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="View repository details"
              >
                <Info size={16} className="text-muted-foreground hover:text-foreground" />
              </motion.button>

              {repo.private && <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">Private</span>}
              {repo.fork && <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">Fork</span>}
            </div>

            {repo.description && <p className="text-sm text-muted-foreground leading-relaxed">{truncateText(repo.description, 100)}</p>}
          </div>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 4).map(topic => (
              <span key={topic} className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md">
                {topic}
              </span>
            ))}
            {repo.topics.length > 4 && <span className="px-2 py-1 text-xs text-muted-foreground">+{repo.topics.length - 4}</span>}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {primaryLanguage && (
              <div className="flex items-center space-x-1">
                {getLanguageIcon(primaryLanguage, 14)}
                <span className="text-xs">{primaryLanguage}</span>
              </div>
            )}

            {repo.stargazers_count > 0 && (
              <div className="flex items-center space-x-1">
                <Star size={12} />
                <span className="text-xs">{formatNumber(repo.stargazers_count)}</span>
              </div>
            )}

            {repo.forks_count > 0 && (
              <div className="flex items-center space-x-1">
                <GitFork size={12} />
                <span className="text-xs">{formatNumber(repo.forks_count)}</span>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            {/* GitHub Link */}
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted/50 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="View on GitHub"
            >
              {getSocialIcon('github', 16)}
            </motion.a>

            {/* Live Demo Link */}
            {liveDemo && (
              <motion.a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="View Live Site"
              >
                <ExternalLink size={16} className="text-primary" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RepositoryDetailModal = ({ repo, isOpen, onClose }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  useEffect(() => {
    if (isOpen && repo) {
      setLoadingCollaborators(true);
      githubService
        .getRepositoryCollaborators(repo.owner.login, repo.name)
        .then(collabs => {
          // Limit to first 6 collaborators and ensure owner is highlighted
          const sortedCollabs = collabs
            .sort((a, b) => {
              if (a.login === repo.owner.login) return -1;
              if (b.login === repo.owner.login) return 1;
              return 0;
            })
            .slice(0, 6);
          setCollaborators(sortedCollabs);
        })
        .catch(() => setCollaborators([]))
        .finally(() => setLoadingCollaborators(false));
    }
  }, [isOpen, repo]);

  if (!isOpen || !repo) return null;

  const liveDemo = detectLiveDemo(repo);
  const primaryLanguage = repo.language;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card text-card-foreground border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">{getLanguageIcon(primaryLanguage, 20)}</div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{repo.name}</h2>
                <p className="text-sm text-muted-foreground">@{repo.owner.login}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {repo.description && <p className="text-muted-foreground leading-relaxed">{repo.description}</p>}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Star size={16} className="mx-auto text-primary mb-1" />
              <div className="text-lg font-semibold text-foreground">{formatNumber(repo.stargazers_count)}</div>
              <div className="text-xs text-muted-foreground">Stars</div>
            </div>
            <div className="text-center">
              <GitFork size={16} className="mx-auto text-primary mb-1" />
              <div className="text-lg font-semibold text-foreground">{formatNumber(repo.forks_count)}</div>
              <div className="text-xs text-muted-foreground">Forks</div>
            </div>
            <div className="text-center">
              <Eye size={16} className="mx-auto text-primary mb-1" />
              <div className="text-lg font-semibold text-foreground">{formatNumber(repo.watchers_count)}</div>
              <div className="text-xs text-muted-foreground">Watching</div>
            </div>
            <div className="text-center">
              <Code size={16} className="mx-auto text-primary mb-1" />
              <div className="text-lg font-semibold text-foreground">{Math.round(repo.size / 1024) || '<1'}</div>
              <div className="text-xs text-muted-foreground">MB</div>
            </div>
          </div>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {repo.topics.map(topic => (
                  <span key={topic} className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collaborators */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Users size={16} className="mr-2" />
              Collaborators
            </h4>
            {loadingCollaborators ? (
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-muted/30 rounded-full animate-pulse"></div>
                ))}
              </div>
            ) : collaborators.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {collaborators.map(collaborator => (
                  <motion.div key={collaborator.login} className="relative group" whileHover={{ scale: 1.1 }}>
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.login}
                      className={`w-10 h-10 rounded-full border-2 ${collaborator.login === repo.owner.login ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                    />
                    {collaborator.login === repo.owner.login && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">★</div>
                    )}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {collaborator.login}
                      {collaborator.login === repo.owner.login && ' (Owner)'}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No collaborators found</p>
            )}
          </div>

          {/* Compact Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium">{primaryLanguage || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium">{repo.license?.spdx_id || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Default Branch</span>
                <span className="font-medium">{repo.default_branch}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatRelativeTime(repo.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">{formatRelativeTime(repo.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium">{repo.private ? 'Private' : 'Public'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {getSocialIcon('github', 16)}
              <span>GitHub</span>
            </motion.a>

            {liveDemo && (
              <motion.a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink size={16} />
                <span>Live Site</span>
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FilterControls = ({ filters, onFiltersChange, languages, totalCount }) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'updated', label: 'Recently updated' },
    { value: 'created', label: 'Recently created' },
    { value: 'name', label: 'Name' },
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' }
  ];

  const typeOptions = [
    { value: '', label: 'All repositories' },
    { value: 'original', label: 'Original only' },
    { value: 'forks', label: 'Forks only' }
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle - Commented out for minimalist design */}
      {/* 
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search repositories..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            leftIcon={<Search size={16} />}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
            {totalCount} repositories
          </span>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="whitespace-nowrap"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-neo p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Sort by
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
                  className="input-neo w-full"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
                  className="input-neo w-full"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
                  className="input-neo w-full"
                >
                  <option value="">All languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(filters.search || filters.language || filters.type !== '' || filters.sortBy !== 'updated') && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => onFiltersChange({ 
                    search: '', 
                    language: '', 
                    type: '', 
                    sortBy: 'updated' 
                  })}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </div>
  );
};

const RepositoryShowcase = ({ repos, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    language: '',
    type: '',
    sortBy: 'updated'
  });

  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const handleImageClick = repo => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRepo(null);
  };

  const languages = useMemo(() => {
    if (!repos) return [];
    return [...new Set(repos.filter(repo => repo.language).map(repo => repo.language))].sort();
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    if (!repos) return [];

    let filtered = filterRepositories(repos, filters);
    filtered = sortRepositories(filtered, filters.sortBy);

    return filtered;
  }, [repos, filters]);

  // Determine which repos to display based on showAllRepos state
  const displayRepos = useMemo(() => {
    if (showAllRepos || filteredAndSortedRepos.length <= 4) {
      return filteredAndSortedRepos;
    }
    return filteredAndSortedRepos.slice(0, 4);
  }, [filteredAndSortedRepos, showAllRepos]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card-neo p-4">
          <div className="skeleton h-10 w-64 rounded mb-4" />
          <div className="skeleton h-8 w-full rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <RepositoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-12">
        <Code size={48} className="mx-auto text-light-textSecondary dark:text-dark-textSecondary mb-4" />
        <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">No repositories found</h3>
        <p className="text-light-textSecondary dark:text-dark-textSecondary">This user doesn't have any public repositories yet.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Projects</h2>
      </div>

      <FilterControls filters={filters} onFiltersChange={setFilters} languages={languages} totalCount={repos.length} />

      {filteredAndSortedRepos.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-light-textSecondary dark:text-dark-textSecondary mb-4" />
          <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">No repositories match your filters</h3>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">Try adjusting your search criteria or clearing the filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayRepos.map((repo, index) => (
              <RepositoryCard key={repo.id} repo={repo} index={index} onInfoClick={handleImageClick} />
            ))}
          </div>

          {/* Show More/Less Button */}
          {filteredAndSortedRepos.length > 4 && (
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAllRepos(!showAllRepos)} className="text-primary hover:text-primary-foreground hover:bg-primary transition-colors">
                {showAllRepos ? 'Show Less' : `Show More (${filteredAndSortedRepos.length - 4})`}
              </Button>
            </div>
          )}

          <AnimatePresence>
            <RepositoryDetailModal repo={selectedRepo} isOpen={isModalOpen} onClose={closeModal} />
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default RepositoryShowcase;
