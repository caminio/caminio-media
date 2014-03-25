/*
 * caminio-media
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */

 
module.exports = function Mediafile( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;
  var Mixed = mongoose.Schema.Types.Mixed;

  var schema = new mongoose.Schema({

    /**
     * @property name
     * @type String
     */
    name: { type: String, public: true, required: true },

    /**
     * the path relative to the domain content/public/files folder
     *
     * @property relativePath
     * @type String
     */
    path: { type: String, public: true },

    preferences: { type: Mixed, default: {}, public: true },

    /**
     * @property size
     * @type Integer
     */
    size: { type: Number, public: true },

    /**
     * @property contentType
     * @type String
     */
    contentType: { type: String, public: true },

    /**
     * @property description
     * @type String
     */
    description: { type: String, public: true },

    /**
     * @property copyright
     * @type String
     */
    copyright: { type: String, public: true },

    /**
     * @property thumbnails
     * @type Array
     */
    thumbnails: { type: Array, public: true },

    /**
     * @property isPublic
     * @type Boolean
     */
    isPublic: { type: Boolean, default: true, public: true },

    /**
     * @property isPublic
     * @type Boolean
     */
    userAccess: { type: [ObjectId], ref: 'User', public: true },
    
    /**
     * @property parent
     * @type ObjectId
     */
    parent: { type: ObjectId, public: true },

    /**
     * @property camDomain
     * @type ObjectId
     * Can be a webpage, a contact, a shopitem
     */
    camDomain: { type: ObjectId, ref: 'Domain' },
    
    /**
     * @property createdAt
     * @type Date
     */
    createdAt: { type: Date, default: Date.now, public: true },

    /**
     * @property createdBy
     * @type ObjectId
     */
    createdBy: { type: ObjectId, ref: 'User', public: true },

    /**
     * @property updatedAt
     * @type Date
     */
    updatedAt: { type: Date, default: Date.now, public: true },

    /**
     * @property updatedBy
     * @type ObjectId
     */
    updatedBy: { type: ObjectId, ref: 'User', public: true }

  });
  
  return schema;

};