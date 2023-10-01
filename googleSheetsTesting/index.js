const { google } = require('googleapis');
const { getGoogleSheetClient } = require('./googleAuth');
const { underscore } = require('discord.js');

const serviceAccountKeyFile = 'credentials.json';
spreadSheetId = '107NedbR7ZPVWFQg5hln2c0zXqD-RjNoLfzZCKPXiP-E';
const tabName = 'Attendance Sheet';

main().then( () => {
    console.log('Completed');
})

async function main() {
    // Generating google sheet client
    const googleSheetClient = await getGoogleSheetClient();
  
    // Reading Google Sheet from a specific range
    const data = await getSpreadsheet(googleSheetClient);
    const requests = [];
    // const copyPasteRequest = getCopyPasteRequest(getGridRange('0', 0, 1, 0, 1), getGridRange('0', 1, 2, 1, 2));
    // const updateDimensionPropertiesRequest = getResizeColumnRequest('0', 25, 100);
    // const mergeCells = getMergeCells('0', 0, 1, 12, 17, 'MERGE_ALL');

    // const array = ['0', '1', '2', '3', '4', '5'];
    // const cellFormat = getCellCentreFormat();
    // const cellData = cellToCellData(array, cellFormat);
    // const rowData = getRowData(cellData);
    // const range = getGridRange('0', 20, 21, 0, 6);
    // const updateCellsRequest = getUpdateCellsRequest(rowData, range);
    
    const makeNewColumnRequest = createNewAttendanceColumn(data, '0', 'October', '18', 'Land');
    requests.push(...makeNewColumnRequest);
    await batchUpdate(googleSheetClient, requests);
}

async function getSpreadsheet(googleSheetClient) {
    const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: '107NedbR7ZPVWFQg5hln2c0zXqD-RjNoLfzZCKPXiP-E',
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

async function getResizeColumnRequest(sheetId, index, pixelSize) { 
    const request = await getUpdateDimensionPropertiesRequest(sheetId, 'COLUMNS', index, index + 1, pixelSize);
    return request;
}

async function batchUpdate(googleSheetClient, requests) {
    const batchUpdateRequest = { requests };
    try {
        const response = await googleSheetClient.spreadsheets.batchUpdate({
            spreadsheetId : '107NedbR7ZPVWFQg5hln2c0zXqD-RjNoLfzZCKPXiP-E',
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

function createNewAttendanceColumn(data, sheetId, eventMonth, eventDate, practiceType) {
    const sampleIndex = getRowIndex('SAMPLE', data);
    const emptyRowIndex = data.length;
    const emptyColumnIndex = data[sampleIndex].length;

    const source = getGridRange(sheetId, sampleIndex, sampleIndex + 1, 2, 3);
    const destination = getGridRange(sheetId, 4, emptyRowIndex, emptyColumnIndex, emptyColumnIndex + 1);

    const requests = [];
    const copyPasteRequest = getCopyPasteRequest(source, destination);

    const headerArray = []
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
    
    requests.push(copyPasteRequest);
    requests.push(updateCellsRequest);

    return requests;
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
    console.log(request);
    console.log(rows);
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