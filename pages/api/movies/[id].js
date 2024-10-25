
import dbConnect from '../../../lib/dbConnect';
import Movie from '../../../models/Movie';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const movie = await Movie.findById(id);
        if (!movie) {
          return res.status(404).json({ success: false, message: 'Movie not found' });
        }
        res.status(200).json({ success: true, data: movie });
      } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      const form = new formidable.IncomingForm();
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return res.status(500).json({ success: false, message: 'Form parsing failed' });
        }

        const updateData = { ...fields }; // Collect text fields

        if (files.poster) {
          const file = files.poster;
          const newFileName = `${uuidv4()}_${file.originalFilename}`;
          const uploadPath = path.join(uploadDir, newFileName);

       
          fs.rename(file.filepath, uploadPath, async (fileError) => {
            if (fileError) {
              console.error('Error saving file:', fileError);
              return res.status(500).json({ success: false, message: 'File processing error' });
            }


            updateData.poster = `/uploads/${newFileName}`;

            try {
              const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true });
              if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
              }
              res.status(200).json({ success: true, data: movie });
            } catch (updateError) {
              console.error('Error updating movie:', updateError);
              res.status(400).json({ success: false, message: updateError.message });
            }
          });
        } else {
          try {
            const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true });
            if (!movie) {
              return res.status(404).json({ success: false, message: 'Movie not found' });
            }
            res.status(200).json({ success: true, data: movie });
          } catch (updateError) {
            console.error('Error updating movie:', updateError);
            res.status(400).json({ success: false, message: updateError.message });
          }
        }
      });
      break;

    case 'DELETE':
      try {
        const deletedMovie = await Movie.deleteOne({ _id: id });
        if (!deletedMovie) {
          return res.status(404).json({ success: false, message: 'Movie not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
