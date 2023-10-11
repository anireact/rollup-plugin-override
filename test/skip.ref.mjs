#!/usr/bin/env KEY
import WTF1 from '/dev/null';
import * as WTF2 from '/dev/null';
import { WTF3 } from '/dev/null';
import { WTF4 as a } from '/dev/null';
import { a as WTF5 } from '/dev/null';
export { WTF1 };
export { WTF2 as a };
export { a as WTF6 };
export { WTF7 } from '/dev/null';
export { WTF8 as b } from '/dev/null';
export { a as WTF9 } from '/dev/null';
export * as WTF10 from '/dev/null';
[KEY = a] = b;
({ KEY = a } = b);
({ a: KEY = b } = c);
[KEY] = a;
({
    PROD: true,
});
({
    KEY: a,
});
({ KEY } = a);
({ KEY = a } = b);
({ KEY: b } = c);
({
    KEY() {},
});
({
    get KEY() {},
});
({
    set KEY(_) {},
});
({ KEY } = a);
({ a: KEY } = b);
var KEY = a;
var [KEY = a] = b;
var { KEY = a } = b;
var { a: KEY = b } = c;
var [KEY] = a;
var { KEY } = a;
var { KEY = a } = b;
var { KEY: b } = c;
var { KEY } = a;
var { a: KEY } = b;
KEY => {};
([KEY = a] = b) => {};
({ KEY = a } = b) => {};
({ a: KEY = b } = c) => {};
([KEY] = a) => {};
({ KEY }) => {};
({ KEY: a }) => {};
({ KEY } = a) => {};
({ KEY = a } = b) => {};
({ KEY: a } = b) => {};
({ KEY } = a) => {};
({ a: KEY } = b) => {};
function f(KEY) {}
(function (KEY) {});
(class {
    f(KEY) {}
});
(class {
    set x(KEY) {}
});
({
    f(KEY) {},
});
({
    set x(KEY) {},
});
[...KEY] = a;
({ ...KEY } = a);
(...KEY) => {};
function g(...KEY) {}
(function (...KEY) {});
({
    f(...KEY) {},
});
(class {
    f(...KEY) {}
});
function WTF11() {}
(function KEY() {});
class WTF12 {}
(class KEY {});
(class {
    KEY;
});
(class {
    KEY() {}
});
(class {
    get KEY() {}
});
(class {
    set KEY(_) {}
});
KEY = a;
process.env.NODE_ENV = a;
a.KEY;
a.KEY.b;
({ ...KEY } = a);

// OPT_LEVEL
console.log('OPT_LEVEL %o', 3);
console.log(process.env[NODE_ENV]);
console.log(process[env.NODE_ENV]);
console.log(process.env['NODE' + '_' + 'ENV']);
console.log(process.env[`${'NODE'}_ENV`]);
console.log(process.env[String.raw`NODE_ENV`]);
