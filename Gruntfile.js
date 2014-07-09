module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['app/src/**/*.js'],
        // the location of the resulting JS file
        dest: 'app/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
       dist: {
      files: {
      'app/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
       }
    },
    jshint: {
    // define the files to lint
      files: ['gruntfile.js', 'app/src/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          moment:true,
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint'/*, 'qunit'*/]
    }
  });

  // Load the plugins tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

  // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'qunit']);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', /*'qunit',*/ 'concat', 'uglify']);

};