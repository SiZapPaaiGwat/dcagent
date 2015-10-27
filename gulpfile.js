var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var gulp = require('gulp')
var babel = require('gulp-babel')
var rollup = require('gulp-rollup')
var uglify = require('gulp-uglify')

var sourceFile = 'dist/dcagent.v2.src.js'
var options = {
  format: 'umd',
  moduleName: 'DCAgent'
}
var babelTransformWhitelist = [
  'es3.memberExpressionLiterals',
  'es3.propertyLiterals',
  'es6.arrowFunctions',
  'es6.blockScoping',
  'es6.constants',
  'es6.forOf',
  'es6.destructuring',
  'es6.parameters',
  'es6.properties.shorthand',
  'es6.templateLiterals'
]

gulp.task('compress', ['bundle'], function() {
  return gulp.src(sourceFile)
    .pipe(uglify())
    .pipe(rename(function (path) {
      // 移除目录和后缀
      path.basename = 'dcagent.v2.min'
    }))
    .pipe(gulp.dest('dist'))
});


gulp.task('lint', ['bundle'], function () {
  return gulp.src(sourceFile)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('bundle', function () {
  return gulp.src('src/index.js', {read: false})
    .pipe(rollup(options))
    .pipe(rename(function (path) {
      // 移除目录和后缀
      path.basename = 'dcagent.v2.src'
    }))
    .pipe(babel({whitelist: babelTransformWhitelist}))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['lint', 'compress'])
