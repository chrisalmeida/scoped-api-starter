const express = require('express'),
  router = express.Router(),
  { USERS_READ } = require('../scopes')

/* List all users */
router.get('/', USERS_READ, (req, res, next) => {
  res.json({
    users: []
  })
})

module.exports = router
