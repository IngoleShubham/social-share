import userModel from '../models/userSchema.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;
// import User from '../models/userModel.js'

const functions = {
    signup: async (req, res) => {
        try {
            const { username, password } = req.body;
            // console.log(req.body)
            if (!username || !password)
                return res.status(200).send({
                    code: 400,
                    message: 'enter the all fields',
                    success: false,
                });
            const exists = await userModel.findOne({ username: username });
            if (exists)
                return res.status(200).send({
                    code: 400,
                    message: 'User is already exists please try to login',
                    success: true,
                });

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const User = new userModel({
                username,
                password: hashedPassword,
            });
            // console.log(User)
            await User.save();
            if (!User) {
                return res.status(200).send({
                    code: 400,
                    message: 'User not created',
                    success: false,
                });
            } else {
                return res.status(200).send({
                    code: 201,
                    message: `User ${User.username} created successfully`,
                    success: true,
                });
            }
        } catch (error) {
            // console.log(error);
            return res.status(500).send({
                code: 500,
                message: 'Internal Server Error',
                success: false,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { username, email } = req.body;
            const userInput = username || email;
            const password = req.body.password;
            if (!userInput || !password) {
                res.json({
                    message: 'Username or email and password are required.',
                });
            }
            const exists = await userModel.findOne({
                $or: [{ username: userInput }, { email: userInput }],
            });
            if (!exists) return res.json({ message: 'please try to signup' });

            const passwordMatch = await bcrypt.compare(
                password,
                exists.password
            );
            if (!passwordMatch) {
                return res.json({ message: 'Incorrect password.' });
            }
            return res.json({ message: 'logged in' });
        } catch (error) {
            res.status(500).send({
                code: 500,
                message: 'Internal Server Error',
                success: false,
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await userModel
                .findOne({ username: username })
                .populate('theme')
                .exec();
            if (user) {
                res.status(200).send({
                    code: 200,
                    message: 'User details getting successfully',
                    docs: user,
                    success: true,
                });
            } else {
                res.status(400).send({
                    code: 400,
                    message: 'There is no user',
                    success: false,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                code: 500,
                message: 'Internal Server Error',
                success: false,
            });
        }
    },

    checkUserName: async (req, res) => {
        try {
            const data = await userModel
                .findOne({ username: req.params.username })
                .lean();
            // console.log(data);
            if (!data) {
                // console.log('not data');
                res.status(200).send({
                    code: 200,
                    message: 'Username is available',
                    success: true,
                });
            } else {
                console.log('data');
                res.status(200).send({
                    code: 400,
                    message: 'Username is already taken',
                    success: false,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                code: 500,
                message: 'Internal Server Error',
                success: false,
            });
        }
    },
};

export default functions;
