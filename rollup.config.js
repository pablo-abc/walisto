import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import watch from 'rollup-plugin-watch';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';

const prod = !process.env.ROLLUP_WATCH;
const watching = process.env.ROLLUP_WATCH === 'true';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      sourcemap: prod,
      exports: 'named',
      name: 'Walisto',
    },
    { file: pkg.module, format: 'esm', sourcemap: prod, exports: 'named' },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        prod ? 'production' : 'development'
      ),
      preventAssignment: true,
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript({ browserslist: false }),
    watching && watch({ dir: 'public' }),
    watching &&
      copy({
        targets: [{ src: 'public/index.html', dest: 'dist' }],
      }),
    watching &&
      serve({
        port: 3000,
        contentBase: 'dist',
      }),
    watching && livereload(),
    prod && bundleSize(),
  ],
};
