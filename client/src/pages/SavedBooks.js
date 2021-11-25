import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';


//* IMPORTS
// import { useMutation, useQuery } from '@apollo/client';
// import { useParams } from 'react-router-dom';
// import { GET_ME } from '../utils/queries';
// import { REMOVE_BOOK } from '../../utils/mutations';


import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  //* bring in params, and GET_ME and useQuery
  // // Use `useParams()` to retrieve value of the route parameter `:profileId`
  // const { id: id } = useParams();

  // const { loading, data } = useQuery(GET_ME, {
  //   // pass URL parameter
  //   variables: { _id: id },
  // });

  // const me = data?.me || {};

  const [userData, setUserData] = useState({});

  //* bring in REMOVE_BOOK and useMutation
  // const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
  //   update(cache, { data: { removeBook }
  //   }) {
  //     try {
  //       cache.writeQuery({
  //         query: GET_ME,
  //         data: {
  //           me: removeBook
  //         }
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  // });


  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {

    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!me?._id) {
  //   return (
  //     <h4>
  //       You need to be logged in to see this. Use the navigation links above to
  //       sign up or log in!
  //     </h4>
  //   );
  // }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
      {/* {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )} */}
    </>
  );
};

export default SavedBooks;
