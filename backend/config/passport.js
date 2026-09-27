require('dotenv').config(); // must run before reading process.env
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        // 1. Already registered with Google
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Email already exists (registered manually) → link Google account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        // 3. Brand new user — create account (no password needed)
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          avatar,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize / deserialize for session-based OAuth dance
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
