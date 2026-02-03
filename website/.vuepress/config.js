import { viteBundler } from '@vuepress/bundler-vite';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';

export default defineUserConfig({
  base: '/shipjs/',
  title: 'Ship.js',
  description: 'Take control of what is going to be your next release.',

  bundler: viteBundler(),

  theme: defaultTheme({
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/algolia/shipjs' },
    ],
    sidebar: [
      {
        text: 'Guide',
        link: '/guide/',
        collapsible: false,
        children: [
          '/guide/',
          '/guide/getting-started',
          '/guide/useful-config',
          '/guide/contributing',
          '/guide/community',
        ],
      },
      {
        text: 'Reference',
        collapsible: false,
        children: [
          '/reference/all-config',
          '/reference/commands',
          '/reference/resources',
        ],
      },
    ],
  }),

  plugins: [
    docsearchPlugin({
      apiKey: '8e903cfc085194284d0f4090fb0d5e9b',
      indexName: 'shipjs',
      appId: 'CQ6J2YX94R',
    }),
    googleAnalyticsPlugin({
      id: 'UA-154097686-1',
    }),
  ],
});
