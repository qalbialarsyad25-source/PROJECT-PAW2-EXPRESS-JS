const express = require('express');
const path = require('node:path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON dan URL-encoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis (UI Frontend) dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// API ENDPOINTS (CRUD TABEL MAHASISWA)
// ==========================================

// 1. READ ALL - Ambil semua data mahasiswa (dengan filter pencarian opsional)
app.get('/api/mahasiswa', (req, res) => {
  try {
    const { search } = req.query;
    let query;
    let data;

    if (search && search.trim() !== '') {
      query = db.prepare(`
        SELECT * FROM mahasiswa 
        WHERE nama LIKE ? OR nim LIKE ? OR jurusan LIKE ?
        ORDER BY id DESC
      `);
      const keyword = `%${search.trim()}%`;
      data = query.all(keyword, keyword, keyword);
    } else {
      query = db.prepare('SELECT * FROM mahasiswa ORDER BY id DESC');
      data = query.all();
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data mahasiswa',
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. READ ONE - Ambil 1 data mahasiswa berdasarkan ID
app.get('/api/mahasiswa/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = db.prepare('SELECT * FROM mahasiswa WHERE id = ?').get(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Mahasiswa dengan ID ${id} tidak ditemukan`
      });
    }

    res.json({
      success: true,
      message: 'Detail mahasiswa ditemukan',
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. CREATE - Tambah data mahasiswa baru
app.post('/api/mahasiswa', (req, res) => {
  try {
    const { nim, nama, jurusan, angkatan } = req.body;

    // Validasi input
    if (!nim || !nama || !jurusan || !angkatan) {
      return res.status(400).json({
        success: false,
        message: 'Field nim, nama, jurusan, dan angkatan wajib diisi!'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO mahasiswa (nim, nama, jurusan, angkatan)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(nim.trim(), nama.trim(), jurusan.trim(), Number(angkatan));

    const newMahasiswa = db.prepare('SELECT * FROM mahasiswa WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Data mahasiswa berhasil ditambahkan',
      data: newMahasiswa
    });
  } catch (error) {
    // Tangani error duplikasi NIM (UNIQUE constraint)
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'NIM tersebut sudah terdaftar, gunakan NIM lain!'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. UPDATE - Perbarui data mahasiswa berdasarkan ID
app.put('/api/mahasiswa/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nim, nama, jurusan, angkatan } = req.body;

    // Cek apakah data ada
    const existing = db.prepare('SELECT * FROM mahasiswa WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Mahasiswa dengan ID ${id} tidak ditemukan`
      });
    }

    // Validasi input
    if (!nim || !nama || !jurusan || !angkatan) {
      return res.status(400).json({
        success: false,
        message: 'Field nim, nama, jurusan, dan angkatan wajib diisi!'
      });
    }

    const stmt = db.prepare(`
      UPDATE mahasiswa 
      SET nim = ?, nama = ?, jurusan = ?, angkatan = ?
      WHERE id = ?
    `);

    stmt.run(nim.trim(), nama.trim(), jurusan.trim(), Number(angkatan), id);

    const updated = db.prepare('SELECT * FROM mahasiswa WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Data mahasiswa berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'NIM tersebut sudah terdaftar pada mahasiswa lain!'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. DELETE - Hapus data mahasiswa berdasarkan ID
app.delete('/api/mahasiswa/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM mahasiswa WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Mahasiswa dengan ID ${id} tidak ditemukan`
      });
    }

    const stmt = db.prepare('DELETE FROM mahasiswa WHERE id = ?');
    stmt.run(id);

    res.json({
      success: true,
      message: `Mahasiswa dengan ID ${id} (${existing.nama}) berhasil dihapus`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Server berjalan di http://localhost:${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/mahasiswa`);
  console.log(`===============================================`);
});
