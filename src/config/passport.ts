import passport from "passport";
import LocalStrategy from "passport-local";
import { checkUserExists } from "./../services/db"
import { verifyPassword } from "../services/encrypt"


passport.use(new LocalStrategy.Strategy({ usernameField: 'email' },
    async (email: any, password: any, done: any) => {

        try {
            const user: any = await checkUserExists(email);
            if (email === user.email && await verifyPassword(password, user.password)) {
                console.log("user", user)
                return done(null, { id: user.id, username: user.email });
            } else {
                return done(null, false, { message: 'Invalid username or password' });

            }
        } catch (e) {

            return done(null, false, { message: 'Invalid username or password' });

        }

    }
));


passport.serializeUser((user: any, done: any) => done(null, user.id));
passport.deserializeUser((id: any, done: any) => {
    const user = { id: 1, username: 'user' };
    done(null, user);
});

export const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send('Unauthorized');
};

export default passport