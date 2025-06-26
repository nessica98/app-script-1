const LINE_ACCESS_TOKEN = '';
const LINE_ACCESS_TOKEN_REAL = '';
const USER_ID = '';
const HEADER_TEXT = 'บันทึกค่า Air chiller โรงไฟฟ้า'
function parseNumberOrNaN(value) {
  const trimmed = value.toString().trim();
  return trimmed !== "" && !isNaN(trimmed) ? Number(trimmed) : NaN;
}

function differenceDetail(diff) {
  if (diff > 10) {
    return '(ขอแจ้งล้าง condenser)'
  } else {
    return '(ปกติ)'
  }
}

function roundTo2Decimals(value) {
  const num = Number(value);
  return isNaN(num) ? NaN : Math.round(num * 100) / 100;
}

function myFunction(e) {
  const formResp = e.values; // [<time>, <no 1>, <no2>]

  const date = formResp[1];
  const time = formResp[2];

  const airChillerNo = formResp[7];
  const satCondTemp = roundTo2Decimals(parseNumberOrNaN(formResp[3]));
  const conLeaveTemp = roundTo2Decimals(parseNumberOrNaN(formResp[4]));

  const diff = satCondTemp - conLeaveTemp;

  const text = [
    HEADER_TEXT,
    textLine("Air Chiller No.", airChillerNo),
    textLine("วัน เวลา", `${date} ${time}`),
    textLine("Saturate Cond.Temp.", satCondTemp.toString()),
    textLine("Condenser Leaving Temp.", conLeaveTemp,toString()),
    textLine("difference", roundTo2Decimals(diff)),
    differenceDetail(diff),
    textLine("ผู้บันทึก", formResp[6])
  ].join("\n");

  sendLine(text);
}

function textLine(head, val) {
  return [head, val].join(": ")
}

function sendLine(text) {
  // Build payload for LINE Messaging API
  const payload = {
    // to: USER_ID,
    messages: [
      {
        type: 'text',
        text: text
      }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + LINE_ACCESS_TOKEN_REAL
    },
    payload: JSON.stringify(payload)
  };

  // Send to LINE
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', options);
}
