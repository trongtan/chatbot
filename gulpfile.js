const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const gutil = require('gulp-util');

gulp.task('es6', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-3']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', () => {
    gulp.start('es6').on('error', gutil.log);
});

gulp.task('clean', () => {
    return del(['dist']);
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});
