module.exports = {
		  target: {
			files: [{
			  expand: true,
			  cwd: 'dist/styles',
			  src: 'bundle.css',
			  dest: 'dist/styles',
			  ext: '.min.css'
			}]
		  }
};
