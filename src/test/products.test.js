import { expect } from 'chai';
import { describe, it, after, before } from 'mocha';
import request from 'supertest';
import { connectDB, disconnectDB } from './setup.js';
import mongoose from 'mongoose';
import app from '../app.js';

describe('Products API', () => {
  let productId;
  let authCookie;

  before(async () => {
    await connectDB();
    const res = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'kauff@test.com',
        password: '123'
      });

    authCookie = res.headers['set-cookie'][0]; 
  });

  after(async () => {
    await mongoose.connection.collection("products").deleteMany({ category: "Test Category" });
    await disconnectDB();
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products/').set('Cookie', authCookie);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an('array');
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products/addProduct')
      .set('Cookie', authCookie)
      .send({
        name: 'Test Product',
        price: 10.99,
        description: 'This is a test product',
        category: 'Test Category',
        stock: 100
      });

    expect(res.status).to.equal(201);
    expect(res.body.payload).to.have.property('_id');
    productId = res.body.payload._id;
  });

  it('should get a product by ID', async () => {
    const res = await request(app).get(`/api/products/${productId}`).set('Cookie', authCookie);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property('_id');
    expect(res.body.payload.name).to.equal('Test Product');
  });

  it('should update a product by ID', async () => {
    const res = await request(app).put(`/api/products/${productId}`).set('Cookie', authCookie).send({ price: 12.99 });
    expect(res.status).to.equal(200);
    expect(res.body.payload.price).to.equal(12.99);
  });

  it('should delete a product by ID', async () => {
    const res = await request(app).delete(`/api/products/${productId}`).set('Cookie', authCookie);
    expect(res.status).to.equal(200);
  });
});
