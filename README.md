# Rollup Plugin Override

> Compile-time expression substitution. Similar to `@rollup/plugin-replace`, but
> robust and safe.

## Usage

```bash
yarn add -D @anireact/rollup-plugin-override
```

```bash
npm install --save-dev @anireact/rollup-plugin-override
```

```javascript
import override from '@anireact/rollup-plugin-override';

export default {
    plugins: [
        override({
            mappings: {
                'process.env.NODE_ENV': `'production'`,
                'OPT_LEVEL': `3`,
                'BUILD_ID': JSON.stringify(uuid()),
            },
        }),
    ],
};
```

## Options

-   `include`, `exclude` — filter patterns to limit files the plugin processes.
-   `ignoreScope` (default: `false`) — force enable replacement processing even
    in scopes that have bindings, shadowing the expression to be rewritten.
-   `mappings` — a record of key-value mappings; values must be strings
    containing valid JavaScript expressions.

## Why

Unlike the official `@rollup/plugin-replace`, this plugin is more robust in edge
cases:

-   Doesn’t care of the exact code formatting:

    <!-- prettier-ignore -->
    ```javascript
    assert(process.env.NODE_ENV === 'production');
    assert(process.env['NODE_ENV'] === 'production');
    assert(process['env'][`NODE_ENV`] === 'production');

    assert(
        process
        .env
        .NODE_ENV === 'production'
    );
    ```

-   Doesn’t rewrite binding names, assignment LHS expressions, etc.:

    ```javascript
    process.env.NODE_ENV = 'production';
    //          ↑ writing the real env variable

    import { BUILD_ID } from '#constants';

    const { BUILD_ID } = whatever;
    const f = BUILD_ID => g();

    class App {
        BUILD_ID;
        OPT_LEVEL() {}
    }
    ```

-   Respects the scope:

    ```javascript
    const f = BUILD_ID => g(BUILD_ID);
    //                      ↑ “global” `BUILD_ID` is shadowed
    //                        by the function parameter,
    //                        so it will not be rewritten

    import process from 'node:process';

    console.log(process.env.NODE_ENV);
    //                      ↑ reading the real env variable
    ```

## Limitations

-   No expressions except plain identifiers and member expressions can be
    rewritten.
-   Member expression properties must be either plain identifiers, or
    string/template literal subscripts.
-   Template literals with substitutions are not supported.
-   The value of string or template literal must be a valid JavaScript
    identifier.

## Why Babel

Because it has an easy to use all-in-one API.

## Support

If you have any issues, feel free to fork this plugin, or contact me on Telegram
https://t.me/miyaokamarina.

## License

MIT © 2023 Yuri Zemskov
