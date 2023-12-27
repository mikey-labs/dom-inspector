import {build,context} from "esbuild";
import babel from 'esbuild-plugin-babel'
import pipe from "esbuild-plugin-pipe";
const isWatch = process.argv.includes("-w");
const bundle = (format,ext) => {
    const fileName = format === "iife" ? `${ext}` : `.${format}${ext}`;
    const outfile = `dist/dom-inspector${fileName}`;
    const config = {
        format,
        globalName: "DOMInspector",
        bundle: true,
        target: ["es2016"],
        minify:!isWatch,
        minifyWhitespace:!isWatch,
        outfile,
        charset: "utf8",
        entryPoints: ["./src/index.ts"],
        plugins:[
            pipe({
                plugins:[
                    babel()
                ]
            }),
        ]
    };
    if (isWatch) {
        context(config).then((ctx) => {
            ctx.watch().then(() => console.log("watching..."));
        });
    } else {
        build(config).then(() => console.log("Build finished:", outfile));
    }
};
if (isWatch) {
    bundle("esm",".mjs");
} else {
    bundle("esm",".mjs");
    bundle("cjs",".js");
    bundle("iife",".js");
}
