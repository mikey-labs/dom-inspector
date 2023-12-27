const presets = [
    [
        "@babel/preset-typescript"
    ],
    [
        // Javascript 2015+ syntax transpiler
        '@babel/preset-env',
        // Javascript Polyfill
        {
            targets: {
                chrome: 50,
                edge: 13,
                firefox: 50,
                safari:10
            },
        }
    ]
]

module.exports = {
    presets,
    // Fixes Core-JS $ issue: https://github.com/zloirock/core-js/issues/912
    // exclude: ['./node_modules']
}