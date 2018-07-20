var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var excelToJson = require('convert-excel-to-json')
var fs = require('fs')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var fileUpload = multer({ dest: 'uploads/' }).single('file');
// Have our own middleware invoking as multer handles errors in crappy way
var fileUploadMiddleWare = function (req, res, next) {
  fileUpload(req, res, function (err) {
    if (err) {
      if (err.code == 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Only use field named "file" for file upload, different provided: ' + err.field)
      }
      else {
        res.status(500).send('Unknown error occured')
      }
      return
    }
    return next()
  });
}

// API docs :)
app.get('/', function(req, res) {
  res.status(200).send('POST "file" field containing excel as multipart/form-data in order to convert it to JSON.')
})

// Convert excel to json
app.post('/', fileUploadMiddleWare, function(req, res) {
  var result = false
  // This is how we validate stuff
  try {
    result = excelToJson({
      sourceFile: req.file.path
    })
  } catch (err) {
    res.status(500).send('Error occured when converting excel to json')
  }
  // Remove uploaded file
  fs.unlinkSync(req.file.path)
  if (!result)
    return
  res.json(result)
})

var server = app.listen(3000, function () {
  console.log('API running on port ', server.address().port)
})
