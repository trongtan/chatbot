const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpUtil = require('gulp-util');
const shell = require('gulp-shell');
const dotenv = require('gulp-dotenv');
const rename = require('gulp-rename');
const merge = require('gulp-merge-json');

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

/////////////////////////////////////////////////////////////////
///                        UTILS TASKS                        ///
/////////////////////////////////////////////////////////////////
const _es6Task = (src, dest) => {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015', 'stage-3'],
      "plugins": [["transform-runtime", {
        "polyfill": true,
        "regenerator": true
      }]]
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
  ], {ignoreErrors: true});
};

const _seedDBTask = (dbUrl) => {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      `sequelize db:migrate --url ${dbUrl}`,
      `sequelize db:seed:all --url ${dbUrl}`
    ]));
};

const _mergeExpressAdminSettingsTask = (src, dest, output) => {
  return gulp.src(src)
    .pipe(merge(output))
    .pipe(gulp.dest(dest));
};

/////////////////////////////////////////////////////////////////
///                        CLEAN TASKS                        ///
/////////////////////////////////////////////////////////////////
gulp.task('clean-db', _cleanDBTask('development'));

gulp.task('clean-built-code', shell.task([
  'rm -r dist',
  'rm -r coverage'
], {ignoreErrors: true}));

gulp.task('clean', () => {
  gulp.start('clean-db', 'clean-built-code').on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                      DEVELOPMENT TASKS                    ///
/////////////////////////////////////////////////////////////////
gulp.task('build-env', function () {
  return gulp.src('.env')
    .pipe(dotenv())
    .pipe(rename('env.json'))
    .pipe(gulp.dest('dist'))
    .on('error', gulpUtil.log);
});

gulp.task('es6', () => {
  return _es6Task(['src/**/*.js', '!src/admin/custom/static/**/*.js'], 'dist');
});

gulp.task('import-db', ['build-env'], () => {
  const dbUrl = require('./dist/env.json').DB_URL;
  return _seedDBTask(dbUrl);
});

gulp.task('build', ['clean'], () => {
  gulp.start('es6', 'import-db', 'build-admin').on('error', gulpUtil.log);
});

gulp.task('copy-express-admin-config', () => {
  return _copyTask('src/admin/**/*.json', 'dist/admin/');
});

gulp.task('merge-admin-settings', () => {
  return _mergeExpressAdminSettingsTask(
    [ 'src/admin/config/tables/type.json',
      'src/admin/config/tables/disease.json',
      'src/admin/config/tables/symptom.json',
      'src/admin/config/tables/link.json',
      'src/admin/config/tables/regional-menu-item.json',
      'src/admin/config/tables/user.json',
      'src/admin/config/tables/keyword.json',
      'src/admin/config/tables/disease-symptom.json',
      'src/admin/config/tables/type-disease.json',
      'src/admin/config/tables/group-message.json',
      'src/admin/config/tables/group.json',
      'src/admin/config/tables/button.json',
      'src/admin/config/tables/quick-reply.json',
      // Hidden table
      'src/admin/config/tables/type-message.json',
      'src/admin/config/tables/group-button.json',
      'src/admin/config/tables/type-disease-link.json',
      'src/admin/config/tables/disease-synonym.json',
      'src/admin/config/tables/symptom-synonym.json',
      'src/admin/config/tables/type-synonym.json',
      'src/admin/config/tables/sequelize-meta.json',
    ],
    'dist/admin/config',
    'settings.json');
});

gulp.task('copy-express-admin-static', () => {
  return _copyTask('src/admin/custom/static/**/*.js', 'dist/admin/custom/static/');
});

gulp.task('build-admin', () => {
  return gulp.start('copy-express-admin-config', 'merge-admin-settings', 'copy-express-admin-static').on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                         TEST TASKS                        ///
/////////////////////////////////////////////////////////////////
gulp.task('clean-db-test', _cleanDBTask('test'));

gulp.task('es6-test', () => {
  return _es6Task(['test/**/*.test.js'], 'dist/test');
});

gulp.task('import-db-test', ['build-env', 'clean-db-test'], () => {
  const dbUrl = gulpUtil.env.DB_URL_TEST ? gulpUtil.env.DB_URL_TEST : require('./dist/env.json').DB_URL_TEST;
  return _seedDBTask(dbUrl);
});

gulp.task('copy-mocha-options', () => {
  return _copyTask('test/mocha.opts', 'dist/test');
});

gulp.task('build-test', () => {
  return gulp.start('es6', 'es6-test', 'copy-mocha-options', 'import-db-test', 'copy-express-admin-config').on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                         WATCH TASKS                       ///
/////////////////////////////////////////////////////////////////
gulp.task('watch', ['build'], () => {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['build']).on('error', gulpUtil.log);
});

gulp.task('watch-test', ['build-test'], () => {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['build-test']).on('error', gulpUtil.log);
});

/////////////////////////////////////////////////////////////////
///                          YARN TASKS                       ///
/////////////////////////////////////////////////////////////////
const _yarnTask = (command, prebuilds) => {
  return gulp.src('*.js')
    .pipe(shell(prebuilds))
    .pipe(shell(command))
    .pipe(gulp.dest('dist'))
    .on('error', gulpUtil.log);
};

gulp.task('test', () => {
  return _yarnTask('yarn test', ['gulp build-test']);
});

gulp.task('test-coverage', () => {
  return _yarnTask('yarn test-coverage', ['gulp build-test']);
});

gulp.task('eslint', () => {
  return _yarnTask('yarn eslint', []);
});

gulp.task('dev', () => {
  return _yarnTask('yarn dev', []);
});

gulp.task('start', () => {
  return _yarnTask('yarn start', []);
});

gulp.task('debug', () => {
  return _yarnTask('yarn debug', []);
});
