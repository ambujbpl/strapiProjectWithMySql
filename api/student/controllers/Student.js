'use strict';

/**
 * Student.js controller
 *
 * @description: A set of functions called "actions" for managing `Student`.
 */

module.exports = {

  /**
   * Retrieve student records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.student.search(ctx.query);
    } else {
      return strapi.services.student.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a student record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.student.fetch(ctx.params);
  },

  /**
   * Count student records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.student.count(ctx.query);
  },

  /**
   * Create a/an student record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.student.add(ctx.request.body);
  },

  /**
   * Update a/an student record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.student.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an student record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.student.remove(ctx.params);
  },

  /**
   * Add relation to a/an student record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.student.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an student record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.student.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an student record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.student.removeRelation(ctx.params, ctx.request.body);
  }
};
