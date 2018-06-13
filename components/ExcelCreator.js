const xl = require('excel4node');
const path = require('path');
const AWS = require('aws-sdk');

/* AWS.config.update({
  accessKeyId: '',
  secretAccessKey: ''
}) */

// Create a new instance of a Workbook class
const wb = new xl.Workbook();

// Add Worksheets to the workbook
const ws = wb.addWorksheet('Sheet 1');

// Create a reusable style
const style = wb.createStyle({
  font: {
    color: '#000000',
    size: 14,
  },
});

exports.createTripAdvisorExcel = async (arrValues, res) => {
  if (arrValues.length) {
    try {
      arrValues.map((val, i) => {
        ws.cell(i + 1, 1)
          .string(val.reviewer)
          .style(style);
        ws.cell(i + 1, 2)
          .string(val.reviewHeader)
          .style(style);
        ws.cell(i + 1, 3)
          .string(val.reviewBody)
          .style(style);
        ws.cell(i + 1, 4)
          .string(val.reviewDate)
          .style(style);
        ws.cell(i + 1, 5)
          .number(val.rating)
          .style(style);
        ws.cell(i + 1, 6)
          .string(val.reviewLink)
          .style(style);
        ws.cell(i + 1, 6)
          .number(val.isReplied)
          .style(style);
      });

      const filename = path.join(
        process.cwd(),
        `trip-advisor-${Date.now()}.xlsx`,
      );

      /* wb.write(filename, (err, stats) => {
        if (err) {
          throw new Error(err.message);
        }

        return res.download(filename, `trip-advisor-${Date.now()}.xlsx`);
      }); */

      const buffer = await wb.writeToBuffer();
      const s3 = new AWS.S3();
      s3.putObject(
        {
          Bucket: 'hotels-app-assets',
          Key: `trip-advisor-${Date.now()}.xlsx`,
          Body: buffer,
          ACL: 'public-read',
        },
        (err, resp) => {
          if (err) {
            console.log('ERROR: ', err);
          }
          console.log('UPLOADED: ', resp);
        },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  } else {
    return;
  }
};
