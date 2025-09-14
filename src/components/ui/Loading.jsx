import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-light-textSecondary dark:border-dark-textSecondary border-t-light-accent dark:border-t-dark-accent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const LoadingSkeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return <div className={`${width} ${height} skeleton rounded ${className}`} />;
};

export const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Mobile/Tablet Layout (stacked) */}
      <div className="lg:hidden space-y-8">
        {/* Mobile User Info Card Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 skeleton rounded-full" />
            <div className="space-y-3 w-full">
              <div className="skeleton h-7 w-48 mx-auto rounded" />
              <div className="skeleton h-5 w-32 mx-auto rounded" />
              <div className="skeleton h-4 w-64 mx-auto rounded" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="skeleton h-6 w-12 mx-auto rounded mb-2" />
                <div className="skeleton h-4 w-20 mx-auto rounded" />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <div className="skeleton h-10 flex-1 rounded" />
            <div className="skeleton h-10 w-10 rounded" />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="skeleton w-4 h-4 rounded" />
                <div className="skeleton h-4 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Repository Showcase Skeleton */}
        <div className="space-y-6">
          <div className="skeleton h-7 w-40 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-5 w-12 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="skeleton h-4 w-16 rounded" />
                    <div className="skeleton h-4 w-8 rounded" />
                    <div className="skeleton h-4 w-8 rounded" />
                  </div>
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Analysis Skeleton */}
        <div className="space-y-6">
          <div className="skeleton h-6 w-48 rounded" />

          {/* GitHub Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="skeleton h-32 w-full rounded" />
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="skeleton h-6 w-40 rounded" />
                <div className="skeleton h-64 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout (side by side) */}
      <div className="hidden lg:flex lg:gap-8">
        {/* Left Sidebar Skeleton */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 skeleton rounded-full" />
              <div className="space-y-3 w-full">
                <div className="skeleton h-8 w-48 mx-auto rounded" />
                <div className="skeleton h-5 w-32 mx-auto rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="skeleton h-7 w-12 mx-auto rounded mb-2" />
                  <div className="skeleton h-4 w-20 mx-auto rounded" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="skeleton h-10 flex-1 rounded" />
              <div className="skeleton h-10 w-10 rounded" />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="skeleton w-5 h-5 rounded" />
                  <div className="skeleton h-4 w-40 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Repository Showcase */}
          <div className="space-y-6">
            <div className="skeleton h-8 w-48 rounded" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="skeleton h-6 w-3/4 rounded" />
                    <div className="skeleton h-5 w-12 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="skeleton h-4 w-16 rounded" />
                      <div className="skeleton h-4 w-8 rounded" />
                      <div className="skeleton h-4 w-8 rounded" />
                    </div>
                    <div className="skeleton h-4 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution Analysis */}
          <div className="space-y-6">
            <div className="skeleton h-7 w-48 rounded" />

            {/* GitHub Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="skeleton h-40 w-full rounded" />
            </div>

            {/* Charts */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="skeleton h-6 w-40 rounded" />
                  <div className="skeleton h-64 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RepositoryCardSkeleton = () => {
  return (
    <div className="card-neo p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
        <div className="skeleton h-8 w-16 rounded" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-8 rounded" />
          <div className="skeleton h-4 w-8 rounded" />
        </div>
        <div className="skeleton h-4 w-20 rounded" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
