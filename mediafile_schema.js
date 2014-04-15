module.exports = function MediafileSchema( caminio, mongoose ){

  var Mixed = mongoose.Schema.Types.Mixed;

  var schema = new mongoose.Schema({

    name: { type: String, public: true, required: true },
    path: { type: String, public: true },
    preferences: { type: Mixed, default: {}, public: true },
    size: { type: Number, public: true },
    contentType: { type: String, public: true },
    description: { type: String, public: true },
    copyright: { type: String, public: true },
    isPublic: { type: Boolean, default: true, public: true },
    
  });
  
  return schema;

};