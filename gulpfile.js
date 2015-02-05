var gulp = require('gulp');

var jshint = require('gulp-jshint');

// gulp.task('copy', function(){
//   gulp.src('index.js')
//     .pipe(gulp.dest('dist'));
// });

//Lint Task
gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// WatchFiles For Changes
gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['lint']);
});

gulp.task('default', ['watch']);

