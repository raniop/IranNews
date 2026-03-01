'use client';

import { Article, CATEGORY_CONFIG } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import CategoryBadge from '@/components/shared/CategoryBadge';
import Link from 'next/link';

interface ArticleRowProps {
  article: Article;
}

export default function ArticleRow({ article }: ArticleRowProps) {
  const config = CATEGORY_CONFIG[article.category];

  return (
    <Link
      href={`/article/${encodeURIComponent(article.id)}`}
      className="block group"
    >
      <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
        {/* Category color bar */}
        <div
          className={`w-1 shrink-0 rounded-full self-stretch ${config.bgColor}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={article.category} />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium uppercase">
              {article.sourceID}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>

          {article.articleDescription && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
              {article.articleDescription}
            </p>
          )}

          <span className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-1 block">
            {relativeTime(article.publishedDate)}
          </span>
        </div>

        {/* Thumbnail */}
        {article.imageURL && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={article.imageURL}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
