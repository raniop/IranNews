'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useAISummarize, useAIAnalyze, useAITranslate } from '@/hooks/useAI';
import { CATEGORY_CONFIG } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import CategoryBadge from '@/components/shared/CategoryBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useLanguage } from '@/hooks/useLanguage';
import { useHebrewTitle } from '@/hooks/useHebrewTitles';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const id = decodeURIComponent(params.id as string);
  const { articles, isLoading } = useArticles();
  const article = articles.find((a) => a.id === id);
  const { title: hebrewTitle, description: hebrewDescription } = useHebrewTitle(article);

  const [content, setContent] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(false);

  const { summary, loading: summaryLoading, summarize } = useAISummarize();
  const { analysis, loading: analysisLoading, analyze } = useAIAnalyze();
  const { translation, loading: translateLoading, translate } = useAITranslate();

  // Fetch full article content
  useEffect(() => {
    if (!article?.url) return;
    setContentLoading(true);
    setContentError(false);
    fetch('/api/article-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: article.url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setContent(data.content);
        else setContentError(true);
        if (data.ogImage) setOgImage(data.ogImage);
      })
      .catch(() => setContentError(true))
      .finally(() => setContentLoading(false));
  }, [article?.url]);

  if (isLoading) return <LoadingSpinner label={t('article.loading')} />;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {t('article.notFound')}
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          {t('article.removedCache')}
        </p>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {t('article.backToFeed')}
        </button>
      </div>
    );
  }

  const displayImage = article.imageURL || ogImage;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t('article.back')}
      </button>

      {/* Article header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} size="md" />
          <span className="text-xs text-zinc-500 font-medium uppercase">
            {article.sourceID}
          </span>
          <span className="text-xs text-zinc-400">
            {relativeTime(article.publishedDate)}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-3">
          {hebrewTitle || article.title}
        </h1>
      </div>

      {/* Image */}
      {displayImage && (
        <div className="mb-6 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={displayImage}
            alt={article.title}
            className="w-full max-h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article content */}
      <div className="mb-6">
        {contentLoading ? (
          <div className="py-8">
            <LoadingSpinner size="sm" label={t('article.loadingContent')} />
          </div>
        ) : content ? (
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {content.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <>
            {(hebrewDescription || article.articleDescription) && (
              <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                {hebrewDescription || article.articleDescription}
              </p>
            )}
            {contentError && (
              <div className="text-center py-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-400 mb-2">{t('article.couldNotLoad')}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {t('article.readOn')} {article.sourceID} &rarr;
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* Source link (secondary) */}
      <div className="mb-6 flex items-center gap-3">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {t('article.viewOriginal')} {article.sourceID}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* AI Action Buttons */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-6">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
          {t('ai.title')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <AIButton
            label={t('ai.summarize')}
            loading={summaryLoading}
            onClick={() => summarize({ ...article, content: content || undefined })}
          />
          <AIButton
            label={t('ai.biasAnalysis')}
            loading={analysisLoading}
            onClick={() => analyze({ ...article, content: content || undefined })}
          />
          <AIButton
            label={t('ai.translateHebrew')}
            loading={translateLoading}
            onClick={() =>
              translate(
                (content || article.title + '\n' + (article.articleDescription || '')),
                'he'
              )
            }
          />
        </div>
      </div>

      {/* AI Results */}
      {summary && (
        <AIResultCard title={t('ai.summary')}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {summary}
          </p>
        </AIResultCard>
      )}

      {analysis && (
        <AIResultCard title={t('ai.biasResult')}>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>{t('ai.negative')}</span>
              <span className="font-medium capitalize">
                {analysis.sentimentLabel}
              </span>
              <span>{t('ai.positive')}</span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${((analysis.sentimentScore + 1) / 2) * 100}%`,
                  background:
                    analysis.sentimentScore > 0
                      ? 'rgb(34, 197, 94)'
                      : analysis.sentimentScore < 0
                      ? 'rgb(239, 68, 68)'
                      : 'rgb(234, 179, 8)',
                }}
              />
            </div>
          </div>

          {analysis.biasIndicators?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {analysis.biasIndicators.map((indicator, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {indicator}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {analysis.explanation}
          </p>
        </AIResultCard>
      )}

      {translation && (
        <AIResultCard title={t('ai.hebrewTranslation')}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed" dir="rtl">
            {translation}
          </p>
        </AIResultCard>
      )}
    </div>
  );
}

function AIButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
    >
      {loading && (
        <div className="w-3 h-3 border border-zinc-400 border-t-blue-500 rounded-full animate-spin" />
      )}
      {label}
    </button>
  );
}

function AIResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
      <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
