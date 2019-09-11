const withScope = require('express-jwt-authz')

const BASE_OPTIONS = { checkAllScopes: true, failWithError: true }

const SCOPES = {
  users: {
    read: 'users:read',
    write: 'users:write'
  }
}

const USERS_READ = withScope([SCOPES.users.read], BASE_OPTIONS)

module.exports = { USERS_READ }
