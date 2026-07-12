"use client";

import { useCallback, useEffect, useState } from "react";
import { CompanySettings } from "./pdf";
import { DEFAULT_COMPANY_SETTINGS } from "./default-company-settings";

const STORAGE_KEY = "company-settings";

/**
 * Persists company settings once from the dashboard, and makes them
 * available to every PDF generator (quote / contract / invoice / ...).
 *
 * Currently backed by localStorage so it works with zero backend setup.
 * To back this with Supabase instead (e.g. a `site_settings` row), swap
 * the load/save logic below for reads/writes against that table and
 * keep the same return shape - every consumer of this hook stays
 * unchanged.
 */
export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(
    DEFAULT_COMPANY_SETTINGS,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch {
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSettings = useCallback((next: CompanySettings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  return { settings, saveSettings, isLoaded };
}
