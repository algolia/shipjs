module.exports = {
  base: '/shipjs/',
  title: 'Ship.js',
  description: 'Take control of what is going to be your next release.',
  themeConfig: {
    algolia: {
      apiKey: '8e903cfc085194284d0f4090fb0d5e9b',
      indexName: 'shipjs',
      appId: 'CQ6J2YX94R',
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
