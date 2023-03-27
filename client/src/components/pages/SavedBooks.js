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

    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;

    const [deleteBook, { error }] = useMutation(DELETE_BOOK);

    useEffect(() => {
        const getUserData = async () => {
            try {

                const token = Auth.loggedIn() ? Auth.getToken() : null;
                if (!token) return false; // no token or expired

                const user = Auth.getProfile().data;

                setUserData(user); // save user data to the state
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

        try {
            const { data } = await deleteBook({
                variables: {
                    username: userData.username,
                    bookId: bookId
                },
            });

            if (!data) {
                throw new Error('Could not delete the book!');
            }

            const updatedUser = await data.json();
            setUserData(updatedUser);
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    // if data isn't here yet, say so
    if (!userDataLength) return <h2>LOADING...</h2>;

    return (
        <>
            <div fluid className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {userData.savedBooks.map((book) => {
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
