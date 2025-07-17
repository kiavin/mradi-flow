export default {
  async fetchAll() {
    return await fetch('/api/admin');
  },
  async create(data) {
    return await fetch('/api/admin', { method: 'POST', body: data });
  },
  async update(id, data) {
    return await fetch(`/api/admin/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    return await fetch(`/api/admin/${id}`, { method: 'DELETE' });
  }
};