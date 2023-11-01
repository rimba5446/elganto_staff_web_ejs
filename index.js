const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const API_BASE_URL = 'http://localhost:3000';

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const passcode = req.body.passcode;
    const response = await axios.post(`${API_BASE_URL}/login`, { passcode });

    const data = response.data;
    if (data.message === "Login Succes") {
      res.render('home', { data });
    } else {
      res.render('login', { error: 'Passcode salah' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/login`);
    const data = response.data;

    res.render('data', { data });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

app.get('/validateQRCode', (req, res) => {
  res.render('validateQRCode');
});

app.post('/validateQRCode', async (req, res) => {
  try {
    const qrData = req.body.qrData;
    const visitorCount = req.body.visitorCount;

    const scanner = new instascan.Scanner({ video: document.getElementById('scanner') });

    scanner.addListener('scan', (content) => {
      if (content === qrData) {
        res.render('validationSuccess');
      } else {
        res.render('validationFailure', { error: 'Validasi QR Code gagal' });
      }
    });

    instascan.Camera.getCameras().then((cameras) => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        console.error('Tidak ada kamera yang tersedia.');
        res.render('validationFailure', { error: 'Tidak ada kamera yang tersedia.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

app.listen(3012, () => {
  console.log('Server berjalan di http://localhost:3012');
});
