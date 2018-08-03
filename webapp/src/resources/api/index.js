class API {
  constructor({ url }) {
    this.url = url;
    this.endpoints = {};
  }

  createEntity(entity) {
    this.endpoints[entity.name] = this.createEndpoints(entity);
  }

  createEntities(arrayOfEntity) {
    arrayOfEntity.forEach(this.createEntity.bind(this));
  }

  createEndpoints({ name }) {
    const endpoints = {};
    const resourceURL = `${this.url}/${name}`;

    endpoints.getAll = ({ query } = {}) => fetch(resourceURL, { params: { query } });
    endpoints.getOne = ({ id }) => fetch(`${resourceURL}/${id}`);
    endpoints.create = body => fetch(`${resourceURL}`, {
      method: 'POST',
      body,
    });
    endpoints.update = body => fetch(`${resourceURL}/${body.id}`, {
      method: 'PUT',
      body,
    });
    endpoints.delete = ({ id }) => fetch(`${resourceURL}/${id}`, {
      method: 'DELETE',
    });

    return endpoints;
  }
}

export default API;
