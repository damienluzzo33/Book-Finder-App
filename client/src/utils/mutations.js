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
		addUser( 
            signup: {
                username: $username, email: $email, password: $password
            }) 
            {
                token
                user {
                    _id
                    username
                }
            }
    }
`;

export const ADD_BOOK = gql`
	mutation saveBook(
		$authors: [String!]!,
		$description: String!,
		$title: String!,
		$bookId: Int!,
		$image: String!,
		$link: String!
	) {
		saveBook(
			book: {
				authors: $authors
				description: $description
				title: $title
				bookId: $bookId
				image: $image
				link: $link
			}
		) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`;

