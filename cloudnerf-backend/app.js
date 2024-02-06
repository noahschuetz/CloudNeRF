
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express()
const port = 5000

const { createClient } = require("@supabase/supabase-js");
const { log } = require('console');
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors({
  origin: 'http://localhost:3000'
}));

const upload = multer({ dest: 'uploads/' })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/datasets', (req, res) => {
  supabase
    .storage
    .from('datasets')
    .list()
    .then(({ data, error }) => {
      if (error) {
        console.log('error', error)
        res.status(500).send('error')
      }
      console.log('datasets', data);
      res.send(data)
    })
    .catch((error) => {
      console.log('error', error)
      res.status(500).send('error')
    })
})

app.get('/datasets/:id', (req, res) => {
  const { id } = req.params;
  supabase
    .storage
    .from('datasets')
    .list(id)
    .then(({ data, error }) => {
      if (error) {
        console.log('error', error)
        res.status(500).send('error')
      }
      console.log('datasets', data);
      res.send(data)
    })
    .catch((error) => {
      console.log('error', error)
      res.status(500).send('error')
    })
})

app.get('/datasets/:id/images', (req, res) => {
  const { id } = req.params;
  const filelocation = `${id}/images`
  supabase
    .storage
    .from('datasets')
    .list(filelocation)
    .then(({ data, error }) => {
      if (error) {
        console.log('error', error)
        res.status(500).send('error')
      }
      console.log('datasets', data);
      res.send(data)
    })
    .catch((error) => {
      console.log('error', error)
      res.status(500).send('error')
    })
})

app.post('/datasets/:id/images', upload.array('file', 400), function (req, res, next) {

  const { id } = req.params;
  console.log('id', id);

  console.log('files', req.files);

  // now upload to supabase
  const filelocation = id + '/images/' + req.files[0].originalname

  console.log('filelocation', filelocation);
  const fileContent = fs.readFileSync(req.files[0].path);

  supabase
    .storage
    .from('datasets')
    .upload(filelocation, fileContent, { contentType: req.files[0].mimetype })
    .then(({ data, error }) => {
      if (error) {
        console.log('error', error)
        res.status(500).send('error')
      }
      console.log('datasets', data);
      res.send(data)

      // Clean up uploaded file from the server
      fs.unlink(req.files[0].path, (err) => {
        if (err) {
          console.error('Error cleaning up file:', err);
        } else {
          console.log('File deleted successfully:', req.files[0].path);
        }
      });
    })
    .catch((error) => {
      console.log('error', error)
      res.status(500).send('error')
    })
})

app.post('/datasets/:id/transforms', upload.array('file', 400), function (req, res, next) {

  const { id } = req.params;

  console.log('files', req.files);

  // now upload to supabase
  const filelocation = id + '/' + req.files[0].originalname

  console.log('filelocation', filelocation);
  const fileContent = fs.readFileSync(req.files[0].path);

  supabase
    .storage
    .from('datasets')
    .upload(filelocation, fileContent, { contentType: req.files[0].mimetype })
    .then(({ data, error }) => {
      if (error) {
        console.log('error', error)
        res.status(500).send('error')
      }
      console.log('datasets', data);
      res.send(data)

      // Clean up uploaded file from the server
      fs.unlink(req.files[0].path, (err) => {
        if (err) {
          console.error('Error cleaning up file:', err);
        } else {
          console.log('File deleted successfully:', req.files[0].path);
        }
      });
    })
    .catch((error) => {
      console.log('error', error)
      res.status(500).send('error')
    })
})






