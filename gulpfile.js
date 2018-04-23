const gulp = require('gulp');
const ts = require("gulp-typescript");
const imprint = require('gulp-imprint');

function buildTSProject(project, type, output) {
  let temp = gulp
    .src('./src/main/**/*.ts')
    .pipe(project());

  temp = type === 'dts' ? temp.dts : temp.js;

  return temp.pipe(gulp.dest((`./dist/out/${output}`)));
}

imprint(gulp, {
  buildSequence: [ [ 'ts:build:es2015', 'ts:build:es5', 'ts:build:umd', 'ts:build:defs' ] ]
});

gulp.task('ts:build:es2015', () => {
  return buildTSProject(
    ts.createProject('tsconfig.json', { target: 'es2015', module: 'es2015' }),
    'js',
    'esm-es2015');
});

gulp.task('ts:build:es5', () => {
  return buildTSProject(
    ts.createProject('tsconfig.json', { target: 'es5', module: 'es2015' }),
    'js',
    'esm-es5');
});

gulp.task('ts:build:umd', () => {
  return buildTSProject(
    ts.createProject('tsconfig.json', { target: 'es5', module: 'umd' }),
    'js',
    'umd-es5');
});

gulp.task('ts:build:defs', () => {
  return buildTSProject(
    ts.createProject('tsconfig.json'),
    'dts',
    'dts');
});
