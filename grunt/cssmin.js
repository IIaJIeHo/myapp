module.exports = {
            options : {
                keepSpecialComments: 0,
                rebase: false
            },
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
