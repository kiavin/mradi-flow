export default {
  async fetchAll() {
    return await fetch('/api/project');
  },
  async create(data) {
    return await fetch('/api/project', { method: 'POST', body: data });
  },
  async update(id, data) {
    return await fetch(`/api/project/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    return await fetch(`/api/project/${id}`, { method: 'DELETE' });
  }
};