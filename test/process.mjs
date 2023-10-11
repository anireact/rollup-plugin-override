a = process.env.NODE_ENV;
a = process.env['NODE_ENV'];
a = process['env'][`NODE_ENV`];

// prettier-ignore
a = process // aaa
    .env       // aaaa
    [ /* aaaaa */ 'NODE_ENV' /* aaaaaa */ ];

a[process.env.NODE_ENV] = b;

({ [KEY]: a });
({ [KEY]: b } = c);

({ [KEY]() {} });
({ get [KEY]() {} });
({ set [KEY](_) {} });

var { [KEY]: b } = c;

({ [KEY]: a }) => {};
({ [KEY]: a } = b) => {};

(class {
    [KEY];
});

(class {
    [KEY]() {}
});
(class {
    get [KEY]() {}
});
(class {
    set [KEY](_) {}
});

KEY.startsWith('v');

OPT_LEVEL >= 2;

console.log(
    process.env.NODE_ENV,
    DEV,
    PROD,
    OPT_LEVEL,
    KEY,
    WTF1,
    WTF2,
    WTF3,
    WTF4,
    WTF5,
    WTF6,
    WTF7,
    WTF8,
    WTF9,
    WTF10,
    WTF11,
    WTF12,
    WTF13,
    WTF14,
    WTF15,
    WTF16,
);
