const Club = require('../models/Club');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find().populate('admin', 'name email').populate('members', 'name email');
  res.json(clubs);
});

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate('admin', 'name email')
    .populate('members', 'name email')
    .populate('events');

  if (club) {
    res.json(club);
  } else {
    res.status(404);
    throw new Error('Club not found');
  }
});

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Admin
const createClub = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const clubExists = await Club.findOne({ name });
  if (clubExists) {
    res.status(400);
    throw new Error('Club already exists');
  }

  const club = await Club.create({
    name,
    description,
    admin: req.user._id,
    members: [req.user._id]
  });

  // Add club to user's clubs array
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { clubs: club._id }
  });

  res.status(201).json(club);
});

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private/ClubAdmin
const updateClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    res.status(404);
    throw new Error('Club not found');
  }

  // Check if user is club admin
  if (club.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this club');
  }

  const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(updatedClub);
});

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
const joinClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    res.status(404);
    throw new Error('Club not found');
  }

  // Check if user is already a member
  if (club.members.includes(req.user._id)) {
    res.status(400);
    throw new Error('Already a member of this club');
  }

  // Add user to club members
  club.members.push(req.user._id);
  await club.save();

  // Add club to user's clubs array
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { clubs: club._id }
  });

  res.json({ message: 'Joined club successfully' });
});

module.exports = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  joinClub
};