module.exports = {
  title: 'Ship.js',
  description: 'Take control of what is going to be your next release.',
  themeConfig: {
    algolia: {
      apiKey: '32d9de316be64a2a99557e931ff200a3',
      indexName: 'shipjs',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/algolia/shipjs' },
    ],
    sidebar: [
      {
        title: 'Guide', // required
        path: '/guide/', // optional, which should be a absolute path.
        collapsable: false, // optional, defaults to true
        children: [
          '/guide/',
          '/guide/getting-started',
          '/guide/useful-config',
          '/guide/contributing',
          '/guide/community',
        ],
      },
      {
        title: 'Reference',
        collapsable: false,
        children: [
          '/reference/all-config',
          '/reference/commands',
          '/reference/resources',
        ],
      },
    ],
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-154097686-1',
      },
    ],
  ],
};
