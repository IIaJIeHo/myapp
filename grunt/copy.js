module.exports = {
	main: {
		files: [
		  // includes files within path
		  {expand: true, flatten: true, src: ['images/*'], dest: 'dist/images/', filter: 'isFile'},
		  {expand: true, src: ['fonts/*','views/*'], dest: 'dist/', filter: 'isFile'}
		]
	}
};