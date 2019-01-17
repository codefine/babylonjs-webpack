const fs = require('fs');
const path = require('path');

const ignore = [
	'.DS_Store' // macos file record
];
const _input = 'src/assets/models';
const input = path.resolve('./', _input);
const output = path.resolve('./src', 'models_map.json');
const result = {};

fs.readdir(input, (err, files) => {
	files.forEach(file => {
        if (isIgnore(file)) return;
        const [name, ext] = file.split('.');
		result[name] = ext;
	});
	fs.writeFileSync(output, JSON.stringify(result));
});

function isIgnore(filename) {
	return ignore.find(item => item.toLowerCase() === filename.toLowerCase());
}