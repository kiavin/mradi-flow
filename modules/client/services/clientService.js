export default {
  async fetchAll() {
    return await fetch('/api/client');
  },
  async create(data) {
    return await fetch('/api/client', { method: 'POST', body: data });
  },
  async update(id, data) {
    return await fetch(`/api/client/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    return await fetch(`/api/client/${id}`, { method: 'DELETE' });
  }
};