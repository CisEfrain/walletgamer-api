const request = require('supertest')
const server = require('../app')

/* eslint-disable no-undef */

describe('Endpoint Test', () => {
  it('Mensaje ok', async () => {
      const res = await request(server)
      .get('/live/')
      expect(res.status).toEqual(200)
      expect(res.body).toEqual({"msg" : "Ok"})
    })
  })