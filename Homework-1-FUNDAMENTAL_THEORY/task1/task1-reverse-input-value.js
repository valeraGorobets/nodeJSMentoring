import { reverseString } from './reverseString';

const standard_input = process.stdin;
standard_input.setEncoding('utf-8');

console.log('Input value:');
standard_input.on('data', (data) => {
	if (data === 'exit\n'){
		process.exit();
	} else {
		console.log(reverseString(data));
	}
});
