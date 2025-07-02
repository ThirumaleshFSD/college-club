import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Carousel, Card, Button } from 'react-bootstrap';
import { listClubs } from '../actions/clubActions';
import { listEvents } from '../actions/eventActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import '../screens/HomeScreen.css';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const clubList = useSelector((state) => state.clubList);
  const { loading: loadingClubs, error: errorClubs, clubs } = clubList;

  const eventList = useSelector((state) => state.eventList);
  const { loading: loadingEvents, error: errorEvents, events } = eventList;

  useEffect(() => {
    dispatch(listClubs());
    dispatch(listEvents());
  }, [dispatch]);

  return (
    <>
      <Meta title="Welcome to College Clubs" />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Connect, Collaborate, Create</h1>
          <p>
            Join your college's vibrant community of clubs and organizations. 
            Discover events, meet new people, and pursue your passions.
          </p>
          <div className="hero-btns">
            <Button as={Link} to="/clubs" variant="primary" size="lg">
              Explore Clubs
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg">
              Join Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Featured Clubs</h2>
          {loadingClubs ? (
            <Loader />
          ) : errorClubs ? (
            <Message variant="danger">{errorClubs}</Message>
          ) : (
            <Row>
              {clubs.slice(0, 4).map((club) => (
                <Col key={club._id} sm={12} md={6} lg={3} className="mb-4">
                  <Card className="h-100 club-card">
                    <Card.Img variant="top" src={club.image} className="club-card-img" />
                    <Card.Body>
                      <Card.Title>{club.name}</Card.Title>
                      <Card.Text className="text-muted">
                        {club.description.substring(0, 100)}...
                      </Card.Text>
                      <Button as={Link} to={`/clubs/${club._id}`} variant="primary">
                        View Club
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <div className="text-center mt-4">
            <Button as={Link} to="/clubs" variant="outline-primary">
              View All Clubs
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Upcoming Events</h2>
          {loadingEvents ? (
            <Loader />
          ) : errorEvents ? (
            <Message variant="danger">{errorEvents}</Message>
          ) : (
            <Carousel indicators={false} interval={3000} pause="hover">
              {events.slice(0, 3).map((event) => (
                <Carousel.Item key={event._id}>
                  <div className="event-slide">
                    <img className="d-block w-100" src={event.image} alt={event.title} />
                    <Carousel.Caption>
                      <h3>{event.title}</h3>
                      <p>{event.club.name} • {new Date(event.date).toLocaleDateString()}</p>
                      <Button as={Link} to={`/events/${event._id}`} variant="light">
                        Event Details
                      </Button>
                    </Carousel.Caption>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card text-center p-4">
                <i className="fas fa-users fa-3x mb-3 text-primary"></i>
                <h3>Join Clubs</h3>
                <p>
                  Discover and join clubs that match your interests. Connect with like-minded students.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card text-center p-4">
                <i className="fas fa-calendar-alt fa-3x mb-3 text-primary"></i>
                <h3>Attend Events</h3>
                <p>
                  Never miss out on exciting events. RSVP and get reminders for upcoming activities.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card text-center p-4">
                <i className="fas fa-bullhorn fa-3x mb-3 text-primary"></i>
                <h3>Lead & Organize</h3>
                <p>
                  Club admins can manage members, post events, and grow their community.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default HomeScreen;