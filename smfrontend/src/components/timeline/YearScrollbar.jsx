// NOT WORKING YET

import { useEffect, useState } from 'react';

export default function YearScrollbar({ containerRef, minYear, maxYear }) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentYear, setCurrentYear] = useState(minYear);

  const years = [
    minYear,
    Math.round((minYear + maxYear) / 2),
    maxYear
  ];
  const positions = years.map(y =>
    (y - minYear) / (maxYear - minYear) * 100
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const percent = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollPercent(percent);
      setCurrentYear(
        Math.round(minYear + percent * (maxYear - minYear))
      );
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef, minYear, maxYear]);

  return (
    <div className="absolute top-0 right-0 h-[85vh] w-8 flex items-start pointer-events-none">
      <div className="relative h-full w-1 bg-warm-gray/20 rounded-full mx-auto my-2">
        {positions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-px bg-ink-black"
            style={{ top: `${pos}%`, left: '-2px' }}
          />
        ))}
      </div>
      <div className="ml-2 mt-2 text-xs font-semibold bg-parchment px-1 rounded">
        {currentYear}
      </div>
    </div>
  );
}
