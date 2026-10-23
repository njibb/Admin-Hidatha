import mongoose from 'mongoose';

const strukturSchema = new mongoose.Schema({
  nama: { 
    type: String, 
    required: [true, 'Nama pengurus wajib diisi'] 
  },
  jabatan: { 
    type: String, 
    required: [true, 'Jabatan wajib diisi'] 
  },
  kategori: { 
    type: String, 
    required: [true, 'Kategori hierarki wajib dipilih'],
    enum: ['pimpinan', 'komite', 'wakil_tu', 'walikelas'] // Kunci hierarki untuk frontend
  },
  unitCode: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Struktur || mongoose.model('Struktur', strukturSchema);