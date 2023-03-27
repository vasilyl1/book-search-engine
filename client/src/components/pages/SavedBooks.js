import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

//import { getMe, deleteBook } from '../utils/API';
import { QUERY_USER } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
    const [userData, setUserData] = useState({}); // userData state
    const { loading, data } = useQuery(QUERY_USER, { variables: { username: Auth.getProfile().data.username } }); // query user to get saved books

    const usData = data?.savedBooks || {};

    const [deleteBook, { error }] = useMutation(DELETE_BOOK); // use to delete book

    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;

    useEffect(() => {
        const getUserData = async () => {
            try {

                const token = Auth.loggedIn() ? Auth.getToken() : null;
                if (!token) return false; // no token or expired
                if (!data) throw new Error("Could not get current user profile from DB");

                setUserData(data); // save user data to the state
            } catch (err) {
                console.error(err);
            }
        };

        getUserData();

    }, [userDataLength]); // this will ensure useEffect to run if there is user data

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {

        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) return false;
        const user = Auth.getProfile().data; // get current logged in user profile

        try {
            const { data } = await deleteBook({
                variables: {
                    username: user.data.username,
                    bookId: bookId
                },
            });

            if (!data) {
                throw new Error('Could not delete the book!');
            }

            //const updatedUser = await data.json();
            setUserData(data);
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    // if data isn't here yet, say so
    if (!userDataLength) return <h2>LOADING...</h2>;
    if (!Auth.loggedIn) {
        return (
          <h4>
            You need to be logged in to see this. Use the navigation links above to
            sign up or log in!
          </h4>
        );
      }

    return (
        <>
            <div fluid className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {usData.data.savedBooks.length
                        ? `Viewing ${usData.data.savedBooks.length} saved ${usData.data.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {usData.data.savedBooks.map((book) => {
                        return (
                            <Col md="4">
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
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;
