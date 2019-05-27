const Tom = require('test-runner').Tom
const a = require('assert')
const fetch = require('node-fetch')
const Lws = require('lws')
const BasicAuth = require('./')

const tom = module.exports = new Tom('basic-auth')

tom.test('no config', async function () {
  const lws = new Lws()
  const port = 9000 + this.index
  class One {
    middleware () {
      return function (ctx, next) {
        ctx.body = 'one'
        next()
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ BasicAuth, One ]
  })
  const response = await fetch(`http://localhost:${port}/`)
  server.close()
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.strictEqual(body, 'one')
})

tom.test('username and password: unauthorised', async function () {
  const lws = new Lws()
  const port = 9000 + this.index
  class One {
    middleware () {
      return function (ctx, next) {
        ctx.body = 'one'
        next()
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ BasicAuth, One ],
    authUser: 'user',
    authPass: 'password'
  })
  const response = await fetch(`http://localhost:${port}/`)
  server.close()
  a.strictEqual(response.status, 401)
})

tom.test('username and password: authorised', async function () {
  const lws = new Lws()
  const port = 9000 + this.index
  class One {
    middleware () {
      return function (ctx, next) {
        ctx.body = 'one'
        next()
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ BasicAuth, One ],
    authUser: 'user',
    authPass: 'password'
  })
  const response = await fetch(`http://user:password@localhost:${port}/`)
  server.close()
  a.strictEqual(response.status, 200)
  const body = await response.text()
  a.strictEqual(body, 'one')
})
