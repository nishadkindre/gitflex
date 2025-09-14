import React, { useMemo } from 'react';

const MiniContributionGraph = ({ events, className = '' }) => {
  // Generate simplified contribution data for the last 100 days
  const contributionData = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];

    const days = [];
    const today = new Date();

    // Generate last 100 days (10x10 grid)
    for (let i = 99; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEvents = events.filter(event => {
        if (!event.created_at) return false;
        const eventDate = new Date(event.created_at).toISOString().split('T')[0];
        return eventDate === dateStr;
      });

      const contributionCount = dayEvents.length;
      days.push({
        date: dateStr,
        count: contributionCount,
        level: Math.min(4, Math.floor(contributionCount / 2)) // 0-4 levels
      });
    }

    return days;
  }, [events]);

  const getContributionColor = level => {
    const colors = {
      0: 'bg-muted/20',
      1: 'bg-primary/20',
      2: 'bg-primary/40',
      3: 'bg-primary/60',
      4: 'bg-primary/80'
    };
    return colors[level] || colors[0];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-muted-foreground">Contributions</h4>
        <span className="text-xs text-muted-foreground">{contributionData.reduce((sum, day) => sum + day.count, 0)} total</span>
      </div>

      <div className="grid grid-cols-10 gap-1">
        {contributionData.map((day, index) => (
          <div key={index} className={`w-2 h-2 rounded-sm ${getContributionColor(day.level)} transition-colors`} title={`${day.count} contributions on ${day.date}`} />
        ))}
      </div>
    </div>
  );
};

export default MiniContributionGraph;
