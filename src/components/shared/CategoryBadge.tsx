import { NewsCategory, CATEGORY_CONFIG } from '@/lib/types';

interface CategoryBadgeProps {
  category: NewsCategory;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${config.bgColor}/15 ${config.color}`}
    >
      {category === 'telegram' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
        </svg>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
      )}
      {config.displayName}
    </span>
  );
}
