// Dependencies
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
 

 gulp.task('watch', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'bin/www',
		ext: 'js html ejs css scss',
		env: { 'NODE_ENV': 'development' }
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		livereload.reload();
	})
});
// Task
gulp.task('default', ['watch']);