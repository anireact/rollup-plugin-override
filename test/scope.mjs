import { WTF1 } from '/dev/null';

console.log(WTF1);

console.log(KEY);
console.log(DEV);

() => {
    console.log(KEY);
    console.log(DEV);

    function KEY() {}
};

() => {
    console.log(KEY);
    console.log(DEV);

    var KEY = a;
};

() => {
    console.log(KEY);
    console.log(DEV);

    const KEY = a;
};

KEY => {
    console.log(KEY);
    console.log(DEV);
};

() => {
    console.log(process.env.NODE_ENV);
    console.log(DEV);

    function process() {}
};

() => {
    console.log(process.env.NODE_ENV);
    console.log(DEV);

    var process = a;
};

() => {
    console.log(process.env.NODE_ENV);
    console.log(DEV);

    const process = a;
};

process => {
    console.log(process.env.NODE_ENV);
    console.log(DEV);
};

console.log(KEY);
console.log(DEV);

CYKA => console.log(CYKA);
