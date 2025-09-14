import React from 'react';
import { motion } from 'framer-motion';
import { Github, Zap, Palette, Smartphone, Shield, Rocket, Heart, Code2, Users, Star } from 'lucide-react';
import { FeatureCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

const AboutPage = () => {
  const features = [
    {
      title: 'Neomorphic Design',
      description: 'Experience the latest design trend with soft shadows and modern aesthetics that create depth without overwhelming the content.',
      icon: <Palette size={24} />
    },
    {
      title: 'Lightning Fast',
      description: 'Optimized performance with intelligent caching, lazy loading, and efficient API usage for the smoothest experience.',
      icon: <Zap size={24} />
    },
    {
      title: 'Fully Responsive',
      description: 'Perfect experience across all devices - desktop, tablet, and mobile with touch-friendly interactions.',
      icon: <Smartphone size={24} />
    },
    {
      title: 'Privacy Focused',
      description: 'No tracking, no data collection. We only use public GitHub API data and respect your privacy completely.',
      icon: <Shield size={24} />
    },
    {
      title: 'Modern Stack',
      description: 'Built with React, Tailwind CSS, Framer Motion, and the latest web technologies for optimal performance.',
      icon: <Rocket size={24} />
    },
    {
      title: 'Open Source',
      description: 'Fully open source and transparent. Contribute to the project or fork it for your own customizations.',
      icon: <Code2 size={24} />
    }
  ];

  const stats = [
    { label: 'GitHub Stars', value: '1.2K+', icon: Star },
    { label: 'Active Users', value: '5K+', icon: Users },
    { label: 'Profiles Viewed', value: '50K+', icon: Github },
    { label: 'Contributors', value: '12', icon: Heart }
  ];

  const techStack = [
    { name: 'React.js', description: 'Modern UI library for building interactive interfaces' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid styling' },
    { name: 'Framer Motion', description: 'Production-ready motion library for React' },
    { name: 'GitHub API', description: 'Official GitHub REST API for data fetching' },
    { name: 'Vite', description: 'Next generation frontend build tool' },
    { name: 'Chart.js', description: 'Beautiful, responsive charts and graphs' }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-light-surface dark:bg-dark-surface shadow-neo dark:shadow-neo-dark">
            <Github size={24} className="text-light-accent dark:text-dark-accent" />
            <span className="font-semibold text-light-text dark:text-dark-text text-lg">GitFlex</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-light-text dark:text-dark-text leading-tight">
            Showcase Your
            <span className="block gradient-text">Developer Journey</span>
          </h1>

          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary max-w-3xl mx-auto leading-relaxed">
            GitFlex transforms your GitHub profile into a beautiful, professional showcase using modern design principles and elegant data visualization. It's completely free, open source, and
            respects your privacy.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              className="card-neo p-4 text-center"
            >
              <stat.icon size={24} className="mx-auto text-light-accent dark:text-dark-accent mb-2" />
              <div className="font-bold text-xl text-light-text dark:text-dark-text">{stat.value}</div>
              <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Our Mission</h2>
            <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              We believe every developer has a unique story to tell. GitHub profiles contain amazing data about your coding journey, but the default interface doesn't do justice to your achievements.
            </p>
            <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              GitFlex was created to bridge this gap by providing a beautiful, modern interface that highlights your skills, contributions, and projects in a way that truly represents your developer
              identity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gradient" size="lg">
                <Github size={20} className="mr-2" />
                View on GitHub
              </Button>
              <Button variant="outline" size="lg">
                Try Demo Profile
              </Button>
            </div>
          </div>

          <motion.div className="relative" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <div className="card-neo p-8 bg-gradient-to-br from-light-accent/10 to-light-success/10 dark:from-dark-accent/10 dark:to-dark-success/10">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-light-accent to-light-success dark:from-dark-accent dark:to-dark-success" />
                  <div>
                    <div className="h-4 bg-light-surface dark:bg-dark-surface rounded w-24 mb-2" />
                    <div className="h-3 bg-light-bg dark:bg-dark-bg rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-light-surface dark:bg-dark-surface rounded w-full" />
                  <div className="h-3 bg-light-surface dark:bg-dark-surface rounded w-4/5" />
                  <div className="h-3 bg-light-surface dark:bg-dark-surface rounded w-3/5" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="card-neo p-2 text-center">
                    <div className="h-6 bg-light-bg dark:bg-dark-bg rounded mb-1" />
                    <div className="h-2 bg-light-surface dark:bg-dark-surface rounded" />
                  </div>
                  <div className="card-neo p-2 text-center">
                    <div className="h-6 bg-light-bg dark:bg-dark-bg rounded mb-1" />
                    <div className="h-2 bg-light-surface dark:bg-dark-surface rounded" />
                  </div>
                  <div className="card-neo p-2 text-center">
                    <div className="h-6 bg-light-bg dark:bg-dark-bg rounded mb-1" />
                    <div className="h-2 bg-light-surface dark:bg-dark-surface rounded" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Why Choose GitFlex?</h2>
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary max-w-2xl mx-auto">
            Discover the features that make GitFlex the perfect platform for showcasing your developer profile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Built with Modern Technologies</h2>
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">We use the latest and most reliable technologies to ensure the best experience</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-neo p-6 flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-neo bg-gradient-to-br from-light-accent to-light-success dark:from-dark-accent dark:to-dark-success flex items-center justify-center flex-shrink-0">
                <Code2 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">{tech.name}</h3>
                <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light-surface dark:bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Ready to Showcase Your Profile?</h2>
            <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary max-w-2xl mx-auto">
              Join thousands of developers who are already using GitFlex to present their work in the best possible way
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="gradient" size="lg" onClick={() => (window.location.href = '/')}>
              Get Started Now
            </Button>
            <Button variant="outline" size="lg">
              <Github size={20} className="mr-2" />
              Star on GitHub
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
