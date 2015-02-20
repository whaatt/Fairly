//sort of inefficient; works for the time being
function getRandWithExclusion(start, end, codes) {
  var num = Math.floor(Math.random() * (end - start));
  while (codes.indexOf(num) !== -1) num = (num + 1) % (end - start + 1);
  return Math.floor(num + start);
};

function generateCodes() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  var codes = [];
  var needCodes = [];
  
  for (var i = numRows - 1; i > 0; i--) {
    var row = values[i];
    if (row[13] !== '') codes.push(row[13]);
    else if (row[12] === 'Yes') needCodes.push(i);
  }
  
  for (var i = 0; i < needCodes.length; i++) {
    var code = getRandWithExclusion(100000, 999999, codes);
    codes.push(code); sheet.getRange(needCodes[i] + 1, 14).setValue(code);
  }
};

function sendRelationshipEmail(email, code, you, partner) {
  var message = "Dear " + you + ",\n\n"
    + "Your FairED mentorship with " + partner + " has been successfully approved"
    + " by an administrator. We wish you all the best in the mentorship process!\n"
    + "Please save this relationship code for reference in future Google Form"
    + " correspondence with the FairED team: " + code + ".\n\n"
    + "Sincerely,\nThe FairED Team";
  
  MailApp.sendEmail({
    name : 'FairED Team',
    to : you + ' <' + email + '>',
    subject : 'FairED Mentorship Approved',
    body : message
  });
}

function emailCodes() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert('Email Codes',
    'Are you sure you want to email codes?',
    ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    for (var i = 0; i < numRows; i++) {
      if (values[i][12] === 'Yes' && values[i][14] === '') {
        sendRelationshipEmail(values[i][2], values[i][13], values[i][1], values[i][3]);
        sendRelationshipEmail(values[i][4], values[i][13], values[i][3], values[i][1]);
        sheet.getRange(i + 1, 15).setValue('Yes');
      }
    }
    
    //a small confirmation message
    ui.alert('Email Codes', 'Successfully sent.', ui.ButtonSet.OK); 
  }
}

function doBoth() {
  generateCodes();
  emailCodes();
}

function onOpen() {
  SpreadsheetApp.getActive().addMenu('FairED Actions', [
    {name : 'Generate Codes', functionName : 'generateCodes'},
    {name : 'Email Codes', functionName : 'emailCodes'},
    {name : 'Do Both', functionName : 'doBoth'},
  ]);
};