import { Article, TrendingTopic, NewsCategory } from '../types';
import { STOPWORDS } from '../constants';

/** Extract keywords from a title using stopword filtering */
function extractKeywords(title: string): Set<string> {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

/** Compute Jaccard similarity between two keyword sets */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const word of a) {
    if (b.has(word)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const SIMILARITY_THRESHOLD = 0.25;

export function computeTrending(articles: Article[]): TrendingTopic[] {
  if (articles.length === 0) return [];

  // Extract keywords for each article
  const articleKeywords = articles.map(a => ({
    article: a,
    keywords: extractKeywords(a.title),
  }));

  // Cluster articles by Jaccard similarity
  const clusters: Array<{
    articles: Article[];
    keywords: Set<string>;
  }> = [];

  for (const { article, keywords } of articleKeywords) {
    if (keywords.size === 0) continue;

    let bestCluster: typeof clusters[0] | null = null;
    let bestScore = 0;

    for (const cluster of clusters) {
      const score = jaccardSimilarity(keywords, cluster.keywords);
      if (score > bestScore && score >= SIMILARITY_THRESHOLD) {
        bestScore = score;
        bestCluster = cluster;
      }
    }

    if (bestCluster) {
      bestCluster.articles.push(article);
      // Merge keywords
      for (const kw of keywords) {
        bestCluster.keywords.add(kw);
      }
    } else {
      clusters.push({ articles: [article], keywords: new Set(keywords) });
    }
  }

  // Filter out clusters with only 1 article
  const multiArticleClusters = clusters.filter(c => c.articles.length >= 2);

  // Compute total sources for normalization
  const totalSources = new Set(articles.map(a => a.sourceID)).size;
  const maxCluster = Math.max(...multiArticleClusters.map(c => c.articles.length), 1);

  // Score each cluster
  const topics: TrendingTopic[] = multiArticleClusters.map(cluster => {
    const now = Date.now();

    // Recency (35%): average inverse-hours age
    const avgHoursAgo = cluster.articles.reduce((sum, a) => {
      const hoursAgo = (now - new Date(a.publishedDate).getTime()) / 3600000;
      return sum + Math.max(hoursAgo, 0.1);
    }, 0) / cluster.articles.length;
    const recencyScore = 1 / avgHoursAgo;

    // Cross-source coverage (30%)
    const uniqueSources = new Set(cluster.articles.map(a => a.sourceID)).size;
    const coverageScore = uniqueSources / Math.max(totalSources, 1);

    // Category diversity (20%)
    const categories = new Set(cluster.articles.map(a => a.category));
    const diversityScore = categories.size / 3;

    // Volume (15%)
    const volumeScore = Math.log2(cluster.articles.length) / Math.log2(Math.max(maxCluster, 2));

    const score = recencyScore * 0.35 + coverageScore * 0.30 + diversityScore * 0.20 + volumeScore * 0.15;

    // Generate title from most frequent keywords
    const keywordCounts = new Map<string, number>();
    for (const a of cluster.articles) {
      const kws = extractKeywords(a.title);
      for (const kw of kws) {
        keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
      }
    }
    const topKeywords = [...keywordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([kw]) => kw.charAt(0).toUpperCase() + kw.slice(1));
    const title = topKeywords.join(', ');

    // Category distribution
    const categoryDistribution: Record<NewsCategory, number> = {
      proRegime: 0,
      opposition: 0,
      neutral: 0,
      telegram: 0,
    };
    for (const a of cluster.articles) {
      categoryDistribution[a.category]++;
    }

    // Heat level (1-5)
    const heatLevel = Math.min(5, Math.max(1, Math.ceil(score * 10)));

    return {
      id: `topic-${topKeywords.join('-').toLowerCase().slice(0, 40)}`,
      title,
      articles: cluster.articles,
      score,
      sourceCount: uniqueSources,
      categoryDistribution,
      heatLevel,
    };
  });

  // Sort by score, return top 20
  topics.sort((a, b) => b.score - a.score);
  return topics.slice(0, 20);
}
