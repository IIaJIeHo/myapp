module.exports = {
    options: {
        report: 'min',
        mangle: false
    },
    all: {
      files: {
        'dist/scripts/bundle_admin.min.js': ['dist/scripts/bundle_admin.js'],
        'dist/scripts/bundle_auto.min.js': ['dist/scripts/bundle_auto.js']
      }
    }
};
