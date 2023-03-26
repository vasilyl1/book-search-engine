const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { username }) => {
            return await User.findOne({ username });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { user, book }) => {
            if (!user)
                return await User.findOneAndUpdate(
                    { username: user.name },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                );
            throw new AuthenticationError('You need to be logged in!');
        },
        deleteBook: async (parent, { user, bookId }) => {
            if (!user)
                return await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params } } },
                    { new: true }
                );
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;