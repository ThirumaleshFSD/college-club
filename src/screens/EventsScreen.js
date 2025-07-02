import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { listEvents } from '../actions/eventActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import EventCard from '../components/EventCard';
import '../screens/EventsScreen.css';

const EventsScreen = () => {
  const dispatch = useDispatch();

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listEvents());
  }, [dispatch]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events?.filter(event => new Date(event.date) > now);
  const pastEvents = events?.filter(event => new Date(event.date) <= now);

  return (
    <Container className="events-screen">
      <Meta title="Events | College Clubs" />
      
      <div className="events-header">
        <h1>College Events</h1>
        <p>Discover and join exciting events hosted by our clubs</p>
        {userInfo?.role === 'club_admin' && (
          <Button as="a" href="/create-event" variant="primary">
            Create Event
          </Button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <section className="upcoming-events">
            <h2 className="section-title">Upcoming Events</h2>
            {upcomingEvents?.length === 0 ? (
              <Message>No upcoming events scheduled.</Message>
            ) : (
              <Row>
                {upcomingEvents?.map((event) => (
                  <Col key={event._id} sm={12} md={6} lg={4} className="mb-4">
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>
            )}
          </section>

          <section className="past-events">
            <h2 className="section-title">Past Events</h2>
            {pastEvents?.length === 0 ? (
              <Message>No past events to display.</Message>
            ) : (
              <Row>
                {pastEvents?.map((event) => (
                  <Col key={event._id} sm={12} md={6} lg={4} className="mb-4">
                    <EventCard event={event} isPast />
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </>
      )}
    </Container>
  );
};

export default EventsScreen;