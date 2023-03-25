import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($email: String!) {
    saveBook(email: $email) {
        savedBooks.bookId
        savedBooks.authors
        savedBooks.title
        savedBooks.description
        savedBooks.image
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: String! ) {
    deleteBook(bookId: $tbookId) {

    }
  }
`;
