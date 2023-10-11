// @ts-nocheck

export default {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'consistent',
    jsxSingleQuote: true,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    proseWrap: 'always',
    htmlWhitespaceSensitivity: 'css',
    vueIndentScriptAndStyle: true,
    endOfLine: 'lf',
    embeddedLanguageFormatting: 'auto',
    overrides: [
        {
            files: ['*.md'],
            options: {
                printWidth: 80,
            },
        },
    ],
};
