const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const gulpUtil = require('gulp-util');
const shell = require('gulp-shell');

gulp.task('clean', () => {
  return del(['dist', 'coverage']);
});

gulp.task('es6', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(babel({
      presets: ['es2015', 'stage-3']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', () => {
  gulp.src('test/mocha.opts')
    .pipe(gulp.dest('dist/test'));

  return gulp.src(['test/**/*.test.js'])
    .pipe(babel({
      presets: ['es2015', 'stage-3']
    }))
    .pipe(gulp.dest('dist/test'));
});

gulp.task('migrate', shell.task(['sequelize db:migrate']));

gulp.task('build', ['clean'], () => {
  gulp.start('es6', 'migrate').on('error', gulpUtil.log);
});

gulp.task('build-dev', ['clean'], () => {
  gulp.start('es6', 'migrate', 'test').on('error', gulpUtil.log);
});

gulp.task('build-test', ['clean'], () => {
  gulp.start('es6', 'test').on('error', gulpUtil.log);
});

gulp.task('clean_db', shell.task([
  'dropdb life_pedia_development',
  'createdb life_pedia_development'
], { ignoreErrors: true }));

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['build']).on('error', gulpUtil.log);
});

gulp.task('watch-dev', ['build-dev'], () => {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['build-dev']).on('error', gulpUtil.log);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
