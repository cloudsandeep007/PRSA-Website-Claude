import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app, { ensureReady } from '../index.js';

let superAdminToken;
let createdFaqId;

beforeAll(async () => {
  await ensureReady();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'superadmin@prsaroller.com', password: process.env.SEED_SUPER_ADMIN_PASSWORD });
  superAdminToken = res.body.token;
});

// Clean up even if an assertion fails partway through
afterAll(async () => {
  if (createdFaqId) {
    await request(app).delete(`/api/admin/faqs/${createdFaqId}`).set('Authorization', `Bearer ${superAdminToken}`);
  }
});

describe('Entity CRUD lifecycle (faqs, self-cleaning)', () => {
  it('creates, reads, updates, and deletes a FAQ', async () => {
    const createRes = await request(app)
      .post('/api/admin/faqs')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ question: '__test_question__', answer: '__test_answer__', category: 'Test', display_order: 999 });
    expect(createRes.status).toBe(200);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.id).toBeTruthy();
    createdFaqId = createRes.body.id;

    const listRes = await request(app).get('/api/admin/faqs').set('Authorization', `Bearer ${superAdminToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some(f => f.id === createdFaqId)).toBe(true);

    const updateRes = await request(app)
      .put(`/api/admin/faqs/${createdFaqId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ question: '__test_question_updated__', answer: '__test_answer__', category: 'Test', display_order: 999, is_published: true });
    expect(updateRes.status).toBe(200);

    const afterUpdate = await request(app).get('/api/admin/faqs').set('Authorization', `Bearer ${superAdminToken}`);
    const updated = afterUpdate.body.find(f => f.id === createdFaqId);
    expect(updated.question).toBe('__test_question_updated__');

    const deleteRes = await request(app).delete(`/api/admin/faqs/${createdFaqId}`).set('Authorization', `Bearer ${superAdminToken}`);
    expect(deleteRes.status).toBe(200);
    createdFaqId = null;

    const afterDelete = await request(app).get('/api/admin/faqs').set('Authorization', `Bearer ${superAdminToken}`);
    expect(afterDelete.body.some(f => f.question === '__test_question_updated__')).toBe(false);
  });
});

describe('Public trial-booking and contact-enquiry validation', () => {
  it('rejects a trial booking missing required fields', async () => {
    const res = await request(app).post('/api/trial-bookings').send({ athlete_name: 'Test Kid' });
    expect(res.status).toBe(400);
  });

  it('rejects a contact enquiry missing required fields', async () => {
    const res = await request(app).post('/api/contact-enquiries').send({ name: 'Test' });
    expect(res.status).toBe(400);
  });
});
