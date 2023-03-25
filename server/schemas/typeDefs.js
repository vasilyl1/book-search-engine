const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    saveBooks: [Book]
  }

  type Book {
    _id: ID
    authors: String
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    users: [User]
    user(email: String!): User
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    saveBook( authors: String,
        description: String!,
        bookId: String!,
        image: String,
        link: String,
        title: String!): Book
    deleteBook(bookId: String!): Book
  }
`;

module.exports = typeDefs;
