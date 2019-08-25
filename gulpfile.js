const gulp = require('gulp');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const del = require('del');

// 1. html minify
gulp.task('html-minify', () => {
  'use strict';
  return gulp.src('./index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
});

// 2. js uglify
gulp.task('js-uglify', () => {
  'use strict';
  return gulp.src('./scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'));
});

// 3. image compress
gulp.task('copy-image', () => {
  'use strict';
  return gulp.src('./assets/images/*')
    .pipe(gulp.dest('./dist/assets/images'));
});

// 4. css minify
gulp.task('css-minify', () => {
  'use strict';
  return gulp.src('./css/**/*.css')
    .pipe(csso({
      comments: false
    }))
    .pipe(gulp.dest('./dist/css'));
});

// 5. copy fonts
gulp.task('copy-fonts', () => {
  'use strict';
  return gulp.src('./assets/fonts/*')
    .pipe(gulp.dest('./dist/assets/fonts/'));
});

gulp.task('copy-const', () => {
  'use strict';
  return gulp.src('./static/*')
    .pipe(gulp.dest('./dist/static/'));
});

gulp.task('clean', () => {
  'use strict';
  return del('./dist/*');
});

// gulp.task('build', [])
gulp.task('build', gulp.series('clean', 'html-minify', 'js-uglify', 'copy-image', 'css-minify', 'copy-fonts', 'copy-const'));