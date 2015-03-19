var gulp = require('gulp');
var repl = require('gulp-replace');
var rename = require('gulp-rename');
var fs = require('fs');

gulp.task('build', function() {
  gulp.src(['src/signaltech.jshintrc'])
      .pipe(gulp.dest('linters/'))
      .pipe(rename(".jshintrc"))
      .pipe(gulp.dest('linters/'));
  
  gulp.src(['src/SublimeLinter.tpl'])
      .pipe(rename("SublimeLinter.sublime-settings"))
      .pipe(repl('%signaltech.jshintrc%', fs.readFileSync("src/signaltech.jshintrc")))
      .pipe(gulp.dest('linters/'));
});

gulp.task('default', ['build']);
