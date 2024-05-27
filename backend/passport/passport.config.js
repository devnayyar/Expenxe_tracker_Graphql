import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";

// Authentication service responsible for configuring Passport
class AuthService {
    constructor() {
        this.initialize();
    }

    initialize() {
        passport.serializeUser((user, done) => {
            console.log("Serializing user");
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            console.log("Deserializing user");
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (err) {
                done(err);
            }
        });

        passport.use(
            new LocalStrategy(async (username, password, done) => {
                try {
                    const user = await User.findOne({ username });
                    if (!user) {
                        return done(null, false, { message: "Invalid username or password" });
                    }
                    const validPassword = await bcrypt.compare(password, user.password);
                    if (!validPassword) {
                        return done(null, false, { message: "Invalid username or password" });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            })
        );
    }
}

export default AuthService;
