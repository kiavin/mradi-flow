export default {
  async fetchAll() {
    return await fetch('/api/iam');
  },
  async create(data) {
    return await fetch('/api/iam', { method: 'POST', body: data });
  },
  async update(id, data) {
    return await fetch(`/api/iam/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    return await fetch(`/api/iam/${id}`, { method: 'DELETE' });
  }
};