import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Link as LinkIcon, Mail, Calendar, Users, UserCheck, Clock, ExternalLink } from 'lucide-react';
import { StatsCard } from '../ui/Card';
import { formatDate, formatNumber } from '../../utils/helpers';

const ProfileHeader = ({ user, repos }) => {
  if (!user) return null;

  const stats = [
    {
      title: 'Repositories',
      value: formatNumber(user.public_repos),
      subtitle: 'Public repos',
      icon: <Users size={20} />
    },
    {
      title: 'Followers',
      value: formatNumber(user.followers),
      subtitle: 'Following you',
      icon: <UserCheck size={20} />
    },
    {
      title: 'Following',
      value: formatNumber(user.following),
      subtitle: 'You follow',
      icon: <Users size={20} />
    },
    {
      title: 'Joined',
      value: new Date(user.created_at).getFullYear(),
      subtitle: formatDate(user.created_at, 'MMM yyyy'),
      icon: <Calendar size={20} />
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* Profile Info */}
      <div className="card-neo p-8">
        <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Avatar */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="flex-shrink-0">
            <div className="relative">
              <img src={user.avatar_url} alt={user.name || user.login} className="w-32 h-32 lg:w-40 lg:h-40 rounded-full shadow-neo dark:shadow-neo-dark" />
              {user.hireable && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-neo dark:shadow-neo-dark"
                >
                  Available for hire
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-3xl lg:text-4xl font-bold text-light-text dark:text-dark-text">{user.name || user.login}</h1>
              <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">@{user.login}</p>
            </motion.div>

            {user.bio && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-light-text dark:text-dark-text leading-relaxed max-w-2xl">
                {user.bio}
              </motion.p>
            )}

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 text-sm text-light-textSecondary dark:text-dark-textSecondary"
            >
              {user.location && (
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}

              {user.company && (
                <div className="flex items-center space-x-2">
                  <Building2 size={16} />
                  <span>{user.company}</span>
                </div>
              )}

              {user.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <a href={`mailto:${user.email}`} className="hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200">
                    {user.email}
                  </a>
                </div>
              )}

              {user.blog && (
                <div className="flex items-center space-x-2">
                  <LinkIcon size={16} />
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{user.blog.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
            <StatsCard title={stat.title} value={stat.value} subtitle={stat.subtitle} icon={stat.icon} />
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      {repos && repos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Total Stars" value={formatNumber(repos.reduce((acc, repo) => acc + repo.stargazers_count, 0))} subtitle="Stars received" icon={<Clock size={20} />} />
          <StatsCard title="Total Forks" value={formatNumber(repos.reduce((acc, repo) => acc + repo.forks_count, 0))} subtitle="Forks received" icon={<Clock size={20} />} />
          <StatsCard title="Languages" value={new Set(repos.filter(repo => repo.language).map(repo => repo.language)).size} subtitle="Different languages" icon={<Clock size={20} />} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileHeader;
