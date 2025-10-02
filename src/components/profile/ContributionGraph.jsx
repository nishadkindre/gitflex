import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  LineChart,
  Line
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { getLanguageColor, formatNumber } from '../../utils/helpers';
import { getLanguageIcon } from '../../utils/icons.jsx';
import Card from '../ui/Card';
import GitHubCalendar from 'react-github-calendar';

const ContributionGraph = ({ repos, user }) => {
  const { isDark } = useTheme();

  // Language distribution chart data for recharts
  const languageData = useMemo(() => {
    if (!repos) return [];

    const languageCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6); // Top 6 languages for better visualization

    const totalRepos = sortedLanguages.reduce((total, [, count]) => total + count, 0);

    return sortedLanguages.map(([language, count]) => ({
      name: language,
      value: Math.round((count / totalRepos) * 100), // Percentage for pie chart
      count: count, // Actual count for display
      color: getLanguageColor(language)
    }));
  }, [repos]);

  // Repository growth data for recharts
  const repoGrowthData = useMemo(() => {
    if (!repos) return [];

    const reposByYear = {};
    repos.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear();
      reposByYear[year] = (reposByYear[year] || 0) + 1;
    });

    const years = Object.keys(reposByYear).sort();
    let cumulative = 0;

    return years.map(year => {
      cumulative += reposByYear[year];
      return {
        year: year,
        repositories: cumulative,
        newRepos: reposByYear[year]
      };
    });
  }, [repos]);

  // Repository popularity data for recharts
  const popularityData = useMemo(() => {
    if (!repos) return [];

    // First try to get repos with stars/forks
    let topRepos = repos
      .filter(repo => repo.stargazers_count > 0 || repo.forks_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8);

    // If no repos have stars/forks, show the most recent ones for testing
    if (topRepos.length === 0) {
      topRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 8);
    }

    const result = topRepos.map(repo => ({
      name: repo.name.length > 12 ? repo.name.substring(0, 12) + '...' : repo.name,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      total: (repo.stargazers_count || 0) + (repo.forks_count || 0)
    }));

    console.log('Popularity data generated:', result);
    return result;
  }, [repos]);

  // Repository activity heatmap data for recharts
  const activityData = useMemo(() => {
    if (!repos) return [];

    const monthlyActivity = {};
    repos.forEach(repo => {
      const date = new Date(repo.created_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    // Get last 12 months
    const months = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        month: date.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        activity: monthlyActivity[monthKey] || 0,
        repos: monthlyActivity[monthKey] || 0
      });
    }

    return months;
  }, [repos]);

  // Repository size distribution
  const sizeDistributionData = useMemo(() => {
    if (!repos) return [];

    const sizeRanges = [
      { name: 'Tiny (<1KB)', min: 0, max: 1, count: 0 },
      { name: 'Small (1KB-100KB)', min: 1, max: 100, count: 0 },
      { name: 'Medium (100KB-1MB)', min: 100, max: 1024, count: 0 },
      { name: 'Large (1MB-10MB)', min: 1024, max: 10240, count: 0 },
      { name: 'Huge (>10MB)', min: 10240, max: Infinity, count: 0 }
    ];

    repos.forEach(repo => {
      const sizeKB = repo.size; // GitHub API returns size in KB
      const range = sizeRanges.find(r => sizeKB >= r.min && sizeKB < r.max);
      if (range) range.count++;
    });

    return sizeRanges
      .filter(range => range.count > 0)
      .map((range, index) => ({
        name: range.name,
        value: range.count,
        percentage: ((range.count / repos.length) * 100).toFixed(1),
        color: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'][index] || '#007AFF'
      }));
  }, [repos]);

  // Repository creation timeline
  const creationTimelineData = useMemo(() => {
    if (!repos) return [];

    const timelineData = {};
    repos.forEach(repo => {
      const date = new Date(repo.created_at);
      const quarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      timelineData[quarter] = (timelineData[quarter] || 0) + 1;
    });

    return Object.entries(timelineData)
      .map(([quarter, count]) => ({ quarter, repositories: count }))
      .sort((a, b) => {
        const [qA, yearA] = a.quarter.split(' ');
        const [qB, yearB] = b.quarter.split(' ');
        return parseInt(yearA) - parseInt(yearB) || parseInt(qA.slice(1)) - parseInt(qB.slice(1));
      })
      .slice(-12); // Last 12 quarters
  }, [repos]);

  // Repository commit frequency analysis
  const commitFrequencyData = useMemo(() => {
    if (!repos) return [];

    const frequencyRanges = [
      { name: 'Very Active', min: 100, max: Infinity, count: 0, color: '#007AFF' },
      { name: 'Active', min: 50, max: 99, count: 0, color: '#34C759' },
      { name: 'Moderate', min: 20, max: 49, count: 0, color: '#FF9500' },
      { name: 'Low', min: 5, max: 19, count: 0, color: '#FF6B35' },
      { name: 'Minimal', min: 0, max: 4, count: 0, color: '#8E8E93' }
    ];

    repos.forEach(repo => {
      // Use a combination of size and last update to estimate activity
      const activityScore = repo.size + repo.stargazers_count * 2 + repo.forks_count * 3;
      const range = frequencyRanges.find(r => activityScore >= r.min && activityScore <= r.max);
      if (range) range.count++;
    });

    return frequencyRanges.filter(range => range.count > 0);
  }, [repos]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Developer Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Insights into coding patterns and repository statistics</p>
        </div>
        <div className="hidden sm:flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        </div>
      </div>

      {/* GitHub Contribution Calendar */}
      {user && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Contribution Activity</h3>
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">GitHub Calendar</div>
          </div>
          <div className="overflow-x-auto">
            <GitHubCalendar username={user.login} colorScheme={isDark ? 'dark' : 'light'} blockSize={12} />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programming Languages Distribution */}
        {languageData.length > 0 && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Language Distribution</h3>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{languageData.length} Languages</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={languageData} cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={2} dataKey="value">
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#007AFF'} stroke={isDark ? '#1F2937' : '#FFFFFF'} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        color: isDark ? '#F9FAFB' : '#111827',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [<span className="font-semibold text-primary">{value}%</span>, <span className="text-muted-foreground">{name}</span>]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Language List */}
              <div className="space-y-2">
                {languageData.slice(0, 6).map((language, index) => (
                  <motion.div
                    key={language.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: language.color || '#007AFF' }} />
                      <div className="text-sm">{getLanguageIcon(language.name, 16)}</div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{language.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {language.count} {language.count === 1 ? 'repo' : 'repos'}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-primary text-sm">{language.value}%</div>
                  </motion.div>
                ))}
                {languageData.length > 6 && (
                  <div className="text-center pt-1">
                    <span className="text-xs text-muted-foreground">+{languageData.length - 6} more</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
        {/* Repository Growth Over Time */}
        {repoGrowthData.length > 0 && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Repository Growth</h3>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{repoGrowthData[repoGrowthData.length - 1]?.repositories || 0} Total</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={repoGrowthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} horizontal={true} vertical={false} />
                  <XAxis dataKey="year" stroke={isDark ? '#9CA3AF' : '#6B7280'} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDark ? '#F9FAFB' : '#111827',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={value => `Year: ${value}`}
                    formatter={(value, name) => [
                      <span className="font-semibold text-primary">{value}</span>,
                      <span className="text-muted-foreground">{name === 'repositories' ? 'Total Repos' : 'New Repos'}</span>
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="repositories"
                    stroke="#007AFF"
                    fillOpacity={1}
                    fill="url(#colorRepos)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#007AFF',
                      stroke: isDark ? '#1F2937' : '#FFFFFF',
                      strokeWidth: 2
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Repository Popularity Bubble Chart */}
      {popularityData.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Repository Popularity</h3>
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Top {popularityData.length} Repos</div>
          </div>

          {/* Chart explanation */}
          <div className="flex items-center justify-center gap-6 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Forks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>

          {/* <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              This chart displays repository popularity metrics: <span className="text-blue-400 font-medium">blue bars</span> show star counts, 
              <span className="text-green-600 font-medium"> green bars</span> show fork counts, and the 
              <span className="text-orange-600 font-medium"> orange line</span> represents total engagement (stars + forks).
            </p>
          </div> */}

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={popularityData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} horizontal={true} vertical={false} />
                <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6B7280'} fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: isDark ? '#F9FAFB' : '#111827',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-muted-foreground">{entry.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-primary" style={{ color: entry.color }}>
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="stars" fill="#007AFF" name="Stars" radius={[2, 2, 0, 0]} />
                <Bar dataKey="forks" fill="#34C759" name="Forks" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="total" stroke="#FF9500" strokeWidth={2} dot={{ fill: '#FF9500', strokeWidth: 2, r: 3 }} name="Total" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Additional Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Repository Activity Analysis */}
        {commitFrequencyData.length > 0 && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Repository Activity</h3>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Activity Analysis</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={commitFrequencyData.map((item, index) => ({
                    ...item,
                    fill: item.color
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="80%"
                >
                  <RadialBar dataKey="count" cornerRadius={4} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDark ? '#F9FAFB' : '#111827',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name, props) => [<span className="font-semibold text-primary">{value} repos</span>, <span className="text-muted-foreground">{props.payload.name}</span>]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Repository Size Distribution */}
        {sizeDistributionData.length > 0 && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Repository Sizes</h3>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Size Distribution</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sizeDistributionData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                    {sizeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDark ? '#F9FAFB' : '#111827',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [<span className="font-semibold text-primary">{value} repos</span>, <span className="text-muted-foreground">{name}</span>]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Creation Timeline */}
        {/* {creationTimelineData.length > 0 && (
          <Card className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Creation Timeline
              </h3>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Quarterly Activity
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creationTimelineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDark ? '#374151' : '#E5E7EB'} 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="quarter" 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDark ? '#F9FAFB' : '#111827',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [
                      <span className="font-semibold text-primary">{value}</span>,
                      <span className="text-muted-foreground">Repositories Created</span>
                    ]}
                  />
                  <Bar 
                    dataKey="repositories" 
                    fill="#007AFF" 
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )} */}
      </div>
    </motion.div>
  );
};

export default ContributionGraph;
