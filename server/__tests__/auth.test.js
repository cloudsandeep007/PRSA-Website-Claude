import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app, { ensureReady } from '../index.js';

beforeAll(async () => {
  await ensureReady();
});

describe('POST /api/auth/login', () => {
  it('rejects an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@prsaroller.com', password: 'whatever' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeTruthy();
  });

  it('rejects a wrong password for a real account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@prsaroller.com', password: 'definitely-wrong' });
    expect(res.status).toBe(401);
  });

  it('rejects a missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@prsaroller.com' });
    expect(res.status).toBe(400);
  });

  it('logs in the Super Admin account and returns a usable token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@prsaroller.com', password: process.env.SEED_SUPER_ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe('Super Admin');

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${res.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('superadmin@prsaroller.com');
  });

  it('logs in the Client Admin account with the correct role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'client@prsaroller.com', password: process.env.SEED_CLIENT_ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('Client Admin');
  });
});

describe('Protected routes without a token', () => {
  it('rejects a protected leads route', async () => {
    const res = await request(app).get('/api/admin/trial-bookings');
    expect(res.status).toBe(401);
  });

  it('rejects a garbage token', async () => {
    const res = await request(app).get('/api/admin/trial-bookings').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(403);
  });
});
