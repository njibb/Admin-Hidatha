import mongoose from 'mongoose';

const BeritaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: false, // Bisa di-set true kalau banner gambar wajib ada
      default: null,
    },
    unitCode: {
      type: String,
      enum: ['tk', 'mi', 'mts', 'smk'],
      required: true,
    },
    asalData: {
      type: String,
      default: 'MANUAL',
    }
  },
  { timestamps: true }
);

export default mongoose.models.Berita || mongoose.model('Berita', BeritaSchema);