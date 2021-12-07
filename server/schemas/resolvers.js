const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }).populate("savedBooks");
			}
			throw new AuthenticationError('You need to be logged in to do that!');
		}
	},

	Mutation: {
		login: async (parent, args) => {
			const { email, password } = args.login;

			const foundUser = await User.findOne({ email });
			if (!foundUser) {
				throw new AuthenticationError('No user with that email address was found!');
			}

			const correctPassword = await foundUser.isCorrectPassword(password);
			if (!correctPassword) {
				throw new AuthenticationError('Incorrect credentials!');
			}

			const token = signToken(foundUser);
			return { token, foundUser };
		},
		// accepts (login AS email, password)
		// returns Auth

		addUser: async (parent, args) => {
			const { username, email, password } = args.signup;
			const newUser = await User.create({ username, email, password });

			const token = signToken(newUser);
			return { token, newUser };
		},
		// accepts (signup AS username, email, password)
		// returns Auth

		saveBook: async (parent, args, context) => {
			const { authors, description, title, bookId, image, link } = args.book;
			if (context.user) {
				await User.findOneAndUpdate(
					{ _id: context.user._id },
                    // { _id: userId },
					{
						$push: {
							savedBooks: {
								authors: authors,
								description: description,
                                title: title,
								bookId: bookId,
								image: image,
								link: link
							}
						}
					},
					{ new: true }
				);
			}
			throw new AuthenticationError('You need to be logged in to do that!');
		},
		// accepts (book AS authors, description, title, bookId, image, link)
		// returns User

		removeBook: async (parent, args, context, info) => {
			const { bookId } = args;
			if (context.user) {
				return await User.findOneAndUpdate(
					{ _id: context.user.id },
					{ $pull: { savedBooks: { bookId: bookId } } },
					{ new: true }
				);
			}
			throw new AuthenticationError('Could not find User!');
		}
		// accepts (bookId: ID!)
		// returns User
	}
};

module.exports = resolvers;
