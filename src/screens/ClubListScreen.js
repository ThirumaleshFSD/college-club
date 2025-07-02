import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listClubs } from '../actions/clubActions';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ClubListScreen = () => {
  const dispatch = useDispatch();

  const clubList = useSelector((state) => state.clubList);
  const { loading, error, clubs } = clubList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listClubs());
  }, [dispatch]);

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Clubs</h1>
        </Col>
        {userInfo && userInfo.role === 'club_admin' && (
          <Col className="text-end">
            <Button as={Link} to="/create-club" variant="primary">
              Create Club
            </Button>
          </Col>
        )}
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {clubs.map((club) => (
            <Col key={club._id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3 rounded">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>{club.name}</strong>
                  </Card.Title>
                  <Card.Text as="div" className="my-3">
                    {club.description.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text as="div">
                    <strong>Members: </strong> {club.members.length}
                  </Card.Text>
                  <Link to={`/clubs/${club._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ClubListScreen;