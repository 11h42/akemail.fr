var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    uncss = require('gulp-uncss'),
    autoprefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    glob = require('glob'),
    flatten = require('gulp-flatten');

var paths = {
    css: [
        '../static/css/style.css',
        '../static/lib/bootstrap/dist/css/bootstrap.css'
    ],
    images: [
        '../static/img/logo.png',
        '../static/img/nexus-mockup.png',
        '../static/img/imac-mockup.png',
        '../static/img/mf.png'
    ],
    ie_js: [
        '../static/lib/html5shiv/dist/html5shiv.js',
        '../static/lib/respond/src/respond.js'
    ],
    ie_css: [
        '../static/css/ie.css'
    ]
};

// Clean
gulp.task('clean', function () {
    return gulp.src(['../public'], {
        read: false
    }).pipe(clean({force: true}));
});


gulp.task('fonts', ['clean'], function () {
    gulp.src('../static/**/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest('../public/fonts/'));
});

gulp.task('ie_js', ['fonts'], function () {
    return gulp.src(paths.ie_js)
        .pipe(concat('ie.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('../public/js'))
});

gulp.task('ie_css', ['ie_js'], function () {
    gulp.src(paths.ie_css)
        .pipe(concat('ie.min.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(gulp.dest('../public/css'));
});

gulp.task('images', ['ie_css'], function () {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('../public/img'));
});

gulp.task('css', ['images'], function () {
    gulp.src(paths.css)
        .pipe(concat('style.min.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(gulp.dest('../public/css'));
});

// watch files for changes
gulp.task('watch', function () {
    gulp.watch(paths.css, ['css']);
});

gulp.task('build', ['css'], function () {
    gulp.src('../public/css/style.min.css')
        .pipe(uncss({
            html: glob.sync('../_site/**/*.html')
        }))
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(gulp.dest('../public/css'));
});

// the default task (called when you run `gulp` from cli)
gulp.task('default', ['css', 'watch']);
