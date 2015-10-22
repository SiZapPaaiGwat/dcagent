var uglify = require("gulp-uglify")
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var esperanto = require('gulp-esperanto')
var gulp   = require('gulp')
var babel = require('gulp-babel')
var closureCompiler = require('gulp-closure-compiler')

var sourceFile = 'dist/dcagent.src.js'
var sourceFileV2 = 'dist/dcagent.v2.src.js'

var bundleConfig = {
    // 是否进行打包，其它配置都是esperanto的配置
    bundle: true,
    type: 'umd',
    base: 'src',
    entry: 'DCAgent.js',
    name: 'DCAgent',
    amdName: 'DCAgent',
    strict: true
}

var bundleConfigV2 = {
	// 是否进行打包，其它配置都是esperanto的配置
	bundle: true,
	type: 'umd',
	base: 'v2',
	entry: 'DCAgent.js',
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
  'es6.parameters.default',
  'es6.parameters.rest',
  'es6.properties.shorthand',
  'es6.templateLiterals'
]

// 默认使用closure压缩
gulp.task('closure', ['bundle'], function() {
    return gulp.src(sourceFile)
      .pipe(closureCompiler({
        compilerPath: 'lib/google-closure-compiler.jar',
        fileName: './dist/dcagent.min.js',
        compilerFlags: {
          language_in: 'ES5'
        }
      }))
})

gulp.task('closureV2', ['bundleV2'], function() {
	return gulp.src(sourceFileV2)
		.pipe(closureCompiler({
			compilerPath: 'lib/google-closure-compiler.jar',
			fileName: './dist/dcagent.v2.min.js',
			compilerFlags: {
				language_in: 'ES5'
			}
		}))
})

gulp.task('uglify', ['bundle'], function() {
    return gulp.src(sourceFile)
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.basename = 'dcagent.uglify.min'
      }))
      .pipe(gulp.dest('dist'))
})

gulp.task('uglifyV2', ['bundleV2'], function() {
	return gulp.src(sourceFileV2)
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.basename = 'dcagent.v2.uglify.min'
		}))
		.pipe(gulp.dest('dist'))
})

/*
 * 代码检查
 */
gulp.task('lint', ['bundle'], function() {
    return gulp.src(sourceFile)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
})

gulp.task('lintV2', ['bundleV2'], function() {
	return gulp.src(sourceFileV2)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

/*
 * 将ES 6代码转换并打包
 */
gulp.task('bundle', function () {
    return gulp.src(bundleConfig.base + '/*.js')
        .pipe(esperanto(bundleConfig))
        .pipe(rename(function(path) {
            // 移除目录和后缀
            path.basename = sourceFile.replace('.js', '').split('/').pop()
        }))
		    .pipe(babel({whitelist: babelTransformWhitelist}))
        .pipe(gulp.dest('dist'))
});

gulp.task('bundleV2', function () {
	return gulp.src(bundleConfigV2.base + '/*.js')
		.pipe(esperanto(bundleConfigV2))
		.pipe(rename(function(path) {
			// 移除目录和后缀
			path.basename = sourceFileV2.replace('.js', '').split('/').pop()
		}))
		.pipe(babel({whitelist: babelTransformWhitelist}))
		.pipe(gulp.dest('dist'))
});

gulp.task('v1', ['lint', 'uglify', 'closure'])

gulp.task('v2', ['lintV2', 'uglifyV2', 'closureV2'])

gulp.task('default', ['v1', 'v2'])
