# Project CRUD Sederhana (1 Tabel) - Express.js & SQLite

Project aplikasi web sederhana yang mengimplementasikan operasi **CRUD (Create, Read, Update, Delete)** untuk 1 tabel database (**Tabel Mahasiswa**) menggunakan **Express.js** di sisi backend, database **SQLite** (menggunakan modul bawaan `node:sqlite`), serta tampilan antarmuka web modern dan responsif (HTML, CSS, dan Vanilla JavaScript).

---

## 📁 Struktur Direktori

```text
PROJECT-PAW2/
├── database.js          # Konfigurasi database SQLite & skema tabel mahasiswa
├── server.js            # Server Express.js & routing RESTful API
├── package.json         # Konfigurasi npm package & scripts
├── public/              # Frontend Web UI (Antarmuka Pengguna)
│   ├── index.html       # Halaman utama aplikasi (Form & Tabel)
│   ├── style.css        # Styling CSS modern & responsif
│   └── app.js           # Logika fetch API frontend (CRUD interaktif)
└── README.md            # Dokumentasi petunjuk penggunaan
```

---

## 🗄️ Skema Database (Tabel: `mahasiswa`)

Tabel dibuat secara otomatis saat server pertama kali dijalankan:

| Nama Kolom   | Tipe Data | Keterangan                                      |
| ------------ | --------- | ----------------------------------------------- |
| `id`         | `INTEGER` | Primary Key, Auto Increment                     |
| `nim`        | `TEXT`    | Unique, Tidak boleh kosong (NIM Mahasiswa)      |
| `nama`       | `TEXT`    | Tidak boleh kosong (Nama Lengkap Mahasiswa)     |
| `jurusan`    | `TEXT`    | Tidak boleh kosong (Program Studi / Jurusan)    |
| `angkatan`   | `INTEGER` | Tidak boleh kosong (Tahun Angkatan, misal 2023) |
| `created_at` | `DATETIME`| Otomatis diisi waktu pembuatan (CURRENT_TIMESTAMP)|

> *Saat pertama kali dijalankan, sistem secara otomatis memasukkan 3 data awal (dummy seed data).*

---

## 🚀 Cara Menjalankan Project

### 1. Prasyarat
- Pastikan [Node.js](https://nodejs.org/) sudah terinstal di komputer (disarankan versi 22+).

### 2. Menjalankan Server
Buka terminal / Command Prompt di folder project ini, lalu jalankan:

```bash
npm start
```

Atau untuk mode development (otomatis restart saat ada perubahan file):
```bash
npm run dev
```

### 3. Membuka di Browser
Buka browser favorit Anda (Chrome, Edge, Firefox) dan akses:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Dokumentasi RESTful API

Selain melalui antarmuka web, Anda juga dapat menguji endpoint menggunakan **Postman**, **cURL**, atau ekstensi **Thunder Client** di VS Code:

### 1. Mengambil Semua Data (Read All)
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/mahasiswa`
- **Query Params (Opsional)**: `?search=budi` (mencari berdasarkan NIM, nama, atau jurusan)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data mahasiswa",
    "data": [
      {
        "id": 1,
        "nim": "220001",
        "nama": "Ahmad Pratama",
        "jurusan": "Teknik Informatika",
        "angkatan": 2022,
        "created_at": "2026-11-19 15:47:00"
      }
    ]
  }
  ```

### 2. Mengambil Detail 1 Data (Read One)
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/mahasiswa/:id`
- **Contoh**: `http://localhost:3000/api/mahasiswa/1`

### 3. Menambah Data Baru (Create)
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/mahasiswa`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "nim": "230010",
    "nama": "Citra Lestari",
    "jurusan": "Sistem Informasi",
    "angkatan": 2023
  }
  ```

### 4. Memperbarui Data (Update)
- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/mahasiswa/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "nim": "230010",
    "nama": "Citra Lestari Putri",
    "jurusan": "Sains Data",
    "angkatan": 2023
  }
  ```

### 5. Menghapus Data (Delete)
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/mahasiswa/:id`
- **Contoh**: `http://localhost:3000/api/mahasiswa/1`
