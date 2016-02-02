module.exports = {
	main: {
		files: [
		  // includes files within path
		  {expand: true, flatten: true, src: ['images/*'], dest: 'dist/images/', filter: 'isFile'},
		  {expand: true, src: ['fonts/*','views/*','angular.js','upload.php','delete.php','favicon.ico'], dest: 'dist/', filter: 'isFile'},
		  {expand: true, src: ['modules/*.tmpl.html'], dest: 'dist/', filter: 'isFile'}
		]
	}
};