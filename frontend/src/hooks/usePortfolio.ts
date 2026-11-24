import { useCallback, useEffect, useState } from 'react';
import { portfolioApi } from '../services/api';
import type { FullPortfolioData } from '../types/portfolio';

export function usePortfolio() {
  const [data, setData] = useState<FullPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const full = await portfolioApi.getFull();
      setData(full);
      if (full.settings?.primary_accent) {
        document.documentElement.style.setProperty('--color-accent', full.settings.primary_accent);
      }
      if (full.settings?.site_title) {
        document.title = full.settings.site_title;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to portfolio API.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
