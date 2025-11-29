import dbConnect from '../../lib/db';
import Vote from '../../lib/models/Vote';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();

  try {
    if (req.method === 'GET') {
      // Get current vote count
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        vote = await Vote.create({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count: 0,
          symbol: 'कमळ',
        });
      }

      res.status(200).json({ count: vote.count, message: 'Vote count retrieved' });
    } else if (req.method === 'POST') {
      // Increment vote count
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });

      if (!vote) {
        vote = await Vote.create({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count: 1,
          symbol: 'कमळ',
        });
      } else {
        vote.count += 1;
        await vote.save();
      }

      res.status(200).json({ count: vote.count, message: 'Vote counted!' });
    } else if (req.method === 'PUT') {
      // Reset vote count
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });

      if (!vote) {
        vote = await Vote.create({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count: 0,
          symbol: 'कमळ',
        });
      } else {
        vote.count = 0;
        await vote.save();
      }

      res.status(200).json({ count: vote.count, message: 'Vote count reset!' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
