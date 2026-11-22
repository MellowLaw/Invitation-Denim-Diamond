import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function resolveSiteUrl(): string {
  const raw =
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'invitation-denim-diamond.vercel.app';
  const trimmed = raw.trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
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
});
