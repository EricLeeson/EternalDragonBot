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
    const copyPasteRequest = await getCopyPasteRequest(googleSheetClient, ['0', 0, 1, 0, 1], ['0', 1, 2, 1, 2]);
    requests.push(copyPasteRequest);
    await batchUpdate(googleSheetClient, requests);
    console.log(data);
}

async function getSpreadsheet(googleSheetClient) {
    const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tabName}`,
    });
  
    return res.data.values;
}

async function getCopyPasteRequest(googleSheetClient, sourceArgs, destArgs) {
    const [ sourceSheetId,
            sourceStartRowIndex,    sourceEndRowIndex,
            sourceStartColumnIndex, sourceEndColumnIndex ] = sourceArgs;
    
    const [ destSheetId,
            destStartRowIndex,      destEndRowIndex,
            destStartColumnIndex,   destEndColumnIndex ] = destArgs;

    const request = {
        copyPaste : {
            source : {
                sheetId : sourceSheetId,
                startRowIndex : sourceStartRowIndex,
                endRowIndex : sourceEndRowIndex,
                startColumnIndex : sourceStartColumnIndex,
                endColumnIndex : sourceEndColumnIndex
            },
            destination : {
                sheetId : destSheetId,
                startRowIndex : destStartRowIndex,
                endRowIndex : destEndRowIndex,
                startColumnIndex : destStartColumnIndex,
                endColumnIndex : destEndColumnIndex
            },
        }
    };
    console.log(request);
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

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
    await googleSheetClient.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${tabName}`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            "majorDimension": "ROWS",
            "values": data
        },
    })
}