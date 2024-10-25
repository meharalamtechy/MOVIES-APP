
import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  poster: { type: String, required: true }, 
});

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
