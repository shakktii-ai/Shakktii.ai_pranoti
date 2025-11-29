import dbConnect from '@/lib/db';
import Vote from '@/models/Vote';

// Disable body parsing, we'll handle it ourselves
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Connect to database
  try {
    await dbConnect();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(503).json({
      message: 'Service temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? dbError.message : 'Database connection failed',
    });
  }

  const candidateName = 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)';

  // GET: Fetch current vote count
  if (req.method === 'GET') {
    try {
      let vote = await Vote.findOne({ candidateName });
      
      if (!vote) {
        vote = new Vote({
          candidateName,
          count: 0,
          symbol: 'कमळ',
        });
        await vote.save();
      }
      
      return res.status(200).json({ 
        count: vote.count,
        success: true 
      });
    } catch (error) {
      console.error('Error fetching vote:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch vote count',
        success: false 
      });
    }
  }

  // POST: Increment vote count
  if (req.method === 'POST') {
    try {
      let vote = await Vote.findOne({ candidateName });
      
      if (!vote) {
        vote = new Vote({
          candidateName,
          count: 1,
          symbol: 'कमळ',
        });
      } else {
        vote.count += 1;
      }
      
      await vote.save();
      
      return res.status(200).json({ 
        count: vote.count,
        success: true 
      });
    } catch (error) {
      console.error('Error incrementing vote:', error);
      return res.status(500).json({ 
        error: 'Failed to increment vote',
        success: false 
      });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).json({ 
    error: `Method ${req.method} not allowed`,
    success: false 
  });
}