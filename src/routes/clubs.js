const express = require('express');
const router = express.Router();
const { 
  getClubs, 
  getClubById, 
  createClub, 
  updateClub, 
  joinClub 
} = require('../controllers/clubs');
const { protect, clubAdmin, admin } = require('../middleware/auth');

router.route('/')
  .get(getClubs)
  .post(protect, admin, createClub);

router.route('/:id')
  .get(getClubById)
  .put(protect, clubAdmin, updateClub);

router.post('/:id/join', protect, joinClub);

module.exports = router;