import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

//import { getMe, deleteBook } from '../utils/API';
import { QUERY_USER } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
    const [userData, setUserData] = useState({}); // userData state
    const [savedBooksData, setBooksData] = useState([]);

    const [deleteBook, { error }] = useMutation(DELETE_BOOK); // use to delete book

    //const { loading, data } = useQuery(QUERY_USER, { variables: { username: Auth.getProfile().data.username } }); // query user to get saved books
    const [getMe, { data }] = useLazyQuery(QUERY_USER, { variables: { username: Auth.getProfile().data.username } });

    //setUserData(data);

    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;
    const dataLength = Object.keys(savedBooksData).length;

    useEffect(() => {
        const getSavedBooksData = async () => {
            try {
                const savedBooks = data.user?.savedBooks || [];
                setBooksData(savedBooks);
            } catch (err) {
                console.log(err);
            }
        }
        getSavedBooksData();
    }, [dataLength]);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = Auth.loggedIn() ? Auth.getToken() : null;

                if (!token) {
                    return false;
                }

                //const response = await Auth.getProfile().data;
                const response = await getMe();

                if (!response) {
                    throw new Error('something went wrong!');
                }
                const user = response.user;
                setUserData(response);
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
    //if (loading) return <h2>LOADING...</h2>;
    if (!Auth.loggedIn)
        return (
            <h4>
                You need to be logged in to see this. Use the navigation links above to
                sign up or log in!
            </h4>
        );

    return (
        <>
            <div fluid className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {savedBooksData.length
                        ? `Viewing ${savedBooksData.length} saved ${savedBooksData.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {savedBooksData.map((book) => {
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
