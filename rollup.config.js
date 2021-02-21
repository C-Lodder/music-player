import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'plist/dist/plist-parse.js',
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ],
    output: {
      file: 'app/js/lib/plist.js',
    },
  },
];