const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Dashboard route
router.get('/', async (req, res) => {
  const habits = await Habit.find();

  const habitsWithStreak = habits.map(habit => {
    const streak = calculateStreak(habit.log);
    return { ...habit._doc, streak };
  });

  res.render('dashboard', { habits: habitsWithStreak });
});

// Add new habit
router.post('/add', async (req, res) => {
  await Habit.create({ name: req.body.name });
  res.redirect('/');
});

// Check off today's habit
router.post('/check/:id', async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  const today = new Date().toDateString();

  const alreadyLogged = habit.log.some(date => new Date(date).toDateString() === today);
  if (!alreadyLogged) {
    habit.log.push(new Date());
    await habit.save();
  }

  res.redirect('/');
});

// Delete a habit
router.post('/delete/:id', async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Helper: Calculate streak
function calculateStreak(log) {
  let streak = 0;
  const today = new Date();
  const logDates = log.map(d => new Date(d).toDateString());

  for (let i = 0; ; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);
    if (logDates.includes(checkDate.toDateString())) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

module.exports = router;
