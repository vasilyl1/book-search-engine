const { User } = require('./../models/User');
const { signToken } = require('./../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, params) => {
            return await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        },
    },
    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
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
        saveBook: async (parent, { user, body }) => {
            return await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { saveBooks: body } },
                { new: true, runValidators: true }
            );
        },
        deleteBook: async (parent, { user, params }) => {
            return await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { saveBooks: { bookId: params.bookId } } },
                { new: true }
            );
        },
    },
};

module.exports = resolvers;