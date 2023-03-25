import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($user: User!) {
    user(user: $user) {
      _id
      username
      email
      savedBooks {
        _id 
        thoughtText
        createdAt
      }   
    }
      }
`;
