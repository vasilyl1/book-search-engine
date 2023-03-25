const { User } = require('./../models/User');
const { signToken } = require('./../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, user) => {
            return User.findOne({
                $or: [{ _id: user._id ? user._id : user._id }, { username: user.username }, { email: user.email }],
             });
        },
    },
    Mutation: {
        addUser: async (parent, { body }) => {
            const user = await User.create({username: body.username, email: body.email, password: body.password});
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, { body } ) => {
            const user = await User.findOne({
                $or: [{ username: body.username }, { email: body.email }] });
      
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
        saveBook: async (parent, { bookData }, context) => {
            if (context.user)         
                return await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $addToSet: { savedBooks: bookData } }
                );
              throw new AuthenticationError('You need to be logged in!');
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user)
            return await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;