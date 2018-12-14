var gulp = require('gulp-param')(require('gulp'), process.argv);
var uglify = require("gulp-uglify");
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var gulpUtil = require('gulp-util');
var Hjson = require('hjson');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var banner = ['/**',
    ' * <%= name %> - <%= description %>',
    ' * @version v<%= version %>',
    ' * @link <%= homepage %>',
    ' * @author <%= author %>',
    ' * @license <%= license %>',
    ' */',
    ''
].join('\r\n');

gulp.task('preWgt', function(ver,env){
    var fs = require('fs')
    if (!fs.existsSync('./tmp')){
        fs.mkdirSync('tmp')
    }
    var data = fs.readFileSync('./manifest.json', 'utf8');
    var json = Hjson.parse(data)
    json.version.name = ver
    json['launch_path'] = 'dist/index.html'
    delete json['unpackage']
    delete json['dependencies']
    delete json.plus.distribute
    json = Hjson.stringify(json, {quotes:"all",separator:true,multiline:"no-tabs",space:0,bracesSameLine:true,emitRootBraces:false}).replace(/\r?\n|\r|\t/g,'').replace(/: /g,':')
    fs.writeFileSync('tmp/manifest.json',json)
    if (fs.existsSync('./tmp/dist')){
        del.sync('./tmp/dist')
    }
    fs.renameSync('./dist', './tmp/dist')
    var cp = require('child_process');
    var packageName = 'v'+ver;
    const ext = '.wgt';
    if (env == 'dev') {
        packageName = packageName + "_dev";
    }
    packageName = packageName + ext;
    cp.exec('cd tmp && zip -r ' + packageName +' dist manifest.json && mv ' + packageName + ' ../ && cd .. && rm -rf tmp', function(error, stdout, stderr) {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
});
gulp.task('wgt', function(){
    runSequence("preWgt")
})
