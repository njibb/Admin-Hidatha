import mongoose from 'mongoose';

const PpdbSchema = new mongoose.Schema(
  {
    unitCode: {
      type: String,
      enum: ['tk', 'mi', 'mts', 'smk'],
      required: [true, 'Kode unit wajib diisi'],
    },
    jalurPendaftaran: [
      {
        namaJalur: {
          type: String,
          required: [true, 'Nama jalur wajib diisi (contoh: Umum, Alumni TK Hidatha)'],
        },
        biayaFormulir: {
          type: Number,
          required: [true, 'Biaya formulir wajib diisi'],
        },
        biayaSpp: {
          type: Number,
          required: [true, 'Biaya SPP wajib diisi'],
        },
        uangGedung: {
          type: Number,
          required: [true, 'Uang gedung wajib diisi'],
        },
      }
    ],
    statusBuka: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ppdb || mongoose.model('Ppdb', PpdbSchema);