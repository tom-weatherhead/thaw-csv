// thaw-csv/src/main.ts

'use strict';

import { readFile, writeFile } from 'fs';

// import { join } from 'path';

import { promisify } from 'util';

const promisifiedReadFile = promisify(readFile);
const promisifiedWriteFile = promisify(writeFile);

export interface ICsvFileContents {
	readonly data: string[][];
	readonly headers?: string[];
}

class CsvFileContents implements ICsvFileContents {
	public readonly data: string[][];
	public readonly headers?: string[];

	constructor(data: string[][], headers?: string[]) {
		this.data = data;
		this.headers = headers;
	}
}

// 1) Read

export async function readCsvFile(
	filePath: string,
	options: {
		enforceEqualLineLength?: boolean;
		firstRowIsHeaders?: boolean;
		ignoreEmptyLines?: boolean;
	} = {}
): Promise<ICsvFileContents> {
	const fileDataAsString = await promisifiedReadFile(filePath, {
		encoding: 'utf8'
	});

	let headers;
	const resultArrayOfArrayOfStrings: string[][] = fileDataAsString
		.replace(/\r\n/g, '\n') // Change Windows line endings to Unix line endings
		.replace(/\r/g, '\n') // In case we are processing a text file with macOS pre-version-X line endings (i.e. just '\r')
		.split('\n') // Split fileDataAsString as an array of lines of text
		.map((line: string): string => line.trim()) // Remove any leading or trailing whitespace from each line
		.filter((line: string): boolean => line.length > 0) // Remove any empty lines
		.map((line: string): string[] => line.split(',')); // Split each line into an array of strings, using the comma as the delimiter

	if (resultArrayOfArrayOfStrings.length > 0 && options.firstRowIsHeaders) {
		// Use the first non-empty line in the file as the column headers
		headers = resultArrayOfArrayOfStrings.shift();
	}

	return new CsvFileContents(resultArrayOfArrayOfStrings, headers);
}

// 2) Write

export async function writeCsvFile(
	filePath: string,
	dataToWrite: any[][],
	options: {
		headers?: string[];
	} = {}
): Promise<void> {
	const dataToWriteAsString = dataToWrite.map((rowToWrite: any[]): string =>
		rowToWrite.join()
	);

	if (options.headers) {
		dataToWriteAsString.unshift(options.headers.join());
	}

	await promisifiedWriteFile(filePath, dataToWriteAsString.join('\n'), {
		encoding: 'utf8',
		flag: 'a', // 'a' means appending (old data will be preserved)
		mode: '0o644'
	});
}
