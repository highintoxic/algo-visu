import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';

const title = 'Algorithm Visualizer - Interactive Sorting Algorithms';
const description = 'Interactive sorting algorithm visualizer with animations and audio feedback. Learn bubble sort, quick sort, merge sort, and more with beautiful visual demonstrations.';
const url = 'https://algo-visu.vercel.app';
const ogImgUrl = 'https://algo-visu.vercel.app/og-image.png';
const author = 'highintoxic';
const keywords = 'sorting algorithms, algorithm visualizer, computer science, education, bubble sort, quick sort, merge sort, data structures, programming, animations';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title,
      },
      {
        name: 'description',
        content: description,
      },
      {
        name: 'keywords',
        content: keywords,
      },
      {
        name: 'author',
        content: author,
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        name: 'application-name',
        content: title,
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: title,
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'theme-color',
        content: '#1976d2',
      },
      {
        name: 'color-scheme',
        content: 'light dark',
      },
      {
        name: 'application-category',
        content: 'Education',
      },
      {
        name: 'subject',
        content: 'Computer Science, Algorithms, Data Structures',
      },
      {
        name: 'rating',
        content: 'General',
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:url',
        content: url,
      },
      {
        name: 'og:title',
        content: title,
      },
      {
        name: 'og:description',
        content: description,
      },
      {
        name: 'og:image',
        content: ogImgUrl,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:url',
        content: url,
      },
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: ogImgUrl,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: url,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any',
      },
      {
        rel: 'icon',
        href: '/pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        rel: 'icon',
        href: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Algorithm Visualizer",
          "description": description,
          "url": url,
          "author": {
            "@type": "Person",
            "name": author
          },
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "educationalLevel": ["High School", "University", "Adult Education"],
          "teaches": ["Sorting Algorithms", "Data Structures", "Computer Science"],
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/PlayAction",
            "userInteractionCount": 0
          }
        })
      }
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
});
