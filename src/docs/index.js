// istanbul ignore file
import glob from 'glob';

// Pull in the swagger-ui/index.html file to serve as the swagger UI
require.resolve('./swagger-ui/index.html');

// Pull in all the *.docs.yml files to serve as the swagger definitions
glob.sync('./**/*.docs.yml').forEach(file => require.resolve(`${file}`));
