const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node18', // Node 18 LTS is the safest baseline for VS Code extensions

    outfile: 'dist/extension.js',
    external: ['vscode'],

    minify: production,
    sourcemap: !production,
    sourcesContent: false,

    define: {
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development'
      )
    },

    logLevel: 'info',

    plugins: [esbuildProblemMatcherPlugin]
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.dispose();
  }
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',
  setup(build) {
    build.onStart(() => {
      if (watch) console.log('[watch] build started');
    });

    build.onEnd(result => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (!location) return;
        console.error(
          `    ${location.file}:${location.line}:${location.column}`
        );
      });

      if (watch) console.log('[watch] build finished');
    });
  }
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
