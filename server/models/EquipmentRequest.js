import mongoose from 'mongoose';

const equipmentRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Sports', 'Gaming', 'Other'],
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Accepted', 'Completed', 'Cancelled'],
      default: 'Open',
    },
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lenderMessage: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    neededBy: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

const EquipmentRequest = mongoose.model('EquipmentRequest', equipmentRequestSchema);
export default EquipmentRequest;
