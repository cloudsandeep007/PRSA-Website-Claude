import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app, { ensureReady } from '../index.js';

let superAdminToken;
let clientAdminToken;

beforeAll(async () => {
  await ensureReady();

  const superRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'superadmin@prsaroller.com', password: process.env.SEED_SUPER_ADMIN_PASSWORD });
  superAdminToken = superRes.body.token;

  const clientRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'client@prsaroller.com', password: process.env.SEED_CLIENT_ADMIN_PASSWORD });
  clientAdminToken = clientRes.body.token;
});

describe('Role enforcement', () => {
  it('allows Client Admin to read leads', async () => {
    const res = await request(app).get('/api/admin/trial-bookings').set('Authorization', `Bearer ${clientAdminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('allows Client Admin to read contact enquiries', async () => {
    const res = await request(app).get('/api/admin/contact-enquiries').set('Authorization', `Bearer ${clientAdminToken}`);
    expect(res.status).toBe(200);
  });

  it('blocks Client Admin from Super-Admin-only content routes', async () => {
    const res = await request(app).get('/api/admin/programs').set('Authorization', `Bearer ${clientAdminToken}`);
    expect(res.status).toBe(403);
  });

  it('blocks Client Admin from the developer diagnostics route', async () => {
    const res = await request(app).get('/api/admin/developer/status').set('Authorization', `Bearer ${clientAdminToken}`);
    expect(res.status).toBe(403);
  });

  it('blocks Client Admin from the database backup route', async () => {
    const res = await request(app).get('/api/admin/backup').set('Authorization', `Bearer ${clientAdminToken}`);
    expect(res.status).toBe(403);
  });

  it('allows Super Admin to reach Super-Admin-only routes', async () => {
    const res = await request(app).get('/api/admin/developer/status').set('Authorization', `Bearer ${superAdminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('allows Super Admin to also read leads', async () => {
    const res = await request(app).get('/api/admin/trial-bookings').set('Authorization', `Bearer ${superAdminToken}`);
    expect(res.status).toBe(200);
  });
});
