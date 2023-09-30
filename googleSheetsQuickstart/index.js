const {google} = require('googleapis');
const dotenv = require('dotenv');
const googleAuth = require('./googleAuth.js');

dotenv.config();
const service = googleAuth.authorize();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = process.env.ATTENDANCE_SHEET_ID;

async function listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    console.log('Name, Major:');
    rows.forEach((row) => {
      // Print columns A and E, which correspond to indices 0 and 4.
      console.log(`${row[0]}, ${row[4]}`);
    });
    console.log(res);
  }

async function getSpreadsheet(auth) {
    const sheets = google.sheets({ version : 'v4', auth});
    const spreadSheet = await sheets.spreadsheets.values.get({
        spreadsheetId : '107NedbR7ZPVWFQg5hln2c0zXqD-RjNoLfzZCKPXiP-E',
        range : 'Attendance Sheet'
    });
    console.log(spreadSheet);
    console.log(spreadSheet.data.values);
}

service.then(getSpreadsheet).catch(console.error());
