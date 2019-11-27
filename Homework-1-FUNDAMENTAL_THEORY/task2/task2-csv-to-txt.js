import { outputPathToFile, pathToFile } from './paths.constants';
const { pipeline } = require('stream');

const csv = require('csvtojson');
const fs = require('fs');

console.log('Converting csv file to txt...');
pipeline(
	fs.createReadStream(pathToFile),
	csv(),
	fs.createWriteStream(outputPathToFile),
	error => {
		if (error) {
			console.error('Pipeline failed.', error);
		} else {
			console.log('Pipeline succeeded.');
		}
	}
);
