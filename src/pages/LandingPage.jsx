import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Github, Users, Star, TrendingUp, Sparkles, Zap, Eye, ArrowRight, CheckCircle, BarChart2, Globe, Lock, Activity, Monitor, Rocket, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import { FeatureCard, ProfileCard } from '../components/ui/Card';
import { githubService } from '../services/githubService';
import { validateGitHubUsername, getStoredProfiles, addToStoredProfiles, debounce } from '../utils/helpers';
import profilePreviewLight from '../assets/new-design/profile-light.webp';
import profilePreviewDark from '../assets/new-design/profile-dark.webp';
import { useTheme } from '../context/ThemeContext';

const HeroSection = ({ onSearch, isSearching }) => {
  const { theme } = useTheme();
  const profilePreview = theme === 'dark' ? profilePreviewDark : profilePreviewLight;
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
    if (!trimmedUsername) { setError('Please enter a GitHub username'); return; }
    if (!validateGitHubUsername(trimmedUsername)) { setError('Invalid GitHub username format'); return; }
    setShowSuggestions(false);
    onSearch(trimmedUsername);
  };

  const handleSuggestionClick = suggestion => {
    setUsername(suggestion.login);
    setShowSuggestions(false);
    handleSearch(suggestion.login);
  };

  return (
    <section className="relative z-10 py-16 md:py-24 px-4">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-green-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column — text + search */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary"
              whileHover={{ scale: 1.04 }}
            >
              <Sparkles size={15} />
              <span className="text-sm font-semibold tracking-wide">Flex 💪 Your GitHub Profile</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-primary via-green-500 to-emerald-400 bg-clip-text text-transparent">
                  Developer Story
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Automatic portfolio generation powered by your GitHub activity. Zero maintenance required — setup once, let it narrate your story.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
              <div className="flex items-center bg-card border border-border rounded-xl shadow-neo dark:shadow-neo-dark overflow-visible">
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
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      <span className="hidden md:inline">Searching...</span>
                    </div>
                  ) : (
                    <>
                      <span className="md:flex items-center hidden">View Profile <ArrowRight size={16} className="ml-2" /></span>
                      <span className="flex md:hidden items-center justify-center"><ArrowRight size={22} /></span>
                    </>
                  )}
                </Button>
              </div>

              {error && <p className="text-destructive text-sm mt-2">{error}</p>}

              {/* Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-neo dark:shadow-neo-dark z-50 overflow-hidden bg-card/95 backdrop-blur-sm"
                  >
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border/30">
                        <span className="flex items-center"><Users size={12} className="mr-1" />Found {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}</span>
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full p-3 text-left hover:bg-muted/50 transition-all duration-300 flex items-center space-x-4 group rounded-lg mx-1 my-1"
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                        >
                          <div className="relative">
                            <img src={suggestion.avatar_url} alt={suggestion.login} className="w-12 h-12 rounded-full ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300 shadow-sm" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card opacity-80" />
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

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                { icon: <Lock size={13} />, label: 'No sign-up required' },
                { icon: <Globe size={13} />, label: 'Public profiles only' },
                { icon: <Zap size={13} />, label: 'Instant results' },
              ].map(item => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right column — profile preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            {/* Browser chrome frame */}
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
              {/* Browser top bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/60 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground truncate">
                  gitflex.vercel.app/nishadkindre
                </div>
                <Github size={14} className="text-muted-foreground" />
              </div>
              {/* Screenshot */}
              <div className="relative overflow-hidden max-h-[480px]">
                <a href="https://gitflexx.vercel.app/nishadkindre" target="_blank" rel="noopener noreferrer">
                  <img
                    key={theme}
                    src={profilePreview}
                    alt="GitFlex profile preview"
                    className="w-full object-cover object-top transition-opacity duration-300"
                    loading="eager"
                    fetchpriority="high"
                  />
                </a>
                {/* Fade-out gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
              </div>
            </div>

            {/* Floating stats badges */}
            <motion.div
              className="absolute -left-6 top-16 bg-card border border-border rounded-xl px-4 py-3 shadow-neo dark:shadow-neo-dark flex items-center gap-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart2 size={18} className="text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Contribution graph</div>
                <div className="text-sm font-semibold text-foreground">260 this year</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-6 bottom-24 bg-card border border-border rounded-xl px-4 py-3 shadow-neo dark:shadow-neo-dark flex items-center gap-3"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="w-9 h-9 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                <Star size={18} className="text-yellow-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total stars</div>
                <div className="text-sm font-semibold text-foreground">11 stars</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatsBarSection = () => {
  const stats = [
    { icon: <Github size={18} />, value: 'GitHub-Powered', label: 'Live data from the official API' },
    { icon: <Zap size={18} />, value: 'Zero Setup', label: 'No account needed, ever' },
    { icon: <Shield size={18} />, value: 'Open Source', label: 'MIT licensed, fully transparent' },
    { icon: <CheckCircle size={18} />, value: '100% Free', label: 'No paywalls, no hidden fees' },
  ];

  return (
    <section className="border-y border-border py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 px-6 py-4 flex-1 hover:bg-primary/5 transition-colors duration-200"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Your Username',
      description: "Drop your GitHub username in the search bar. We grab your repos, commits, and activity — no login, no auth, nothing.",
      icon: <Github size={26} />,
    },
    {
      number: '02',
      title: 'We Do The Magic',
      description: 'Our system analyzes your code, builds beautiful charts, and constructs your developer story with rich visualizations.',
      icon: <Activity size={26} />,
    },
    {
      number: '03',
      title: 'Share & Impress',
      description: 'Get a stunning, shareable profile that makes recruiters and collaborators go "this dev is legit".',
      icon: <Rocket size={26} />,
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Zap size={14} />
            <span>Super Simple</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              30 seconds
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three steps from "just another GitHub profile" to "damn, this dev is impressive"
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting animated gradient line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/25 mb-8"
                >
                  <div className="absolute inset-1.5 rounded-full bg-black/10 flex items-center justify-center">
                    <div className="text-white">{step.icon}</div>
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                </motion.div>

                {/* Content card */}
                <div className="bg-card border border-border rounded-2xl p-6 w-full shadow-neo dark:shadow-neo-dark hover:border-primary/30 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 border border-border/50 px-5 py-2.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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
      description: "Your GitHub profile probably looks like everyone else's. We fix that with an aesthetic design that actually makes people stop and look.",
      icon: <Sparkles size={22} />,
      gradient: 'from-primary to-emerald-500',
    },
    {
      title: 'Real-Time Magic',
      description: 'Push code, see it instantly. GitHub API integration keeps everything fresh — no manual updates, no stale data.',
      icon: <Activity size={22} />,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: "Charts That Don't Suck",
      description: 'Contribution graphs, language breakdowns, commit patterns — all the data you care about, actually readable.',
      icon: <BarChart2 size={22} />,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Works Everywhere',
      description: 'Desktop, mobile, tablet — pixel-perfect on every screen because your portfolio should look great anywhere.',
      icon: <Monitor size={22} />,
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Dark Mode, Obviously',
      description: "Because who codes in light mode? Seamless theme switching that doesn't burn your retinas at 2AM.",
      icon: <Eye size={22} />,
      gradient: 'from-slate-500 to-slate-700',
    },
    {
      title: 'Built For Speed',
      description: 'Fast loading, smart caching, smooth animations. We obsessed over performance so you just get results.',
      icon: <Rocket size={22} />,
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Ambient glows */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div> */}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Sparkles size={14} />
            <span>What You Get</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Built For{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We know what sucks about showcasing your work online. So we built the thing we actually wanted.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group bg-card border border-border rounded-2xl p-7 overflow-hidden shadow-neo dark:shadow-neo-dark"
            >
              {/* Gradient top border accent */}
              {/* <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} /> */}
              {/* Hover background glow */}
              {/* <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} /> */}

              <div className="relative space-y-4">
                {/* <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div> */}
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Users size={14} />
            <span>Your History</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Recently Viewed{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Profiles</span>
          </h2>
          <p className="text-muted-foreground">Quick access to profiles you've explored recently</p>
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

const CTASection = ({ onSearch, isSearching }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    const trimmed = username.trim();
    if (!trimmed) { setError('Enter a GitHub username'); return; }
    if (!validateGitHubUsername(trimmed)) { setError('Invalid username format'); return; }
    setError('');
    onSearch(trimmed);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Rocket size={14} />
            <span>Ready to Flex?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Your story deserves a
            <span className="block bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              better stage.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Drop your GitHub username and see what your profile actually looks like when it's done right.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="flex items-center bg-card border border-border rounded-xl shadow-neo dark:shadow-neo-dark overflow-visible">
            <div className="flex items-center pl-4 text-muted-foreground">
              <Github size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            />
            <Button
              variant="default"
              onClick={handleSearch}
              disabled={isSearching || !username.trim()}
              className="m-1 mr-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-1.5">View Profile <ArrowRight size={16} /></span>
              )}
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-2 text-left">{error}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap"
        >
          <span className="flex items-center gap-1.5"><Lock size={11} className="text-primary" />No sign-up required</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5"><Shield size={11} className="text-primary" />Public data only</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5"><Zap size={11} className="text-primary" />Instant results</span>
        </motion.div>
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
      <StatsBarSection />
      <WhatWeBuildSection />
      <HowItWorksSection />
      <RecentProfilesSection onProfileClick={handleProfileClick} />
      {/* <CTASection onSearch={handleSearch} isSearching={isSearching} /> */}
    </div>
  );
};

export default LandingPage;
