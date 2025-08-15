const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pkg = require('./package.json');

// Set the banner content
const banner = `/*!
 * ${pkg.title} v${pkg.version} (${pkg.homepage})
 * Copyright 2013-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`;

// Compiles SCSS files from /scss into /css
function compileSass() {
  return gulp.src('scss/freelancer.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

// Minify compiled CSS
function minifyCSS() {
  return gulp.src('css/freelancer.css')
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

// Minify custom JS
function minifyJS() {
  return gulp.src('js/freelancer.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream());
}

// Copy vendor files from /node_modules into /vendor
function copyVendor() {
  // Bootstrap
  gulp.src('node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('vendor/bootstrap'));
  
  // Font Awesome
  return gulp.src('node_modules/@fortawesome/fontawesome-free/**/*')
    .pipe(gulp.dest('vendor/fontawesome'));
}

// Configure browserSync
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

// Reload browserSync
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch('scss/**/*.scss', compileSass);
  gulp.watch('css/freelancer.css', minifyCSS);
  gulp.watch('js/freelancer.js', minifyJS);
  gulp.watch('*.html', browserSyncReload);
}

// Define complex tasks
const build = gulp.series(compileSass, minifyCSS, minifyJS, copyVendor);
const dev = gulp.series(build, browserSyncInit, watchFiles);

// Export tasks
exports.sass = compileSass;
exports.css = minifyCSS;
exports.js = minifyJS;
exports.copy = copyVendor;
exports.build = build;
exports.dev = dev;
exports.default = build;
