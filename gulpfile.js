var gulp = require('gulp'),
    request = require('request'),
    fs = require('fs'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    usemin = require('gulp-usemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    rev = require('gulp-rev'),
    rsync = require('gulp-rsync'),
    browserSync = require('browser-sync');

var config = require('./config.json');

// Start Server from src directory 
gulp.task('dev-server', function() {
    browserSync({
        server: {
            baseDir: "./src/"
        }
    });
});

// Start Server from dist directory 
gulp.task('dist-server', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});


//Download Phaser and Phaser.debug plugin
gulp.task('init',['get-phaser', 'get-debug']);

gulp.task('get-phaser', function () {
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.min.js').pipe(fs.createWriteStream('src/js/lib/phaser.min.js'));
  request('https://raw.github.com/photonstorm/phaser/master/build/phaser.map').pipe(fs.createWriteStream('src/js/lib/phaser.map'));
});

gulp.task('get-debug', function() {
  request('https://github.com/englercj/phaser-debug/releases/download/v1.1.0/phaser-debug.js').pipe(fs.createWriteStream('src/js/lib/phaser-debug.js'));
});

// Clear out dist directory
gulp.task('clean', function(cb) {
  del('dist/**', cb);
});

//Copy Assets
gulp.task('copy',['clean'], function(){
  gulp.src(['assets/fonts/*', 'assets/maps/*', 'assets/audio/*', 'js/lib/phaser.*','../screenshots/*'], {cwd: './src', base: './src'})
    .pipe(gulp.dest('./dist/'));
  gulp.src('screenshots/*').pipe(gulp.dest('./dist/screenshots/'));
});

// Concatenate & Minify JS/CSS/HTML
gulp.task('build',['copy', 'imagemin'], function () {
  return gulp.src('./src/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

//Compress Images
gulp.task('imagemin', function () {
  return gulp.src('src/assets/images/*.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/images/'));
});

//Lint Task
gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// WatchFiles For Changes
gulp.task('watch', function() {
  gulp.watch(['src/js/*.js','src/index.html'], ['lint', browserSync.reload]);
});

// Deploy Source to server
gulp.task('deploy', function() {
  return gulp.src('dist')
    .pipe(rsync({
      root: 'dist',
      username:  config.rsync.username,
      hostname:  config.rsync.hostname,
      destination:  config.rsync.destination,
      recursive: true,
      clean: true,
      progress: true,
      incremental: true
    }));
});

gulp.task('default', ['dev-server', 'watch']);

