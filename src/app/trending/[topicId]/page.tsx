'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTrending } from '@/hooks/useTrending';
import { useLanguage } from '@/hooks/useLanguage';
import { useAICompare } from '@/hooks/useAI';
import { CATEGORY_CONFIG } from '@/lib/types';
import ArticleRow from '@/components/feed/ArticleRow';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StoryComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const topicId = decodeURIComponent(params.topicId as string);
  const { topics, isLoading } = useTrending();
  const { comparison, loading: compareLoading, compare } = useAICompare();

  const topic = topics.find((tp) => tp.id === topicId);

  if (isLoading) return <LoadingSpinner label={t('trending.analyzing')} />;

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {t('trending.topicNotFound')}
        </h2>
        <button
          onClick={() => router.push('/trending')}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {t('trending.backToTrending')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t('nav.trending')}
      </button>

      {/* Topic header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
          {topic.title}
        </h1>
        <p className="text-xs text-zinc-500">
          {topic.articles.length} {t('trending.articles')} / {topic.sourceCount} {t('trending.sources')}
        </p>
      </div>

      {/* Compare button */}
      <button
        onClick={() => compare(topic.articles.slice(0, 6))}
        disabled={compareLoading}
        className="w-full mb-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {compareLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('trending.analyzingCoverage')}
          </>
        ) : (
          t('trending.compare')
        )}
      </button>

      {/* Comparison results */}
      {comparison && (
        <div className="mb-6 space-y-3">
          {/* Topic summary */}
          {comparison.topic && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-900/50">
              <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                {t('trending.commonTopic')}
              </h3>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {comparison.topic}
              </p>
            </div>
          )}

          {/* Key differences */}
          {comparison.keyDifferences && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                {t('trending.keyDifferences')}
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comparison.keyDifferences}
              </p>
            </div>
          )}

          {/* Per-source framing */}
          {comparison.framingAnalysis && comparison.framingAnalysis.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1">
                {t('trending.sourceFraming')}
              </h3>
              <div className="space-y-2">
                {comparison.framingAnalysis.map((entry, i) => {
                  const source = topic.articles.find(
                    (a) => a.sourceID === entry.sourceID
                  );
                  const catConfig = source
                    ? CATEGORY_CONFIG[source.category]
                    : null;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {catConfig && (
                          <div
                            className={`w-2 h-2 rounded-full ${catConfig.bgColor}`}
                          />
                        )}
                        <span className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                          {entry.sourceID}
                        </span>
                      </div>
                      {entry.tone && (
                        <p className="text-xs text-zinc-500 mb-0.5">
                          {t('trending.tone')}: {entry.tone}
                        </p>
                      )}
                      {entry.keyQuote && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
                          &ldquo;{entry.keyQuote}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Article list */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
          {t('trending.relatedArticles')}
        </h2>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {topic.articles.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
