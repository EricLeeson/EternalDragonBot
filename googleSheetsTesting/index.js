const { google } = require('googleapis');
const { getGoogleSheetClient } = require('./googleAuth');

const serviceAccountKeyFile = 'credentials.json';
const sheetId = '107NedbR7ZPVWFQg5hln2c0zXqD-RjNoLfzZCKPXiP-E';
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

    // requests.push(mergeCells);
    // await batchUpdate(googleSheetClient, requests);
    // console.log(data);
}

async function getSpreadsheet(googleSheetClient) {
    const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
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
    const spreadsheetId = sheetId;
    try {
        const response = await googleSheetClient.spreadsheets.batchUpdate({
            spreadsheetId,
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

function getUpdateCellsRequest(rowData, range) {
    const request = {
        rows : [ rowData ],
        fields : 'CellData.userEnteredValue.userEnteredFormat',
        range
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

function getRowData(...values) {
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