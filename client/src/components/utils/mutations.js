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
  mutation saveBook($user: User!, $book: Book!) {
    saveBook(user: $user, book: $book) {
        savedBooks.bookId : book.bookId
        savedBooks.authors : book.authors
        savedBooks.title : book.title
        savedBooks.description : book.description
        savedBooks.image : book.image
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($user: User!, $bookId: String! ) {
    deleteBook(user: $user, bookId: $bookId) {

    }
  }
`;
