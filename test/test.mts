import path from 'node:path';
import fs from 'node:fs';

import { rollup } from 'rollup';
import { format } from 'prettier';
import sm from 'source-map';

import override from '@anireact/rollup-plugin-override';

// @ts-ignore
import config from '../prettier.config.mjs';

interface File {
    code: string;
    map: any;
}

let files = await new Promise<Record<string, File>>((resolve, reject) => {
    let files: Record<string, File> = {};

    rollup({
        input: './test/test.mjs',
        treeshake: false,
        external: ['/dev/null', '/dev/random'],
        plugins: [
            override({
                mappings: {
                    'process.env.NODE_ENV': `'production'`,
                    'DEV': `false`,
                    'PROD': `true`,
                    'OPT_LEVEL': `3`,
                    'KEY': `'value'`,
                    'WTF1': `'xyu1'`,
                    'WTF2': `'xyu2'`,
                    'WTF3': `'xyu3'`,
                    'WTF4': `'xyu4'`,
                    'WTF5': `'xyu5'`,
                    'WTF6': `'xyu6'`,
                    'WTF7': `'xyu7'`,
                    'WTF8': `'xyu8'`,
                    'WTF9': `'xyu9'`,
                    'WTF10': `'xyu10'`,
                    'WTF11': `'xyu11'`,
                    'WTF12': `'xyu12'`,
                    'WTF13': `'xyu13'`,
                    'WTF14': `'xyu14'`,
                    'WTF15': `'xyu15'`,
                    'WTF16': `'xyu16'`,
                },
            }),
            override({
                ignoreScope: true,
                mappings: {
                    CYKA: `'blya'`,
                },
            }),
            {
                name: 'intercept',
                transform(code, id) {
                    id = path.relative(process.cwd(), id);

                    if (id === 'test/test.mjs') return;

                    files[id] = { code, map: this.getCombinedSourcemap() };
                },
                buildEnd(error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(files);
                    }
                },
            },
        ],
    });
});

for (let [id, { code }] of Object.entries(files)) {
    code = await format(code, {
        parser: 'babel',
        ...config,
    });

    let ref = fs.readFileSync(id.replace('.mjs', '.ref.mjs'), 'utf-8');

    if (code !== ref) {
        console.log('The test %o was failed', id);

        console.log(code);
        process.exit(1);
    }
}

let pos = await sm.SourceMapConsumer.with(files['test/process.mjs']!.map, null, consumer => {
    return consumer.originalPositionFor({
        line: 7,
        column: 19,
    });
});

let src = path.relative(process.cwd(), pos.source!).replaceAll(path.delimiter, '/');
let row = pos.line!;
let col = pos.column!;

if (src !== 'test/process.mjs' || row !== 10 || col !== 27) {
    console.log('The sourcemaps was test failed');
    process.exit(1);
}

console.log('All tests were passed');
