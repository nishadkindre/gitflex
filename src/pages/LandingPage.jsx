import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Github, Users, Star, TrendingUp, Sparkles, Zap, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { FeatureCard, ProfileCard } from '../components/ui/Card';
import { githubService } from '../services/githubService';
import { validateGitHubUsername, getStoredProfiles, addToStoredProfiles, debounce } from '../utils/helpers';

const HeroSection = ({ onSearch, isSearching }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async query => {
      if (query && query.length > 2) {
        try {
          const result = await githubService.searchUsers(query, { perPage: 5 });
          setSuggestions(result.items || []);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleInputChange = e => {
    const value = e.target.value;
    setUsername(value);
    setError('');
    debouncedSearch(value);
  };

  const handleSearch = async (searchUsername = username) => {
    const trimmedUsername = searchUsername.trim();

    if (!trimmedUsername) {
      setError('Please enter a GitHub username');
      return;
    }

    if (!validateGitHubUsername(trimmedUsername)) {
      setError('Invalid GitHub username format');
      return;
    }

    setShowSuggestions(false);
    onSearch(trimmedUsername);
  };

  const handleSuggestionClick = suggestion => {
    setUsername(suggestion.login);
    setShowSuggestions(false);
    handleSearch(suggestion.login);
  };

  return (
    <section className="relative py-20 px-4 pb-40">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-light-accent to-light-success dark:from-dark-accent dark:to-dark-success"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-light-success to-light-accent dark:from-dark-success dark:to-dark-accent"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Text */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="space-y-6">
          <motion.div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-secondary border border-border" whileHover={{ scale: 1.05 }}>
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Flex 💪 Your GitHub Profile</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Developer Story</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Create a beautiful, professional showcase of your GitHub profile</p>
        </motion.div>

        {/* Search Interface */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative max-w-lg mx-auto">
          <div className="relative">
            <div className="flex items-center bg-card border border-border rounded-lg shadow-neo dark:shadow-neo-dark overflow-hidden">
              <div className="flex items-center pl-4 text-muted-foreground">
                <Github size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={handleInputChange}
                className="flex-1 px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <Button
                id="search-button"
                aria-label="Search GitHub user"
                variant="default"
                onClick={() => handleSearch()}
                disabled={isSearching || !username.trim()}
                className="m-1 mr-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {/* Mobile-friendly button: icon-only on small screens, text+icon on md+ */}
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                    <span className="hidden md:inline">Searching...</span>
                  </div>
                ) : (
                  <>
                    <span className="md:flex items-center hidden">
                      View Profile
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                    <span className="flex md:hidden items-center justify-center">
                      <ArrowRight size={22} />
                    </span>
                  </>
                )}
              </Button>
            </div>

            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-neo dark:shadow-neo-dark z-50 overflow-hidden backdrop-blur-sm bg-card/95"
                >
                  <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border/30">
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        Found {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full p-3 text-left hover:bg-muted/50 transition-all duration-300 flex items-center space-x-4 group rounded-lg mx-1 my-1"
                        whileHover={{ backgroundColor: 'rgba(var(--muted), 0.8)' }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                      >
                        <div className="relative">
                          <img
                            src={suggestion.avatar_url}
                            alt={suggestion.login}
                            className="w-12 h-12 rounded-full ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300 shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card opacity-80"></div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{suggestion.name || suggestion.login}</p>
                            {suggestion.name && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">verified</span>}
                          </div>
                          {suggestion.type && <p className="text-xs text-muted-foreground/70 capitalize">{suggestion.type}</p>}
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">View Profile</div>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-muted/20 border-t border-border/30">
                    <p className="text-xs text-muted-foreground text-center">
                      Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Enter</kbd> to search or click to select
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: '',
      title: 'Connect GitHub',
      description: "Just drop your username and we'll grab all your repos, commits, and activity",
      icon: <Github size={32} />
    },
    {
      number: '2',
      title: 'We Do The Magic',
      description: 'Our system analyzes your code, creates beautiful charts, and builds your story',
      icon: <TrendingUp size={32} />
    },
    {
      number: '3',
      title: 'Share & Impress',
      description: 'Get a stunning URL that makes recruiters and clients go "wow, this dev is legit"',
      icon: <Star size={32} />
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Three steps to go from "meh" GitHub to "damn, impressive" portfolio</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && <div className="hidden md:block absolute top-32 left-full w-12 h-0.5 bg-border z-0 transform translate-x-0"></div>}

              {/* Card */}
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-neo dark:shadow-neo-dark transition-all duration-300 group-hover:shadow-neo-lg dark:group-hover:shadow-neo-dark-lg">
                {/* Step Number Badge */}
                {/* <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-neo dark:shadow-neo-dark">
                  {step.number}
                </div> */}

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <motion.div className="p-4 rounded-2xl bg-primary/10 text-primary" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                    {step.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }}>
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
            <Zap size={16} className="text-primary" />
            <span>Seriously, it takes like 30 seconds max</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WhatWeBuildSection = () => {
  const features = [
    {
      title: 'No More Boring Profiles',
      description: "Your GitHub profile probably looks like everyone else's. We fix that with a aesthetic design that actually makes people stop and look.",
      icon: <Sparkles size={24} />
    },
    {
      title: 'Real-Time Magic',
      description: 'Push code, see it instantly. Our GitHub API integration keeps everything fresh - no manual updates, no stale data.',
      icon: <TrendingUp size={24} />
    },
    {
      title: "Charts That Don't Suck",
      description: 'Contribution graphs, language breakdowns, commit patterns - all the data you care about, but actually readable and beautiful.',
      icon: <Eye size={24} />
    },
    {
      title: 'Works Everywhere',
      description: "Desktop, mobile, tablet - we built this thing to work perfectly everywhere because we're not savages.",
      icon: <Zap size={24} />
    },
    {
      title: 'Dark Mode Obviously',
      description: "Because who codes in light mode? Seamless theme switching that doesn't burn your retinas at 2 AM.",
      icon: <CheckCircle size={24} />
    },
    {
      title: 'Built For Speed',
      description: "Fast loading, smart caching, smooth animations. We obsessed over performance so you don't have to wait.",
      icon: <Star size={24} />
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">What We Actually Built</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Look, we're devs too. We know what sucks about showcasing your work online. So we built something that doesn't suck. Here's the honest breakdown:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-xl p-6 shadow-neo dark:shadow-neo-dark transition-all duration-300 hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg"
            >
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStackSection = () => {
  const techStack = [
    {
      name: 'React.js',
      description: "Because we're not masochists - modern UI that actually works",
      icon: '⚛️'
    },
    {
      name: 'Tailwind CSS',
      description: "Utility classes that don't make you want to throw your laptop",
      icon: '🎨'
    },
    {
      name: 'Framer Motion',
      description: 'Animations that are smooth, not seizure-inducing',
      icon: '🎬'
    },
    {
      name: 'GitHub API',
      description: 'The official one, not some sketchy third-party scraper',
      icon: '🐙'
    },
    {
      name: 'Vite',
      description: "Build tool that doesn't take coffee breaks",
      icon: '⚡'
    },
    {
      name: 'Open Source',
      description: 'MIT license - fork it, break it, fix it, whatever',
      icon: '🔓'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">The Stack We Picked</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We chose tools that don't suck. Modern, fast, reliable - the stuff you'd actually want to work with. No enterprise bloat, no legacy nightmares.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-xl p-6 shadow-neo dark:shadow-neo-dark transition-all duration-300 hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{tech.icon}</div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }}>
          <div className="inline-flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>No tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>No data collection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>100% privacy respect</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const RecentProfilesSection = ({ onProfileClick }) => {
  const [recentProfiles] = useState(() => getStoredProfiles());

  if (recentProfiles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Recently Viewed Profiles</h2>
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">Quick access to profiles you've explored recently</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recentProfiles.slice(0, 10).map((profile, index) => (
            <motion.div key={profile.login} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, duration: 0.5 }}>
              <ProfileCard profile={profile} onClick={() => onProfileClick(profile.login)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async username => {
    setIsSearching(true);
    try {
      // Pre-fetch user data to validate
      const userData = await githubService.getUser(username);
      addToStoredProfiles(userData);
      navigate(`/${username}`);
    } catch (error) {
      console.error('Search error:', error);
      // You could show a toast notification here
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfileClick = username => {
    navigate(`/${username}`);
  };

  return (
    <div className="space-y-0">
      <HeroSection onSearch={handleSearch} isSearching={isSearching} />
      <WhatWeBuildSection />
      <HowItWorksSection />
      {/* <TechStackSection /> */}
      <RecentProfilesSection onProfileClick={handleProfileClick} />
    </div>
  );
};

export default LandingPage;
