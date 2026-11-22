import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function resolveSiteUrl(): string {
  if (process.env.VITE_SITE_URL) {
    const trimmed = process.env.VITE_SITE_URL.trim().replace(/\/+$/, '');
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }
  if (process.env.CF_PAGES_URL) {
    const cleaned = process.env.CF_PAGES_URL.trim()
      .replace(/\/+$/, '')
      .replace(/^(https?:\/\/)[0-9a-f]{6,12}\.([^.]+\.pages\.dev)$/i, '$1$2');
    return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL) {
    const raw = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '')
      .trim()
      .replace(/\/+$/, '');
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }
  return 'https://pinhsalumni2026.pages.dev';
}

function ogSiteUrlPlugin(): Plugin {
  const siteUrl = resolveSiteUrl();
  return {
    name: 'og-site-url-plugin',
    transformIndexHtml(html) {
      return html.replace(/__SITE_URL__/g, siteUrl);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ogSiteUrlPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/leaflet/') || id.includes('\\leaflet\\')) {
            return 'leaflet-vendor';
          }
          if (
            id.includes('/gsap/') ||
            id.includes('\\gsap\\') ||
            id.includes('/lenis/') ||
            id.includes('\\lenis\\')
          ) {
            return 'motion-vendor';
          }
          if (
            id.includes('/react/') ||
            id.includes('\\react\\') ||
            id.includes('/react-dom/') ||
            id.includes('\\react-dom\\') ||
            id.includes('/scheduler/') ||
            id.includes('\\scheduler\\')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
