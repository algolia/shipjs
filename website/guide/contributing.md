# How to Contribute?

All kind of contribution is welcomed. You can always [create an issue at GitHub](https://github.com/algolia/shipjs/issues/new/choose).

If you want to work on code and send a pull request, we highly recommend you to create an issue first to discuss how to implement it and to be aligned with the roadmap of Ship.js.

## Working on code

1. [Fork the project](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
2. [Clone the repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
3. Install the dependencies: `yarn install`

Ship.js is using [yarn workspace](https://yarnpkg.com/lang/en/docs/workspaces/) for its monorepo structure.

Ship.js consists of two packages:

- `shipjs`: CLI package
- `shipjs-lib`: A library package used by `shipjs`

### Testing and linting

We ask you to write test cases whenever you make a change. You can run tests by the following commands:

```bash
yarn workspace shipjs test:watch

or

yarn workspace shipjs-lib test:watch
```

And please make sure your code passes eslint.

```bash
yarn lint
```

Always reach out to us on GitHub when you are blocked in any way during the contribution.

### Testing your code in action

If you've made some change in `prepare` command, you can run it over your test repository like the following:

```bash
yarn workspace shipjs test:run:prepare --dir ~/workspace/your-test-repository
```

## Contributors list

When you make a contribution, you can be on the contributors list.

Run the following command and send a new pull request.

```bash
yarn contributors:add <your-github-username> <contribution-type>
```

For example,

```bash
yarn contributors:add eunjae-lee code,doc
```

Ship.js is using `all-contributors` to maintain the contributors list.

The full list of contribution types can be found [here](https://allcontributors.org/docs/en/emoji-key).
