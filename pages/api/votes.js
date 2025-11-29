// pages/api/votes.js
import dbConnect from '../../lib/db';
import Vote from '../../models/Vote';

export default async function handler(req, res) {
  // Log for debugging
  console.log('=== API Route Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    return res.status(200).end();
  }

  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ 
      error: `Method ${req.method} Not Allowed`,
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
  }

  // Connect to database
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(503).json({
      error: 'Database connection failed',
      message: dbError.message,
      success: false
    });
  }

  const candidateName = 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)';

  try {
    if (req.method === 'GET') {
      console.log('Processing GET request...');
      
      let vote = await Vote.findOne({ candidateName });
      
      if (!vote) {
        console.log('No vote record found, creating new one');
        vote = new Vote({
          candidateName,
          count: 0,
          symbol: 'कमळ',
        });
        await vote.save();
      }
      
      console.log('Returning vote count:', vote.count);
      return res.status(200).json({ 
        count: vote.count,
        success: true 
      });
    }

    if (req.method === 'POST') {
      console.log('Processing POST request...');
      
      let vote = await Vote.findOne({ candidateName });
      
      if (!vote) {
        console.log('Creating new vote record');
        vote = new Vote({
          candidateName,
          count: 1,
          symbol: 'कमळ',
        });
      } else {
        console.log('Incrementing existing vote count from', vote.count);
        vote.count += 1;
      }
      
      await vote.save();
      console.log('Vote saved successfully, new count:', vote.count);
      
      return res.status(200).json({ 
        count: vote.count,
        success: true,
        message: 'Vote recorded successfully'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      success: false 
    });
  }
}