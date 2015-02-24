module.exports = function(grunt) {

	// Load multiple grunt tasks using globbing patterns
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		makepot: {
			target: {
				options: {
					domainPath: '/languages',    // Where to save the POT file.
					exclude: ['build/.*'],
					mainFile: 'pwd-wp-login.php',    // Main project file.
					potFilename: 'pwd-wp-login.pot',    // Name of the POT file.
					potHeaders: {
						poedit: true,                 // Includes common Poedit headers.
						'x-poedit-keywordslist': true // Include a list of all possible gettext functions.
									},
					type: 'wp-plugin',    // Type of project (wp-plugin or wp-theme).
					updateTimestamp: true,    // Whether the POT-Creation-Date should be updated without other changes.
					updatePoFiles: false,    // Whether to update PO files in the same directory as the POT file.
					processPot: function( pot, options ) {
						pot.headers['report-msgid-bugs-to'] = 'http://www.plateformewpdigital.fr/';
						pot.headers['last-translator'] = 'WP-Translations (http://wp-translations.org/)\n';
						pot.headers['language-team'] = 'WP-Translations  <fxb@wp-translations.org>\n';
						pot.headers['language'] = 'en_US';
						var translation, // Exclude meta data from pot.
							excluded_meta = [
								'Plugin Name of the plugin/theme',
								'Plugin URI of the plugin/theme',
								'Author of the plugin/theme',
								'Author URI of the plugin/theme'
							];
						for (translation in pot.translations['']) {
							if ('undefined' !== typeof pot.translations[''][translation].comments.extracted) {
								if (excluded_meta.indexOf(pot.translations[''][translation].comments.extracted) >= 0) {
									console.log('Excluded meta: ' + pot.translations[''][translation].comments.extracted);
									delete pot.translations[''][translation];
								}
							}
						}
						return pot;
					}
				}
			}
		},

		exec: {
			txpull: { // Pull Transifex translation - grunt exec:txpull
				cmd: 'tx pull -a --minimum-perc=90' // Change the percentage with --minimum-perc=yourvalue
			},
			txpush_s: { // Push pot to Transifex - grunt exec:txpush_s
				cmd: 'tx push -s'
			},
		},

		dirs: {
			lang: 'languages',  // It should be languages or lang
		},

		potomo: {
			dist: {
				options: {
					poDel: false // Set to true if you want to erase the .po
				},
				files: [{
					expand: true,
					cwd: '<%= dirs.lang %>',
					src: ['*.po'],
					dest: '<%= dirs.lang %>',
					ext: '.mo',
					nonull: true
				}]
			}
		},

		// Clean up build directory
		clean: {
			main: ['build/<%= pkg.name %>']
		},

		// Copy the theme into the build directory
		copy: {
			main: {
				src:  [
					'**',
					'!node_modules/**',
					'!build/**',
					'!.git/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules',
					'!.tx/**',
					'!**/Gruntfile.js',
					'!**/package.json',
					'!**/README.md',
					'!**/*~'
				],
				dest: 'build/<%= pkg.name %>/'
			}
		},

		//Compress build directory into <name>.zip and <name>-<version>.zip
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './build/<%= pkg.name %>.zip'
				},
				expand: true,
				cwd: 'build/<%= pkg.name %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/'
			}
		},

	});

	// Default task. - grunt makepot
	grunt.registerTask( 'default', 'makepot' );

	// Makepot and push it on Transifex task(s).
	grunt.registerTask( 'makandpush', [ 'makepot', 'exec:txpush_s' ] );

	// Pull from Transifex and create .mo task(s).
	grunt.registerTask( 'tx', [ 'exec:txpull', 'potomo' ] );

	// Build task(s).
	grunt.registerTask( 'build', [ 'clean', 'copy', 'compress' ] );

};