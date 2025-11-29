//lib/models/Vote.js
import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
      default: 'सौ. ॲड प्रणेती सागर निंबोरेकर (भोंडेकर)',
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    symbol: {
      type: String,
      default: 'कमळ',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
