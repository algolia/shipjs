<h1 align="center">🛳 Ship.js</h1>

<p align="center">
  <a href="http://npmjs.com/package/shipjs"><img alt="npm" src="https://img.shields.io/npm/v/shipjs"></a>
  <a href="https://circleci.com/gh/algolia/shipjs"><img alt="CircleCI" src="https://img.shields.io/circleci/build/gh/algolia/shipjs"></a>
  <a href="https://github.com/algolia/shipjs/blob/master/LICENSE"><img alt="NPM" src="https://img.shields.io/npm/l/shipjs"></a>
  <a href="https://github.com/algolia/shipjs#contributors-"><img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-7-orange.svg"></a>
</p>

<p align="center">
  Take control of what is going to be your next release.
</p>

## Features

- Automated
  - Minimize your effort for release and make less mistakes.
- Asynchronous
  - You don't have to release on your local machine. Do it asynchronously and continue your work.
- Collaborative
  - Don't sweat it alone. Review the next release on pull request with your colleagues.

## Installation

Running the following command will guide you to set it up interactively.

```bash
npx shipjs setup
```

This will help you install Ship.js into your package and create a tailored config file for your project.

![npx shipjs setup](./website/guide/setup.png)

Otherwise, you can still do it manually.

```bash
npm install --save-dev shipjs

or

yarn add -D shipjs
```

Add the following to the `scripts` section in your `package.json`.

```js
"release:prepare": "shipjs prepare",
"release:trigger": "shipjs trigger",
```

## Documentation

Docs are available at https://shipjs.netlify.com/.

## How is it different from semantic-release?

**semantic-release** is a tool for `fully automated version management and package publishing`.

Ship.js gives you more control over the release process. Ship.js automatically creates a PR before publishing every release, so that you can:

- Confirm the next version is correct.
- Confirm which commits are going to be released and discuss them with colleagues.
- Edit the automatically generated changelog for clarity & readability.
- Run any automated tests on the package release candidate.
- Build a release candidate automatically (with [Pika CI](https://github.com/marketplace/pika-ci-cd)).

## Contributing

You can create an issue for bug, feature request or your opinion.

And we also appreciate your PRs. The detailed contribution guide is coming soon.

## Getting Started

Let's move on to the [guide](https://shipjs.netlify.com/guide/getting-started.html).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/eunjae_lee"><img src="https://avatars3.githubusercontent.com/u/499898?v=4" width="100px;" alt="Eunjae Lee"/><br /><sub><b>Eunjae Lee</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=eunjae-lee" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=eunjae-lee" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.fredkschott.com"><img src="https://avatars1.githubusercontent.com/u/622227?v=4" width="100px;" alt="Fred K. Schott"/><br /><sub><b>Fred K. Schott</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=FredKSchott" title="Documentation">📖</a></td>
    <td align="center"><a href="https://uechi.io"><img src="https://avatars0.githubusercontent.com/u/431808?v=4" width="100px;" alt="Yasuaki Uechi"/><br /><sub><b>Yasuaki Uechi</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=uetchy" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=uetchy" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jeetiss.github.io/"><img src="https://avatars1.githubusercontent.com/u/6726016?v=4" width="100px;" alt="Ivakhnenko Dmitry"/><br /><sub><b>Ivakhnenko Dmitry</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=jeetiss" title="Code">💻</a></td>
    <td align="center"><a href="https://ghuser.io/jamesgeorge007"><img src="https://avatars2.githubusercontent.com/u/25279263?v=4" width="100px;" alt="James George"/><br /><sub><b>James George</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=jamesgeorge007" title="Code">💻</a> <a href="https://github.com/algolia/shipjs/commits?author=jamesgeorge007" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.patreon.com/kazupon"><img src="https://avatars1.githubusercontent.com/u/72989?v=4" width="100px;" alt="kazuya kawaguchi"/><br /><sub><b>kazuya kawaguchi</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=kazupon" title="Code">💻</a></td>
    <td align="center"><a href="https://tyankatsu.netlify.com/"><img src="https://avatars0.githubusercontent.com/u/28397593?s=460&v=4" width="100px;" alt="tyankatsu"/><br /><sub><b>tyankatsu</b></sub></a><br /><a href="https://github.com/algolia/shipjs/commits?author=tyankatsu0105" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
