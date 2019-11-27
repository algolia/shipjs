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
        sidebarDepth: 1, // optional, defaults to 1
        children: ['/guide/', '/guide/getting-started'],
      },
      {
        title: 'Group 2',
        children: [
          /* ... */
        ],
      },
    ],
  },
};
