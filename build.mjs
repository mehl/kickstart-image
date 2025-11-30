import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
    entryPoints: ['render.mjs', 'svgrender.mjs'],
    bundle: true,
    outdir: 'dist/',
    platform: 'browser',
    sourcemap: true,
    target: ['es2020'],
});

await ctx.watch();
console.log('👀 Watching for changes...');

