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
      <div className="h-full rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-zinc-900/50 transition-all">
        {/* Image */}
        <div className="relative w-full h-40 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {article.imageURL ? (
            <img
              src={article.imageURL}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                el.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                const fallback = document.createElement('span');
                fallback.textContent = article.sourceID.toUpperCase();
                fallback.className = 'text-lg font-bold text-zinc-300 dark:text-zinc-600';
                el.parentElement!.appendChild(fallback);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-300 dark:text-zinc-600">
                {article.sourceID.toUpperCase()}
              </span>
            </div>
          )}

          {/* Category color strip at top */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${config.bgColor}`} />
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <CategoryBadge category={article.category} />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium uppercase">
              {article.sourceID}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-600 ml-auto">
              {relativeTime(article.publishedDate)}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors min-h-[2.5rem]">
            {article.title}
          </h3>

          {article.articleDescription && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
              {article.articleDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
