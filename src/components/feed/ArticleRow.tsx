'use client';

import { useState } from 'react';
import { Article, CATEGORY_CONFIG, NewsCategory } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import CategoryBadge from '@/components/shared/CategoryBadge';
import Link from 'next/link';

interface ArticleRowProps {
  article: Article;
}

// Gradient backgrounds per category
const CATEGORY_GRADIENTS: Record<NewsCategory, string> = {
  proRegime: 'from-red-900 via-red-800 to-orange-900',
  opposition: 'from-blue-900 via-blue-800 to-indigo-900',
  neutral: 'from-yellow-900 via-amber-800 to-orange-900',
};

export default function ArticleRow({ article }: ArticleRowProps) {
  const config = CATEGORY_CONFIG[article.category];
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = article.imageURL && !imgFailed;

  return (
    <Link
      href={`/article/${encodeURIComponent(article.id)}`}
      className="block group"
    >
      <div className="h-full rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-zinc-900/50 transition-all">
        {/* Image / Placeholder */}
        <div className="relative w-full h-40 overflow-hidden">
          {showImage ? (
            <img
              src={article.imageURL}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_GRADIENTS[article.category]} flex items-center justify-center relative`}>
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-3 w-16 h-16 border border-white/30 rounded-full" />
                <div className="absolute bottom-3 right-4 w-24 h-24 border border-white/20 rounded-full" />
                <div className="absolute top-8 right-8 w-8 h-8 border border-white/20 rounded-full" />
              </div>
              {/* Source name + icon */}
              <div className="flex flex-col items-center gap-2 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
                </svg>
                <span className="text-sm font-bold text-white/50 tracking-wider uppercase">
                  {article.sourceID}
                </span>
              </div>
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
