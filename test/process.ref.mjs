a = 'production';
a = 'production';
a = 'production';

// prettier-ignore
a = 'production';
a['production'] = b;
({
    ['value']: a,
});
({ ['value']: b } = c);
({
    ['value']() {},
});
({
    get ['value']() {},
});
({
    set ['value'](_) {},
});
var { ['value']: b } = c;
({ ['value']: a }) => {};
({ ['value']: a } = b) => {};
(class {
    ['value'];
});
(class {
    ['value']() {}
});
(class {
    get ['value']() {}
});
(class {
    set ['value'](_) {}
});
'value'.startsWith('v');
3 >= 2;
console.log(
    'production',
    false,
    true,
    3,
    'value',
    'xyu1',
    'xyu2',
    'xyu3',
    'xyu4',
    'xyu5',
    'xyu6',
    'xyu7',
    'xyu8',
    'xyu9',
    'xyu10',
    'xyu11',
    'xyu12',
    'xyu13',
    'xyu14',
    'xyu15',
    'xyu16',
);
