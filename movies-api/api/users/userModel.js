import mongoose from 'mongoose';
import bcrtpy from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { 
    type: String, 
    required: [true, 'User password required'] 
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies'
  }]
});

const passwordValidator = (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)
}

UserSchema.path('password').validate(passwordValidator, 'Invalid password')

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

export default mongoose.model('User', UserSchema);