import mongoose from 'mongoose';

const AgendaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul agenda wajib diisi'],
    },
    startDate: {
      type: Date,
      required: [true, 'Tanggal mulai wajib diisi'],
    },
    endDate: {
      type: Date,
      required: [true, 'Tanggal selesai wajib diisi'],
    },
    kategori: {
      type: String,
      enum: [
        'pengenalan',      // Cream
        'asesmen_sumatif', // Hijau
        'penyerahan_rapor',// Kuning
        'libur_semester',  // Pink
        'libur_idul_fitri',// Orange
        'ujian_madrasah',  // Hijau Muda
        'libur_nasional',  // Merah
        'lainnya'          // Abu-abu / Default
      ],
      default: 'lainnya',
    },
    description: {
      type: String,
      default: '',
    },
    unitCode: {
      type: String,
      enum: ['tk', 'mi', 'mts', 'smk'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Agenda || mongoose.model('Agenda', AgendaSchema);