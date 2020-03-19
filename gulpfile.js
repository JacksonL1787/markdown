const gulp = require('gulp');
const run = require('gulp-run');
const minify = require('gulp-minify');

gulp.task('compress', function() {
  return gulp.src('src/final.js')
    .pipe(minify())
    .pipe(gulp.dest('src'))
});

gulp.task('script', function() {
    return run('./compressjs.sh').exec();
});

gulp.task('default', function() {
    gulp.watch(['./src/injects/*.js'], gulp.series('script'));
})
