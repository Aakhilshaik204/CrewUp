import EquipmentRequest from '../models/EquipmentRequest.js';

// @desc    Create a new equipment request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { title, description, category, neededBy } = req.body;

    const newRequest = await EquipmentRequest.create({
      title,
      description,
      category,
      neededBy,
      requester: req.user._id,
    });

    res.status(201).json({
      success: true,
      request: newRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;

    const requests = await EquipmentRequest.find(query)
      .populate('requester', 'name profileImage')
      .populate('lender', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res) => {
  try {
    const request = await EquipmentRequest.findById(req.params.id)
      .populate('requester', 'name profileImage branch year')
      .populate('lender', 'name profileImage');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept to lend equipment
// @route   PUT /api/requests/:id/accept
// @access  Private
export const acceptRequest = async (req, res) => {
  try {
    const { lenderMessage } = req.body;
    const request = await EquipmentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.requester.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot accept your own request' });
    }

    if (request.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This request is no longer open' });
    }

    request.status = 'Accepted';
    request.lender = req.user._id;
    request.lenderMessage = lenderMessage;

    await request.save();

    const updatedRequest = await EquipmentRequest.findById(req.params.id)
      .populate('requester', 'name profileImage branch year')
      .populate('lender', 'name profileImage');

    res.status(200).json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark request as completed or cancel
// @route   PUT /api/requests/:id/status
// @access  Private
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await EquipmentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Only requester can mark as completed or cancelled
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
