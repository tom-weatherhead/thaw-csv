// thaw-csv/test/main.test.ts

'use strict';

import { ICsvFileContents, readCsvFile, writeCsvFile } from '../lib/main';

test('Read testfile1.csv test', async () => {
	expect.assertions(6);

	// Arrange
	const filePath = './data/csv/testfile1.csv';

	// Act
	const csvFileContents = await readCsvFile(filePath, {
		firstRowIsHeaders: true
	});

	// Assert
	expect(csvFileContents).toBeTruthy();
	expect(csvFileContents.headers).toBeTruthy();
	expect(csvFileContents.data).toBeTruthy();

	expect(csvFileContents.headers).toStrictEqual([
		'Local time',
		'Open',
		'High',
		'Low',
		'Close',
		'Volume'
	]);

	expect(csvFileContents.data.length).toBe(9);
	expect(csvFileContents.data[8]).toStrictEqual([
		'03.08.2003 23:00:00.000 GMT-0600',
		'1.39892',
		'1.39922',
		'1.39857',
		'1.39874',
		'3646.2'
	]);
});
