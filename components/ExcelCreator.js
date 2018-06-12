const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const redis = require('redis');
const mime = require('mime');

const redisClient = redis.createClient();

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

exports.createTripAdvisorExcel = (arrValues, res) => {
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

      wb.write(filename, (err, stats) => {
        if (err) {
          throw new Error(err.message);
        }

        /* const mimetype = mime.getType(filename);
        res.setHeader('Content-Type', mimetype);
        res.setHeader(
          'Content-disposition',
          `attachment; filename=${filename}`,
        ); */
        return res.download(filename, `trip-advisor-${Date.now()}.xlsx`);
        /* fs.unlink(filename, err => {
          res.status(200).send('ALRAIT');
        }); */
      });
    } catch (err) {
      throw new Error(err.message);
    }
  } else {
    return;
  }
};
