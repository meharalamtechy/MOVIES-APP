import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../lib/dbConnect';
import Movie from '../../models/Movie';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const movies = await Movie.find({}).skip(skip).limit(Number(limit));
        const totalMovies = await Movie.countDocuments();

        res.status(200).json({
          success: true,
          data: movies,
          totalCount: totalMovies,
          totalPages: Math.ceil(totalMovies / limit),
          currentPage: page,
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      const form = new IncomingForm();
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing the file:', err);
          return res.status(500).json({ error: 'File upload error', details: err });
        }

        const { title, year } = fields;
        const file = files.poster;
console.log(file, files.poster, fields, "in this");

        if (!file || !file.filepath) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }

        const newFileName = `${uuidv4()}_${file.originalFilename}`;
        const uploadPath = path.join(uploadDir, newFileName);

        fs.rename(file.filepath, uploadPath, async (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error saving file', details: err });
          }

          const newMovie = new Movie({
            title,
            year,
            poster: `/uploads/${newFileName}`,
          });

          try {
            await newMovie.save();
            return res.status(201).json(newMovie);
          } catch (error) {
            return res.status(500).json({ error: 'Failed to save movie', details: error });
          }
        });
      });
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
};

export default handler;
