const express = require("express");
const router = express.Router();
const kepengurusanController = require("../controllers/kepengurusanController");

// ---------------- Route default (tanpa rw_id) ----------------
router.get("/", kepengurusanController.listKepengurusan);

// form tambah (global, tanpa param RW)
router.get("/add", kepengurusanController.addForm);

// proses tambah
router.post("/add", kepengurusanController.add);

// Edit
router.get("/:rw_id/:id/edit", kepengurusanController.editForm);
router.post("/:rw_id/:id/edit", kepengurusanController.edit);

// Hapus
router.post("/:rw_id/:id/delete", kepengurusanController.delete);

// Export
router.get("/:rw_id/export", kepengurusanController.exportExcel);

// List per RW (paling bawah)
router.get("/:rw_id", kepengurusanController.listKepengurusan);


module.exports = router;
