var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlMin = require('gulp-htmlmin');

gulp.task('html-build', function () {
    var fileList = [
        'src/**/static/**/*.html'
    ];

    return gulp.src(fileList, {base: process.cwd() + '/src'})
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace('/static', '');
            return path;
        }))
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(gulp.dest('dev/'));
});

gulp.task('default', ['html-build']);