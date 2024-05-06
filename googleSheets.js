const { google } = require('googleapis');
const { getGoogleSheetClient } = require('./googleAuth');
const { underscore } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccountKeyFile = 'credentials.json';
const spreadSheetId = process.env.SPREADSHEET_ID;
const sheetId = process.env.ATTENDANCE_SHEET_ID;
const tabName = process.env.ATTENDANCE_SHEET_NAME;
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYSZ';

// main().then( () => {
//     console.log('Completed');
// })

// async function main() {
//     // Generating google sheet client
//     const googleSheetClient = await getGoogleSheetClient();
  
//     // Reading Google Sheet from a specific range
//     const data = await getSpreadsheet(googleSheetClient);
//     const requests = [];
//     // const copyPasteRequest = getCopyPasteRequest(getGridRange('0', 0, 1, 0, 1), getGridRange('0', 1, 2, 1, 2));
//     // const updateDimensionPropertiesRequest = getResizeColumnRequest('0', 25, 100);
//     // const mergeCells = getMergeCells('0', 0, 1, 12, 17, 'MERGE_ALL');

//     // const array = ['0', '1', '2', '3', '4', '5'];
//     // const cellFormat = getCellCentreFormat();
//     // const cellData = cellToCellData(array, cellFormat);
//     // const rowData = getRowData(cellData);
//     // const range = getGridRange('0', 20, 21, 0, 6);
//     // const updateCellsRequest = getUpdateCellsRequest(rowData, range);
    
//     // const makeNewColumnRequest = createNewAttendanceColumn(data, '0', 'October', '18', 'Land');
//     // requests.push(...makeNewColumnRequest);
//     // await batchUpdate(googleSheetClient, requests);
// }

async function getSpreadsheet(googleSheetClient) {
    const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId : spreadSheetId,
        range: `${tabName}`,
    });
    return res.data.values;
}

function getCopyPasteRequest(source, destination) {

    const request = {
        copyPaste : {
            source,
            destination,
        }
    };

    return request;
}

function getMergeCells(sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, mergeType) {
    const range = getGridRange(sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) 
    
    const request = {
        mergeCells : {
            range,
            mergeType
        }
    }

    return request;
}

function getUpdateDimensionPropertiesRequest(sheetId, dimension, startIndex, endIndex, pixelSize) {
    const range = getDimensionRange(sheetId, dimension, startIndex, endIndex);

    const request = {
        updateDimensionProperties : {
            properties : {
                pixelSize
            },
            fields : 'pixelSize',
            range
        }
    };

    return request;
}

function getResizeColumnRequest(sheetId, index, pixelSize) { 
    const request = getUpdateDimensionPropertiesRequest(sheetId, 'COLUMNS', index, index + 1, pixelSize);
    return request;
}

async function batchUpdate(googleSheetClient, requests) {
    const batchUpdateRequest = { requests };
    try {
        const response = await googleSheetClient.spreadsheets.batchUpdate({
            spreadsheetId : spreadSheetId,
            resource : batchUpdateRequest
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function getGridRange(sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) {
    const gridRange = {
        sheetId,
        startRowIndex,
        endRowIndex,
        startColumnIndex,
        endColumnIndex
    };

    return gridRange;
}

function getDimensionRange(sheetId, dimension, startIndex, endIndex) {
    const dimensionRange = {
        sheetId,
        dimension,
        startIndex,
        endIndex
    };

    return dimensionRange;
}

function getUpdateCellsRequest(rows, range) {
    const request = {
        updateCells : {
            rows,
            fields : '*',
            range
        }
    };

    return request;
}

function getExtendedValue(stringValue) {
    const extendedValue = {
        stringValue
    };

    return extendedValue;
}

function getCellFormat(horizontalAlignment, verticalAlignment) {
    const cellFormat = {
        horizontalAlignment,
        verticalAlignment
    };
    
    return cellFormat;
}

function getCellCentreFormat() {
    return getCellFormat('CENTER', 'MIDDLE');
}

function getNameCellFormat() {
    return getCellFormat('LEFT', 'MIDDLE');
}

function getRowData(values) {
    const rowData = {values};

    return rowData;
}

function getCellData(userEnteredValue, userEnteredFormat) {
    const cellData = {
        userEnteredValue,
        userEnteredFormat
    };

    return cellData;
}

function cellToCellData(data, cellFormat) {
    const cellData = [];
    for (let i = 0; i < data.length; i++) {
        cellData[i] = getCellData(getExtendedValue(data[i]), cellFormat);
    }

    return cellData;
}

function getAutoFillRequest(useAlternateSeries, range) {
    const request = {
        autoFill: {
            useAlternateSeries,
            range
        }
    };

    return request;
}


async function createNewAttendanceColumn(eventMonth, eventDate, practiceType) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);

    const sampleIndex = getSampleIndex(data);
    const totalIndex = getTotalIndex(data);
    const emptyRowIndex = data.length;
    const emptyColumnIndex = data[sampleIndex].length;

    const source = getGridRange(sheetId, sampleIndex, sampleIndex + 1, 2, 3);
    const destination = getGridRange(sheetId, 4, sampleIndex + 1, emptyColumnIndex, emptyColumnIndex + 1);

    const requests = [];
    const copyPasteRequest = getCopyPasteRequest(source, destination);
    const autofillRequest = getAutoFillRequest(false, getGridRange(sheetId, totalIndex, totalIndex + 1, emptyColumnIndex - 1, emptyColumnIndex + 1));

    const headerArray = [];
    const practiceHeader = practiceType[0];
    if ( isSameMonth(data, eventMonth, emptyColumnIndex) ) {
        const currentMonthColumn = getColumnIndex(eventMonth, data);
        const mergeCellsRequest = getMergeCells(sheetId, 0, 1, currentMonthColumn, emptyColumnIndex + 1);
        requests.push(mergeCellsRequest);
    } else {
        headerArray.push(eventMonth);
    }
    headerArray.push(eventDate, practiceHeader);

    const updateCellsRequest = getUpdateHeadersRequest(sheetId, headerArray, emptyColumnIndex);
    const resizeColumnRequest = getResizeColumnRequest(sheetId, emptyColumnIndex, 56);
    
    requests.push(copyPasteRequest);
    requests.push(autofillRequest);
    requests.push(updateCellsRequest);
    requests.push(resizeColumnRequest);

    await batchUpdate(googleSheetClient, requests);
}

function getUpdateHeadersRequest(sheetId, headerArray, columnIndex) {
    const startRowIndex = 3 - headerArray.length;
    const cellFormat = getCellCentreFormat();
    const rows = []
    for (let i = 0; i < headerArray.length; i++) {
        rows.push(getRowData(cellToCellData([headerArray[i]], cellFormat)));
    }
    const range = getGridRange(sheetId, startRowIndex, startRowIndex + headerArray.length, columnIndex, columnIndex + 1);
    const request = getUpdateCellsRequest(rows, range);

    return request;
}

function getRowIndex(name, values) {
    for (let j = 0; j < values[0].length; j++) {
        for (let i = 0; i < values.length; i++) {
            if (values[i][j] === name) return i;
        }
    }
    return -1;
}

function getColumnIndex(name, values) {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[0].length; j++) {
            if (values[i][j] === name) return j;
        }
    }
    return -1;
}

function isSameMonth(data, eventMonth, endIndex) {
    for (let i = endIndex - 1; i >= 0; i--) {
        if (data[0][i] === eventMonth) {
            return true;
        }
        else if (typeof data[0][i] !== 'undefined') {
            return false;
        }
    }
    return false;
}

function getPracticeColumnIndex(data, month, date) {
    const startIndex = data[0].indexOf(month);
    for (let i = startIndex; i < data[1].length; i++) {
        if (data[1][i] === date) {
            return i;
        }
    }
    return -1;
}

async function takeAttendance(subscribers, event) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);
    
    const practiceIndex = getPracticeColumnIndex(data, event);

    const names = getNames(data);
    const updatedCells = [];
    for (let i = 0; i < subscribers.length; i++) {
        if (names.includes(subscribers[i])) {
            updatedCells.push(getValueRange(names.indexOf(subscribers[i]) + 4, practiceIndex, 'ROWS', [['P']]));
        }
    }

    const resource = getBatchUpdateRequest('RAW', updatedCells);
    googleSheetClient.spreadsheets.values.batchUpdate({spreadsheetId : spreadSheetId, resource});
}

async function unsignup_member(member, month, date, type) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);
    
    const request = {
        majorDimension: "ROWS",
        values: [['E']]
    }

    const practiceIndex = getPracticeColumnIndex(data, month, date);

    const names = getNames(data);

    googleSheetClient.spreadsheets.values.update({spreadsheetId: spreadSheetId,
        range: indicesToA1Notation(names.indexOf(member) + 4, practiceIndex), 
        valueInputOption: "USER_ENTERED", 
        resource: request});
    
    return parseInt(getTotalCount(data, practiceIndex)) - 1;
}

async function resignup_member(member, month, date, type) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);
    
    const request = {
        majorDimension: "ROWS",
        values: [['P']]
    }

    const practiceIndex = getPracticeColumnIndex(data, month, date);

    const names = getNames(data);

    googleSheetClient.spreadsheets.values.update({spreadsheetId: spreadSheetId,
        range: indicesToA1Notation(names.indexOf(member) + 4, practiceIndex), 
        valueInputOption: "USER_ENTERED", 
        resource: request});

    return parseInt(getTotalCount(data, practiceIndex)) + 1;
}

function getTotalCount(data, practiceIndex) {
    const totalIndex = getTotalIndex(data);

    return data[totalIndex][practiceIndex];
}

function getSampleIndex(data) {
    return getRowIndex('SAMPLE', data);
}

function getTotalIndex(data) {
    return getRowIndex('TOTAL', data);
}

async function updateName(oldName, newName) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);

    const names = getNames(data);

    const updatedCells = []
    updatedCells.push(getValueRange(names.indexOf(oldName) + 4, 0, 'ROWS', [[newName]]));

    const resource = getBatchUpdateRequest('RAW', updatedCells);
    googleSheetClient.spreadsheets.values.batchUpdate({spreadsheetId : spreadSheetId, resource});
}

function getCopyRowRequest( data, sourceIndex, destinationIndex, height) {
    const endColumnIndex = data[sourceIndex].length;
    const source = getGridRange(sheetId, sourceIndex, sourceIndex + 1, 1, endColumnIndex);
    const destination = getGridRange(sheetId, destinationIndex, destinationIndex + height, 1, endColumnIndex);

    return getCopyPasteRequest(source, destination);
}

function getUpdateNamesRequest(newNames, emptyRowIndex) {
    const cellFormat = getNameCellFormat();
    const rows = []
    for (let i = 0; i < newNames.length; i++) {
        rows.push(getRowData(cellToCellData([newNames[i]], cellFormat)));
    }
    const range = getGridRange(sheetId, emptyRowIndex, emptyRowIndex + newNames.length, 0, 1);
    const request = getUpdateCellsRequest(rows, range);

    return request;
}

async function createNewNameRow(name) {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await getSpreadsheet(googleSheetClient);
    
    const sampleIndex = getSampleIndex(data);
    const emptyRowIndex = data.length;

    const requests = [];
    
    requests.push(getUpdateNamesRequest([name], emptyRowIndex));
    requests.push(getCopyRowRequest(data, sampleIndex, emptyRowIndex, 1));
    await batchUpdate(googleSheetClient, requests);
}

function getBatchUpdateRequest(valueInputOption, data) {
    const request = {
        valueInputOption,
        data
    }
    return request;
}

function getValueRange(row, column, majorDimension, values) {
    range = indicesToA1Notation(row, column);
    const valueRange = {
        range,
        majorDimension,
        values
    }
    return valueRange;
}

function indicesToA1Notation(row, column) {
    let letter = ALPH[column % 26];
    if (column > 25) letter = ALPH[Math.floor(column / 26)-1] + letter;
    
    return `${letter}${row + 1}`;
}


function getNames(data) {
    const names = [];
    for (let i = 4; i < data.length; i++) {
        names[i - 4] = data[i][0];
    }
    return names;
}

function numToMonth(num) {
    const months = 'January February March April May June July August September October November December'.split(' ');

    return months[num];
}


module.exports = {
    createNewAttendanceColumn,
    takeAttendance,
    createNewNameRow,
    updateName,
    unsignup_member,
    resignup_member
}