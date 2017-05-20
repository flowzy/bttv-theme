'use strict'

// packages
const gulp              = require('gulp')

const sass              = require('gulp-sass')
const sourcemaps        = require('gulp-sourcemaps')
const cleanCSS          = require('gulp-clean-css')
const concat            = require('gulp-concat')
const uglify            = require('gulp-uglify')
const notify            = require('gulp-notify')
const header            = require('gulp-header')
const footer            = require('gulp-footer')
const pug               = require('gulp-pug')
const stringify         = require('stringify')
const browserify        = require('browserify')
const babelify          = require('babelify')
const source            = require('vinyl-source-stream')
const buffer            = require('vinyl-buffer')

// default task
gulp.task('default', ['compile:sass', 'compile:pug', 'compile:js'])

// watch for changes
gulp.task('watch', ['compile:sass', 'compile:pug', 'compile:js'], () => {
    const sass = [
        './src/sass/*.sass',
        './src/sass/**/*.sass',
        './src/sass/**/*.scss'
    ]

    const js = [
        './src/js/*.js',
        './src/js/**/*.js'
    ]

    const templates = [
        './src/templates/*.html'
    ]

    const pug = [
        './src/pug/*.pug'
    ]

    gulp.watch(sass, ['compile:sass'])
    gulp.watch(pug, ['compile:pug'])
    gulp.watch(js.concat(templates), ['compile:js'])
})

// compile sass
gulp.task('compile:sass', () => {
    const options = {
        outputStyle: 'compressed'
    }

    return gulp.src('./src/sass/*.sass')
            .pipe(sourcemaps.init())
            .pipe(sass(options).on('error', notify.onError({
                title: 'Failed running SASS',
                message: '<%=error%>'
            }), sass.logError))
            .pipe(cleanCSS())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./build/css'))
})

// compile js
gulp.task('compile:js', () => {
    return browserify({ entries: './src/js/app.js', debug: true })
            .transform(stringify(['.html']))
            .transform('babelify', {
                presets: ['env']
            })
            .bundle()
            .on('error', notify.onError({
                title: 'Failed running browserify',
                message: '<%=error%>'
            }))
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(uglify().on('error', notify.onError({
                title: 'Failed running uglify'
            })))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./build/js'))
})

// compile pug
gulp.task('compile:pug', () => {
    return gulp.src('./src/pug/*.pug')
            .pipe(pug())
            .on('error', notify.onError({
                title: 'Failed running pug',
                message: '<%=error%>'
            }))
            .pipe(gulp.dest('./src/templates'))
})