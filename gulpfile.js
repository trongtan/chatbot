const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpUtil = require('gulp-util');
const shell = require('gulp-shell');

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

/////////////////////////////////////////////////////////////////
///                        UTILS TASKS                        ///
/////////////////////////////////////////////////////////////////
const _es6Task = (src, dest) => {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015', 'stage-3']
    }))
    .pipe(gulp.dest(dest));
};

const _copyTask = (src, dest) => {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
};

const _cleanDBTask = (env) => {
  return shell.task([
    `dropdb life_pedia_${env}`,
    `createdb life_pedia_${env}`
  ], { ignoreErrors: true });
};

/////////////////////////////////////////////////////////////////
///                        CLEAN TASKS                        ///
/////////////////////////////////////////////////////////////////
gulp.task('clean-db', _cleanDBTask('development'));

gulp.task('clean-built-code', shell.task([
  'rm -r dist',
  'rm -r coverage'
], { ignoreErrors: true }));

gulp.task('clean', () => {
  gulp.start('clean-db', 'clean-built-code').on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                      DEVELOPMENT TASKS                    ///
/////////////////////////////////////////////////////////////////
gulp.task('es6', () => {
  return _es6Task(['src/**/*.js'], 'dist');
});

gulp.task('import-db', shell.task([
  'sequelize db:migrate',
  'sequelize db:seed:all'
]));

gulp.task('build', ['clean'], () => {
  gulp.start('es6', 'import-db').on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                         TEST TASKS                        ///
/////////////////////////////////////////////////////////////////
gulp.task('clean-db-test', _cleanDBTask('test'));

gulp.task('es6-test', () => {
  return _es6Task(['test/**/*.test.js'], 'dist/test');
});

gulp.task('import-db-test', ['clean-db-test'], shell.task([
  'sequelize db:migrate --url postgres://postgres@localhost:5432/life_pedia_test'
]));

gulp.task('copy-mocha-options', () => {
  return _copyTask('test/mocha.opts', 'dist/test');
});

gulp.task('build-test', () => {
  gulp.start('es6', 'es6-test', 'copy-mocha-options', 'import-db-test').on('error', gulpUtil.log);
});


/////////////////////////////////////////////////////////////////
///                         WATCH TASKS                       ///
/////////////////////////////////////////////////////////////////
gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['build']).on('error', gulpUtil.log);
});

gulp.task('watch-test', ['build-test'], () => {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['build-test']).on('error', gulpUtil.log);
});
