import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';

// Generic CRUD-list hook backing each content tab in ContentManager. Talks
// directly to the database via the API — no local caching layer, so a
// failed save surfaces as a real error instead of a silent "saved!" lie.
export function useEntityList(entity, authToken) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/api/admin/${entity}`, { authToken });
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entity, authToken]);

  useEffect(() => {
    if (authToken) reload();
  }, [reload, authToken]);

  const save = useCallback(async (itemData) => {
    const isEdit = !!itemData.id;
    const url = isEdit ? `/api/admin/${entity}/${itemData.id}` : `/api/admin/${entity}`;
    await apiRequest(url, { method: isEdit ? 'PUT' : 'POST', authToken, body: itemData });
    await reload();
  }, [entity, authToken, reload]);

  const remove = useCallback(async (id) => {
    await apiRequest(`/api/admin/${entity}/${id}`, { method: 'DELETE', authToken });
    setItems(prev => prev.filter(item => String(item.id) !== String(id)));
  }, [entity, authToken]);

  return { items, loading, error, reload, save, remove };
}
