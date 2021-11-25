const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		_id: ID
		username: String
		email: String
		bookCount: Int
		savedBooks: [Book]
	},

    type Book {
        bookId: Int
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input SaveBookInput {
        authors: [String!]!
        description: String!
        title: String!
        bookId: Int!
        image: String!
        link: String!
    }

    type Mutation {
        login(login: LoginInput): Auth
        addUser(signup: UserInput): Auth
        saveBook(book: SaveBookInput): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;
