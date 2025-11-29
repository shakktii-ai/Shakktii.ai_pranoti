//pages/api/votes/votes.js

import dbConnect from '@/lib/db';
import Vote from '@/lib/models/Vote';

const allowCors = (handler) => async (req, res) => {
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
    res.status(200).end();
    return { props: {} }; // Add this line
  }

  // Continue to the next handler
  return await handler(req, res);
};

const handler = async (req, res) => {

  try {
    await dbConnect();
  } catch (dbError) {
    console.error('Database connection error:', dbError.message);
    console.error('Full error:', dbError);
    return res.status(503).json({
      message: 'Service temporarily unavailable (DB connection failed).',
      error: dbError.message,
    });
  }

  // GET: Fetch current vote count
  if (req.method === 'GET') {
    await dbConnect();
    try {
      const vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        // Create initial vote record if it doesn't exist
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
await dbConnect();
    try {
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        // Create initial vote record if it doesn't exist
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

  // PUT: Update vote count (optional)
  if (req.method === 'PUT') {
    try {
      const { count } = req.body;
      
      if (typeof count !== 'number') {
        return res.status(400).json({ error: 'Invalid count value' });
      }
      
      let vote = await Vote.findOne({ candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)' });
      
      if (!vote) {
        vote = new Vote({
          candidateName: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
          count,
          symbol: 'कमळ',
        });
      } else {
        vote.count = count;
      }
      
      await vote.save();
      return res.status(200).json({ count: vote.count });
    } catch (error) {
      console.error('Error updating vote:', error);
      return res.status(500).json({ error: 'Failed to update vote' });
    }
  }

  // If no method matches
  return res.status(405).json({ error: 'Method not allowed' });
}

export default allowCors(handler);
