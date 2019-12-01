module.exports = {
  title: 'Ship.js',
  description: 'Take control of what is going to be your next release.',
  themeConfig: {
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
        ],
      },
      {
        title: 'Reference',
        children: ['/reference/all-config', '/reference/commands'],
      },
    ],
  },
};
