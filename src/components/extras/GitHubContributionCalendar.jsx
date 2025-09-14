import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../../context/ThemeContext';
import { AlertCircle, Loader2 } from 'lucide-react';

const GitHubContributionCalendar = ({ username, year = 'last' }) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Custom theme to match the application's design system
  const customTheme = {
    light: [
      '#f0f0f0', // Level 0 - no contributions (light gray)
      '#9be9a8', // Level 1 - few contributions (light green)
      '#40c463', // Level 2 - some contributions (medium green)
      '#30a14e', // Level 3 - many contributions (dark green)
      '#216e39' // Level 4 - most contributions (darkest green)
    ],
    dark: [
      '#2d333b', // Level 0 - no contributions (dark gray)
      '#0e4429', // Level 1 - few contributions (dark green)
      '#006d32', // Level 2 - some contributions (medium green)
      '#26a641', // Level 3 - many contributions (light green)
      '#39d353' // Level 4 - most contributions (brightest green)
    ]
  };

  // Custom labels for better UX
  const customLabels = {
    totalCount: '{{count}} contributions in {{year}}',
    legend: {
      less: 'Less',
      more: 'More'
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

  // Error message for when data fails to load
  const errorMessage = 'Unable to load contribution data. This might be due to privacy settings or API limitations.';

  // Handle loading state
  const handleLoadingStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  // Handle successful load
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle error state
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Custom tooltip rendering function
  const renderBlock = (block, activity) => {
    const tooltipText = activity.count === 0 ? `No contributions on ${activity.date}` : `${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${activity.date}`;

    return React.cloneElement(block, {
      'data-tooltip': tooltipText,
      title: tooltipText
    });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-4 relative">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading contribution data...</span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle size={16} />
                <span className="text-sm">Failed to load contribution data</span>
              </div>
            </div>
          )}

          <GitHubCalendar
            username={username}
            year={year}
            theme={customTheme}
            labels={customLabels}
            colorScheme={isDark ? 'dark' : 'light'}
            blockSize={12}
            blockMargin={3}
            blockRadius={2}
            fontSize={12}
            showWeekdayLabels={true}
            hideColorLegend={false}
            hideTotalCount={false}
            renderBlock={renderBlock}
            errorMessage={errorMessage}
            throwOnError={false}
            loading={isLoading}
            style={{
              '--gh-calendar-loading-color': isDark ? '#444' : '#ddd'
            }}
            onLoad={handleLoadingComplete}
            onError={handleError}
          />
        </div>
      </div>

      {/* Additional info section */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 This calendar shows your public GitHub contributions from the past year. Private repository contributions may not be visible unless you've enabled them in your GitHub settings.
        </p>
      </div>
    </motion.div>
  );
};

export default GitHubContributionCalendar;
