'use strict';

/**
 * Nois.js controller
 *
 * @description: A set of functions called "actions" for managing `Nois`.
 */

module.exports = {

  /**
   * Retrieve nois records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {

      return strapi.services.nois.search(ctx.query);
    } else {
      console.log(ctx.query, '------ctx');
      return strapi.services.nois.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a nois record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.nois.fetch(ctx.params);
  },

  /**
   * Count nois records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.nois.count(ctx.query);
  },

  /**
   * Create a/an nois record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.nois.add(ctx.request.body);
  },

  /**
   * Update a/an nois record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.nois.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an nois record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.nois.remove(ctx.params);
  },

  /**
   * Add relation to a/an nois record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.nois.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an nois record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.nois.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an nois record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.nois.removeRelation(ctx.params, ctx.request.body);
  }
};
