const BUILD_PATH = '../build'

const fs = require('fs')
const path = require('path')

for (const lang of getLanguages()) {
  validMessages(getMessages(lang))
}

function getLanguages() {
  return fs.readdirSync(getPathRelatedLocales())
}

function validMessages(messages) {
  const keys = Object.keys(messages)
  for (const key of keys) {
    if (!validKeyName(key)) fail(`The name "${key}" is invalid.`)
  }
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function validKeyName(name) {
  return /^[a-zA-Z0-9_@]+$/.test(name)
}

function getMessages(language) {
  const messages = require(getPathRelatedLocales(language, 'messages.json'))
  return messages
}

function getPathRelatedLocales(...paths) {
  return getPathRelatedBuild('_locales', ...paths)
}

function getPathRelatedBuild(...paths) {
  return path.join(__dirname, BUILD_PATH, ...paths)
}
