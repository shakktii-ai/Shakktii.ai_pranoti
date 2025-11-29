import dbConnect from '@/lib/db';
import Vote from '@/models/Vote';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to database
  try {
    await dbConnect();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(503).json({
      message: 'Service temporarily unavailable (DB connection failed).',
      error: dbError.message,
    });
  }

  // GET: Fetch current vote count
  if (req.method === 'GET') {
    try {
      const vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        const newVote = new Vote({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count: 0,
          symbol: 'कमळ',
        });
        await newVote.save();
        return res.status(200).json({ count: 0 });
      }
      
      return res.status(200).json({ count: vote.count });
    } catch (error) {
      console.error('Error fetching vote:', error);
      return res.status(500).json({ error: 'Failed to fetch vote count' });
    }
  }

  // POST: Increment vote count
  if (req.method === 'POST') {
    try {
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        vote = new Vote({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count: 1,
          symbol: 'कमळ',
        });
      } else {
        vote.count += 1;
      }
      
      await vote.save();
      return res.status(200).json({ count: vote.count });
    } catch (error) {
      console.error('Error incrementing vote:', error);
      return res.status(500).json({ error: 'Failed to increment vote' });
    }
  }

  // If no method matches
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
