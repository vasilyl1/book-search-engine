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

    const { loading, data } = useQuery(QUERY_USER, { variables: { username: Auth.getProfile().data.username } }); // query user to get saved books

    useEffect(() => {
        const getSavedBooksData = async () => {
            try {
                    const savedBooks = data.user?.savedBooks || []; // get the savedbooks array data from usequery
                    setBooksData(savedBooks); // update the state
            } catch (err) {
                console.log(err);
            }
        }
        getSavedBooksData();
    });

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        try {
            const { data } = await deleteBook({
                variables: {
                    username: Auth.getProfile().data.username,
                    bookId: bookId
                },
            });
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
            window.location.reload();
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
