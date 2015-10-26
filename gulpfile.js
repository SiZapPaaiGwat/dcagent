var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var esperanto = require('gulp-esperanto')
var gulp   = require('gulp')
var babel = require('gulp-babel')
var closureCompiler = require('gulp-closure-compiler')

var sourceFileV2 = 'dist/dcagent.v2.src.js'

var bundleConfigV2 = {
    // 是否进行打包，其它配置都是esperanto的配置
    bundle: true,
    type: 'umd',
    base: 'src',
    entry: 'index.js',
    name: 'DCAgent',
    amdName: 'DCAgent',
    strict: true
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

gulp.task('closureV2', ['bundleV2'], function() {
	return gulp.src(sourceFileV2)
		.pipe(closureCompiler({
			compilerPath: 'dist/google-closure-compiler.jar',
			fileName: './dist/dcagent.v2.min.js',
			compilerFlags: {
				language_in: 'ES5'
			}
		}))
})


gulp.task('lintV2', ['bundleV2'], function() {
	return gulp.src(sourceFileV2)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

gulp.task('bundleV2', function () {
	return gulp.src(bundleConfigV2.base + '/*.js')
		.pipe(esperanto(bundleConfigV2))
		.pipe(rename(function(path) {
			// 移除目录和后缀
			path.basename = sourceFileV2.replace('.js', '').split('/').pop()
		}))
		.pipe(babel({whitelist: babelTransformWhitelist}))
		.pipe(gulp.dest('dist'))
})

gulp.task('default', ['lintV2', 'closureV2'])
