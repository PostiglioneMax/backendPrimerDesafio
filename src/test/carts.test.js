import { expect } from 'chai';
import { describe, it, after, before } from 'mocha';
import request from 'supertest';
import { connectDB, disconnectDB } from './setup.js';
import mongoose from 'mongoose';
import app from '../app.js';

describe('Carts API', () => {
  let cartId;
  let productId;
  let authCookie;

  before(async () => {
    await connectDB();
    
    const loginRes = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'kauff@test.com',
        password: '123'
      });
    
    authCookie = loginRes.headers['set-cookie'][0];

    const res = await request(app)
      .post('/api/products/addProduct')
      .set('Cookie', authCookie)
      .send({
        name: 'Test Product for Cart',
        price: 15.99,
        description: 'This is a test product for cart',
        category: 'Test Category',
        stock: 100
      });
    
    productId = res.body.payload._id;
    console.log(productId)
  });

  after(async () => {
    await mongoose.connection.collection("carts").deleteMany({});
    await mongoose.connection.collection("products").deleteMany({ category: "Test Category" });
    await disconnectDB();
  });

  it('should create a new cart', async () => {
    const res = await request(app).get('/api/cart/0').set('Cookie', authCookie);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property('_id');
    cartId = res.body.payload._id;
  });

  it('should add a product to the cart', async () => {
    const res = await request(app).post(`/api/cart/${cartId}/add`).set('Cookie', authCookie).send({ productId, quantity: 2 });
    expect(res.status).to.equal(201);
  });

  it('should get the cart by ID', async () => {
    const res = await request(app).get(`/api/cart/${cartId}`).set('Cookie', authCookie);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property('products');
    expect(res.body.payload.products[0].productId).to.equal(productId);
  });

  it('should update product quantity in the cart', async () => {
    const res = await request(app).put(`/api/cart/${cartId}/${productId}/quantity`).set('Cookie', authCookie).send({ quantity: 5 });
    expect(res.status).to.equal(200);
  });

  it('should delete a product from the cart', async () => {
    const res = await request(app).delete(`/api/cart/${cartId}/${productId}`).set('Cookie', authCookie);
    expect(res.status).to.equal(200);
  });

  it('should delete all products from the cart', async () => {
    const res = await request(app).delete(`/api/cart/${cartId}`).set('Cookie', authCookie);
    expect(res.status).to.equal(200);
  });
});
