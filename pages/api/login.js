import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect) {
          return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user = new User({ email, password: hashedPassword });
        await user.save();
        
        return res.status(201).json({ success: true, message: 'Account created and logged in successfully' });
      }
    } catch (error) {
      console.error('Error in login API:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
