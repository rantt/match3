var gulp = require('gulp');
    request = require('request'),
    fs = require('fs'),
    del = require('del'),
    jshint = require('gulp-jshint');


gulp.task('init',['get-phaser', 'get-debug']);

gulp.task('get-phaser', function () {
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.min.js').pipe(fs.createWriteStream('src/js/lib/phaser.min.js'));
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.map').pipe(fs.createWriteStream('src/js/lib/phaser.map'));
});

gulp.task('get-debug', function() {
  request('https://github.com/englercj/phaser-debug/releases/download/v1.1.0/phaser-debug.js').pipe(fs.createWriteStream('src/js/lib/phaser-debug.js'));
});


gulp.task('clean', function(cb) {
  del('dist/**', cb);
});

// gulp.task('copy', ['clean'], function(){
//   gulp.src( [ 'src/js/*']).pipe(gulp.dest('./dist/js')); 
//   gulp.src( [ 'src/assets/fonts/*']).pipe(gulp.dest('./dist/assets/fonts')); 
// });

gulp.task('copy', ['clean'], function(){
  gulp.src(['js/**/*', 'assets/fonts/*', 'assets/images/*', 'assets/maps/*', 'assets/audio/*'], {cwd: './src', base: './src'})
    .pipe(gulp.dest('./dist/'));
});

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

