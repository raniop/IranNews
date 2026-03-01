'use client';

import { NewsCategory, CATEGORY_CONFIG, ALL_CATEGORIES } from '@/lib/types';

interface CategoryFilterBarProps {
  selected: NewsCategory | 'all';
  onChange: (category: NewsCategory | 'all') => void;
}

export default function CategoryFilterBar({ selected, onChange }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      <FilterButton
        label="All"
        active={selected === 'all'}
        onClick={() => onChange('all')}
      />
      {ALL_CATEGORIES.map((cat) => {
        const config = CATEGORY_CONFIG[cat];
        return (
          <FilterButton
            key={cat}
            label={config.displayName}
            active={selected === cat}
            color={config.color}
            onClick={() => onChange(cat)}
          />
        );
      })}
    </div>
  );
}

function FilterButton({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
      }`}
    >
      <span className={active ? '' : color}>{label}</span>
    </button>
  );
}
