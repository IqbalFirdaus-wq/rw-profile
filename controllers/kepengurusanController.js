// controllers/kepengurusanController.js
const pool = require('../config/db');
const ExcelJS = require('exceljs');

/* =========================================================
   LIST KEPENGURUSAN
   ========================================================= */
   exports.listKepengurusan = async (req, res) => {
    try {
      const { rw_id } = req.params; // param dari URL
      let { sort, order } = req.query;
  
      // ✅ Validasi kolom sort & order
      const allowedSort = ["nama", "jabatan", "no_ktp", "telp", "alamat", "created_at"];
      if (!allowedSort.includes(sort)) sort = "created_at";
      order = order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  
      // ✅ Ambil semua RW untuk dropdown
      const [allRw] = await pool.query("SELECT * FROM rw ORDER BY kode_rw ASC");
  
      let rows, rw;
  
      if (rw_id) {
        // ✅ Join pakai kode_rw
        [rows] = await pool.query(
          `SELECT k.*, r.kode_rw, r.nama_rw
           FROM kepengurusan_rw k
           JOIN rw r ON k.rw_id = r.kode_rw
           WHERE k.rw_id = ?
           ORDER BY ${sort} ${order}`,
          [rw_id]
        );
  
        // Ambil data RW by kode_rw
        const [rwRows] = await pool.query("SELECT * FROM rw WHERE kode_rw = ?", [rw_id]);
        rw = rwRows.length ? rwRows[0] : null;
      } else {
        [rows] = await pool.query(
          `SELECT k.*, r.kode_rw, r.nama_rw
           FROM kepengurusan_rw k
           JOIN rw r ON k.rw_id = r.kode_rw
           ORDER BY ${sort} ${order}`
        );
        rw = null;
      }
  
      res.render("kepengurusan/kepengurusan", {
        pengurus: rows,
        rw,
        rw_id,
        allRw,
        sort,
        order,
        title: rw
          ? `Daftar Pengurus RW ${rw.kode_rw} - ${rw.nama_rw}`
          : "Daftar Seluruh Pengurus RW"
      });
    } catch (err) {
      console.error("❌ Error listKepengurusan:", err);
      res.status(500).send("Gagal menampilkan data kepengurusan");
    }
  };  

// ==================== FORM TAMBAH ====================
exports.addForm = async (req, res) => {
  try {
    // Ambil rw_id dari parameter URL
    const { rw_id } = req.params;

    // Ambil semua RW untuk dropdown (kalau memang butuh pilih RW)
    const [rwList] = await pool.query("SELECT * FROM rw ORDER BY kode_rw ASC");

    res.render("kepengurusan/addKepengurusan", {
      rwList, 
      rw_id,   // ✅ lempar ke EJS agar tidak error
      title: "Tambah Pengurus RW",
    });
  } catch (err) {
    console.error("❌ Error addForm:", err);
    res.status(500).send("Gagal memuat form tambah");
  }
};


// ==================== PROSES TAMBAH ====================
exports.add = async (req, res) => {
  try {
    const { rw_id, nama, jabatan, no_ktp, telp, alamat } = req.body;

    if (!rw_id || !nama || !jabatan) {
      return res.status(400).send("RW, Nama, dan Jabatan wajib diisi");
    }

    await pool.query(
      `INSERT INTO kepengurusan_rw 
        (rw_id, nama, jabatan, no_ktp, telp, alamat)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [rw_id, nama, jabatan, no_ktp, telp, alamat]
    );

    // redirect ke daftar pengurus RW yg dipilih
    res.redirect(`/kepengurusan/${rw_id}`);
  } catch (err) {
    console.error("❌ Error add:", err);
    res.status(500).send("Gagal menambah pengurus");
  }
};

/* =========================================================
   FORM EDIT
   ========================================================= */
exports.editForm = async (req, res) => {
  try {
    const { id, rw_id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM kepengurusan_rw WHERE id=?',
      [id]
    );
    const [rwRows] = await pool.query('SELECT * FROM rw WHERE id=?', [rw_id]);

    res.render('kepengurusan/editKepengurusan', {
      p: rows[0],
      rw_id,
      rw: rwRows[0] || null,
      title: 'Edit Pengurus'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal memuat form edit');
  }
};

/* =========================================================
   FORM EDIT
   ========================================================= */
   exports.editForm = async (req, res) => {
    try {
      const { id, rw_id } = req.params;
  
      const [rows] = await pool.query(
        "SELECT * FROM kepengurusan_rw WHERE id=?",
        [id]
      );
      if (!rows.length) return res.status(404).send("Pengurus tidak ditemukan");
  
      const [rwRows] = await pool.query(
        "SELECT id, kode_rw, nama_rw FROM rw WHERE id=?",
        [rw_id]
      );
      const rw = rwRows.length ? rwRows[0] : null;
  
      res.render("kepengurusan/editKepengurusan", {
        p: rows[0],
        rw_id,
        rw,
        title: "Edit Pengurus"
      });
    } catch (err) {
      console.error("❌ Error editForm:", err);
      res.status(500).send("Gagal memuat form edit");
    }
  };
  
  /* =========================================================
     PROSES EDIT
     ========================================================= */
  exports.edit = async (req, res) => {
    try {
      const { id, rw_id } = req.params;
      const { nama, jabatan, no_ktp, telp, alamat } = req.body;
  
      await pool.query(
        `UPDATE kepengurusan_rw
         SET nama=?, jabatan=?, no_ktp=?, telp=?, alamat=? 
         WHERE id=?`,
        [nama, jabatan, no_ktp, telp, alamat, id]
      );
  
      res.redirect(`/kepengurusan/${rw_id}`);
    } catch (err) {
      console.error("❌ Error edit:", err);
      res.status(500).send("Gagal mengupdate data pengurus");
    }
  };
  
  /* =========================================================
     HAPUS
     ========================================================= */
  exports.delete = async (req, res) => {
    try {
      const { id, rw_id } = req.params;
      await pool.query("DELETE FROM kepengurusan_rw WHERE id=?", [id]);
      res.redirect(`/kepengurusan/${rw_id}`);
    } catch (err) {
      console.error("❌ Error delete:", err);
      res.status(500).send("Gagal menghapus data pengurus");
    }
  };
  

/* =========================================================
   EXPORT EXCEL
   ========================================================= */
exports.exportExcel = async (req, res) => {
  try {
    const { rw_id } = req.params;

    // Ambil kode RW
    const [rwRows] = await pool.query('SELECT kode_rw FROM rw WHERE id=?', [rw_id]);
    if (rwRows.length === 0) {
      return res.status(404).send('RW tidak ditemukan');
    }
    const kode_rw = rwRows[0].kode_rw;

    const [rows] = await pool.query(
      'SELECT nama, jabatan, no_ktp, telp, alamat FROM kepengurusan_rw WHERE rw_id=? ORDER BY jabatan',
      [rw_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Pengurus RW ${kode_rw}`);

    sheet.columns = [
      { header: 'Nama',    key: 'nama',    width: 25 },
      { header: 'Jabatan', key: 'jabatan', width: 20 },
      { header: 'No KTP',  key: 'no_ktp',  width: 20 },
      { header: 'Telepon', key: 'telp',    width: 20 },
      { header: 'Alamat',  key: 'alamat',  width: 40 }
    ];

    sheet.addRows(rows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=kepengurusan_rw_${kode_rw}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export Excel');
  }
};
