const mongoose =require('mongoose');
const bcrtpy = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { 
    type: String, 
    required: true
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies'
  }],
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ratings'
  }],
  list: [
    {
      id: {
        type: Number
      },
      name: {
        type: String,
        unique: true,
        required: true
      },
      title: {
        type: String,
      },
      tvs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TVs',
      }]
    }
  ]
});

const passwordValidator = (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,300}$/.test(value)
}

UserSchema.pre('validate', function(next) {
  if (! passwordValidator(this.password)) {
    return next(new Error('Invalid password'));
  } else {
    return next();
  }
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrtpy.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrtpy.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const data = this.getUpdate()
  if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(data.password)) {
    return next({message: 'Invalid password'})
  }
  if (data.password) {
    bcrtpy.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrtpy.hash(data.password, salt, null, (err, hash) => {
        if (err) {
          return next(err)
        }
        data.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrtpy.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);