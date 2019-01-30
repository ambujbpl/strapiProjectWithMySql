'use strict';

/**
 * Dropdownlist.js controller
 *
 * @description: A set of functions called "actions" for managing `Dropdownlist`.
 */

module.exports = {

  /**
   * Retrieve dropdownlist records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.dropdownlist.search(ctx.query);
    } else {
      return strapi.services.dropdownlist.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a dropdownlist record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.dropdownlist.fetch(ctx.params);
  },

  /**
   * Count dropdownlist records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.dropdownlist.count(ctx.query);
  },

  /**
   * Create a/an dropdownlist record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.dropdownlist.add(ctx.request.body);
  },

  /**
   * Update a/an dropdownlist record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.dropdownlist.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an dropdownlist record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.dropdownlist.remove(ctx.params);
  },

  /**
   * Add relation to a/an dropdownlist record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.dropdownlist.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an dropdownlist record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.dropdownlist.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an dropdownlist record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.dropdownlist.removeRelation(ctx.params, ctx.request.body);
  }
};
