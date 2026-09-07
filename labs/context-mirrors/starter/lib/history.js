class HistoricalAnalyzer {
  constructor() {
    this.history = [];
  }

  record(sequence, result) {
    this.history.push({
      timestamp: new Date().toISOString(),
      sequence: [...sequence],
      success: Boolean(result.success),
      result: { ...result }
    });
  }

  getHistory() {
    return this.history.map(item => ({
      ...item,
      sequence: [...item.sequence],
      result: { ...item.result }
    }));
  }

  clear() {
    this.history = [];
  }

  getStatistics() {
    const successful = this.history.filter(item => item.success);
    const patternCounts = successful.reduce((counts, item) => {
      const pattern = item.result.pattern;
      counts[pattern] = (counts[pattern] || 0) + 1;
      return counts;
    }, {});
    const processingTimes = successful
      .map(item => item.result.processingTime)
      .filter(Number.isFinite);
    const mostCommonPattern = Object.entries(patternCounts)
      .sort((left, right) => right[1] - left[1])[0]?.[0] || null;

    return {
      totalAnalyzed: this.history.length,
      successRate: this.history.length ? (successful.length / this.history.length) * 100 : 0,
      averageProcessingTime: processingTimes.length
        ? processingTimes.reduce((sum, value) => sum + value, 0) / processingTimes.length
        : 0,
      mostCommonPattern,
      patternCounts
    };
  }

  findSimilar(sequence) {
    const normalized = sequence.join(',');
    return this.getHistory().filter(item => {
      const candidate = item.sequence.join(',');
      return candidate.startsWith(normalized) || normalized.startsWith(candidate);
    });
  }

  getTrends() {
    return Object.entries(this.getStatistics().patternCounts)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((left, right) => right.count - left.count);
  }

  export() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      history: this.getHistory(),
      statistics: this.getStatistics()
    }, null, 2);
  }
}

module.exports = HistoricalAnalyzer;
