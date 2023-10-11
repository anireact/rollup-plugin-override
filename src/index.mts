import npath from 'node:path';

import { Plugin } from 'rollup';
import { FilterPattern, createFilter } from '@rollup/pluginutils';

import { parse, ParserOptions } from '@babel/parser';
import { traverse, NodePath, types as t } from '@babel/core';
import GENERATOR, { GeneratorOptions } from '@babel/generator';

const generate = GENERATOR.default;

const NAME = 'override';
const PATH = '/@anireact/rollup-plugin-' + NAME;

export interface OverrideOptions {
    /** Only process these files. */
    include?: FilterPattern | undefined;

    /** Never process these files. */
    exclude?: FilterPattern | undefined;

    /**
     * Force enable replacement processing even in scopes that have bindings,
     * shadowing the expression to be rewritten.
     *
     * @default false
     */
    ignoreScope?: boolean | undefined;

    /**
     * A record of key-value mappings. Values must be strings containing valid
     * JavaScript expressions.
     */
    mappings?: Record<string, string> | undefined;
}

/**
 * Compile-time expression substitution. Similar to `@rollup/plugin-replace`,
 * but robust and safe.
 */
export default function override(options: OverrideOptions = {}): Plugin {
    let filter = createFilter(options.include, options.exclude);
    let config = configure(options.mappings ?? {});
    let respectScope = !options.ignoreScope;

    let handler = {
        'Identifier|MemberExpression'(path: NodePath<t.Identifier | t.MemberExpression>) {
            let id = to_string(path.node);

            if (!id || !config.has(id) || skip_syntax(path) || (respectScope && skip_scope(path, id))) return;

            path.replaceWith(t.cloneNode(config.get(id)!));
        },
    };

    return {
        name: NAME,
        async transform(code, id) {
            if (!filter(id)) return;

            let ast = parse(code, {
                ...parser_options,
                sourceFilename: id,
            });

            traverse(ast, handler as any);

            return generate(ast, { ...codegen_options, filename: id }, { [id]: code }) as any;
        },
    };
}

/**
 * Transform the source dictionary into a mapping of normalized keys to parsed
 * substitution expressions.
 *
 * @param config
 * @returns
 */
const configure = (config: Record<string, string>) => {
    let mappings = new Map<string, t.Expression>();

    for (let [k, v] of Object.entries(config)) {
        let k_ast = parse_expr(k, '/dev/null');
        let k_str = to_string(k_ast);

        if (k_str) {
            mappings.set(k_str, parse_expr(v, npath.join(PATH, k_str)));
        }
    }

    return mappings;
};

const parse_expr = (code: string, file: string): t.Expression => {
    let ast = parse(`var _ = ${code}`, {
        ...parser_options,
        sourceFilename: file,
    });

    return (ast.program.body[0] as t.VariableDeclaration).declarations[0]!.init!;
};

const to_string = (node?: t.Expression | string): string | null => {
    if (!node) return null;

    if (typeof node === 'string') {
        if (/^[\p{IDS}$_][\p{IDC}$]*/u.test(node)) {
            return node;
        } else {
            return null;
        }
    }

    // a
    if (node.type === 'Identifier') {
        return node.name;
    }

    // 'a'
    if (node.type === 'StringLiteral') {
        return to_string(node.value);
    }

    // `a`
    if (node.type === 'TemplateLiteral') {
        // `a${'b'}c`
        if (node.expressions.length) return null;
        if (node.quasis.length !== 1) return null;

        return to_string(node.quasis[0]!.value.cooked);
    }

    // a.b
    // a['b']
    // a[`b`]
    if (node.type === 'MemberExpression') {
        let l = to_string(node.object);

        let p = node.property;

        // a.#b
        if (p.type === 'PrivateName') return null;

        // a[b]
        // a[b.c]
        // a[b + c]
        if (p.type !== 'StringLiteral' && p.type !== 'TemplateLiteral' && node.computed) return null;

        let r = to_string(p);

        if (l === null || r === null) return null;

        return l + '.' + r;
    }

    return null;
};

const skip_syntax = (path: NodePath<t.Identifier | t.MemberExpression>) => {
    let { parentKey: k, parent: p, parentPath: pp } = path;

    // import KEY from '/dev/null';
    if (p.type === 'ImportDefaultSpecifier') return true;

    // import * as KEY from '/dev/null';
    if (p.type === 'ImportNamespaceSpecifier') return true;

    // import { KEY } from '/dev/null';
    // import { KEY as a } from '/dev/null';
    // import { a as KEY } from '/dev/null';
    if (p.type === 'ImportSpecifier') return true;

    // export { KEY };
    // export { KEY as a };
    // export { a as KEY };
    // export { KEY } from '/dev/null';
    // export { KEY as a } from '/dev/null';
    // export { a as KEY } from '/dev/null';
    if (p.type === 'ExportSpecifier') return true;

    // export * as KEY from '/dev/null';
    if (p.type === 'ExportNamespaceSpecifier') return true;

    // ([KEY = a] = b);
    // ({ KEY = a } = b);
    // ({ a: KEY = b } = c);
    if (p.type === 'AssignmentPattern' && k === 'left') return true;

    // ([KEY] = a);
    if (p.type === 'ArrayPattern') return true;

    // ({ KEY });
    // ({ KEY: a });
    // ({ KEY } = a);
    // ({ KEY = a } = b);
    // ({ KEY: a } = b);
    if (p.type === 'ObjectProperty' && k === 'key' && !p.computed) return true;

    // ({ KEY() {} });
    // ({ get KEY() {} });
    // ({ set KEY(_) {} });
    if (p.type === 'ObjectMethod' && k === 'key' && !p.computed) return true;

    // ({ KEY } = a);
    // ({ a: KEY } = b);
    if (p.type === 'ObjectProperty' && k === 'value' && pp?.parent.type === 'ObjectPattern') return true;

    // var KEY = a;
    if (p.type === 'VariableDeclarator' && k === 'id') return true;

    // (KEY => {});
    if (p.type === 'ArrowFunctionExpression' && k === 'params') return true;

    // function f(KEY) {};
    if (p.type === 'FunctionDeclaration' && k === 'params') return true;

    // (function (KEY) {});
    if (p.type === 'FunctionExpression' && k === 'params') return true;

    // (class { f(KEY) {} });
    // (class { set x(KEY) {} });
    if (p.type === 'ClassMethod' && k === 'params') return true;

    // ({ f(KEY) {} });
    // ({ set x(KEY) {} });
    if (p.type === 'ObjectMethod' && k === 'params') return true;

    // ([...KEY] = a);
    // ({ ...KEY } = a);
    // ((...KEY) => {});
    // function f(...KEY) {};
    // (function (...KEY) {});
    // ({ f(...KEY) {} });
    // (class { f(...KEY) {} });
    if (p.type === 'RestElement' && k === 'argument') return true;

    // function KEY() {};
    if (p.type === 'FunctionDeclaration' && k === 'id') return true;

    // (function KEY() {});
    if (p.type === 'FunctionExpression' && k === 'id') return true;

    // class KEY {};
    if (p.type === 'ClassDeclaration' && k === 'id') return true;

    // (class KEY {});
    if (p.type === 'ClassExpression' && k === 'id') return true;

    // (class { KEY });
    if (p.type === 'ClassProperty' && k === 'key' && !p.computed) return true;

    // (class { KEY() {} });
    // (class { get KEY() {} });
    // (class { set KEY(_) {} });
    if (p.type === 'ClassMethod' && k === 'key' && !p.computed) return true;

    // KEY = a;
    // KEY.SUBKEY = a;
    if (p.type === 'AssignmentExpression' && k === 'left') return true;

    // a.KEY;
    // a.KEY.b;
    if (p.type === 'MemberExpression' && k === 'property' && !p.computed) return true;

    return false;
};

const skip_scope = (path: NodePath, id: string) => {
    let head = /^[\p{IDS}$_][\p{IDC}$]*/u.exec(id)![0];

    if (path.scope.hasBinding(head)) return true;

    return false;
};

const parser_options: ParserOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowNewTargetOutsideFunction: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    sourceType: 'module',
    sourceFilename: '/dev/null',
    ranges: true,
    plugins: [
        'decimal',
        'decoratorAutoAccessors',
        'destructuringPrivate',
        'doExpressions',
        'explicitResourceManagement',
        'exportDefaultFrom',
        'functionBind',
        'functionSent',
        'importAttributes',
        'moduleBlocks',
        'sourcePhaseImports',
        ['decorators', { decoratorsBeforeExport: true }],
    ],
};

const codegen_options: GeneratorOptions = {
    comments: true,
    sourceMaps: true,
    decoratorsBeforeExport: true,
    // @ts-ignore
    importAttributesKeyword: 'with',
    jsescOption: {
        es6: true,
    },
};
