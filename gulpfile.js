let {src,dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  clean_css = require('gulp-clean-css'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin');

function browserSync(params) {
  browsersync.init ({
    server: {
      baseDir: './dist/'
    },
    port: 3000,
    notify: false,
  })
}

function html() {
  return src('./src/*.html')
    .pipe(dest('./dist/'))
    .pipe(browsersync.stream())
}

function css() {
  return src('./src/styles/*.css')
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(clean_css())
    .pipe(dest('./dist/styles/'))
    .pipe(browsersync.stream())
}

function js() {
  return src('./src/js/*.js')
    .pipe(uglify())
    .pipe(dest('./dist/js/'))
    .pipe(browsersync.stream())
}

function images() {
  return src('./src/img/*.{jpg,png,svg,gif,jpeg}')
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest('./dist/img/'))
    .pipe(browsersync.stream())
}

function fonts(params) {
  return src('./src/fonts/*.{woff,woff2}')
    .pipe(dest('./dist/fonts/'));
}

function watchFiles(params) {
  gulp.watch(['./src/*.html'], html);
  gulp.watch(['./src/styles/*.css'], css);
  gulp.watch(['./src/js/*.js'], js);
  gulp.watch(['./src/img/*.{jpg,png,svg,gif,jpeg}'], images);
}

function clean(params) {
  return del('./dist');
}

let build = gulp.series(clean, css, html, js, gulp.parallel( images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;