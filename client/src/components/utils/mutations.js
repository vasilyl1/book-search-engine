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
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
        password
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($username: String!) {
    saveBook(username: $username, book: $Book) {
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
          }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($username: String!, $bookId: String!) {
    deleteBook(username: $username, bookId: $bookId) {
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
          }
        
    }
  }
`;
