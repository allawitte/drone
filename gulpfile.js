var gulp = require('gulp');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var sass = require('gulp-sass');


var lib = [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-material/angular-material.js'
];

var css = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/angular-material/angular-material.css'
];

gulp.task('css', function(){
    return gulp.src(css)
        .pipe(concat('theme.css'))
        .pipe(gulp.dest('./'))
});

gulp.task('sass', function () {
    return gulp.src(['./app/*.scss', 'app/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('js', function() {
    gulp.src(lib)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./'));

    gulp.src(['app/*.js', 'app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./'))
});
gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

/**
 * Created by HP on 12/19/2016.
 */
