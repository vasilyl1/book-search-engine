import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($username: String!) {
    saveBook(username: $username) {
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
