'use strict';

/**
 * Studentfiles.js controller
 *
 * @description: A set of functions called "actions" for managing `Studentfiles`.
 */

module.exports = {

  /**
   * Retrieve studentfiles records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.studentfiles.search(ctx.query);
    } else {
      return strapi.services.studentfiles.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a studentfiles record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.studentfiles.fetch(ctx.params);
  },

  /**
   * Count studentfiles records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.studentfiles.count(ctx.query);
  },

  /**
   * Create a/an studentfiles record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.studentfiles.add(ctx.request.body);
  },

  /**
   * Update a/an studentfiles record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.studentfiles.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an studentfiles record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.studentfiles.remove(ctx.params);
  },

  /**
   * Add relation to a/an studentfiles record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.studentfiles.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an studentfiles record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.studentfiles.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an studentfiles record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.studentfiles.removeRelation(ctx.params, ctx.request.body);
  }
};
