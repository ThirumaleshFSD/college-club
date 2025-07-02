import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  ListGroup, 
  Tab, 
  Tabs, 
  Modal, 
  Form,
  Alert,
  Badge
} from 'react-bootstrap';
import { 
  getClubDetails, 
  joinClub, 
  leaveClub,
  deleteClub
} from '../actions/clubActions';
import { listClubEvents } from '../actions/eventActions';
import { createEvent } from '../actions/eventActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import EventCard from '../components/EventCard';
import MemberCard from '../components/MemberCard';
import '../screens/ClubScreen.css';

const ClubScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const clubDetails = useSelector((state) => state.clubDetails);
  const { loading, error, club } = clubDetails;

  const clubJoin = useSelector((state) => state.clubJoin);
  const { 
    loading: loadingJoin, 
    error: errorJoin, 
    success: successJoin 
  } = clubJoin;

  const clubLeave = useSelector((state) => state.clubLeave);
  const { 
    loading: loadingLeave, 
    error: errorLeave, 
    success: successLeave 
  } = clubLeave;

  const eventCreate = useSelector((state) => state.eventCreate);
  const { 
    loading: loadingEventCreate, 
    error: errorEventCreate, 
    success: successEventCreate 
  } = eventCreate;

  const clubDelete = useSelector((state) => state.clubDelete);
  const { 
    loading: loadingDelete, 
    error: errorDelete, 
    success: successDelete 
  } = clubDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const isMember = userInfo && club?.members.some(member => member._id === userInfo._id);
  const isAdmin = userInfo && club?.admin._id === userInfo._id;

  useEffect(() => {
    dispatch(getClubDetails(id));
    dispatch(listClubEvents(id));
  }, [dispatch, id, successJoin, successLeave, successEventCreate]);

  useEffect(() => {
    if (successDelete) {
      navigate('/clubs');
    }
  }, [successDelete, navigate]);

  const joinHandler = () => {
    dispatch(joinClub(id));
  };

  const leaveHandler = () => {
    dispatch(leaveClub(id));
  };

  const submitEventHandler = (e) => {
    e.preventDefault();
    dispatch(createEvent({
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      location: eventLocation,
      club: id
    }));
    setShowEventModal(false);
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
  };

  const deleteHandler = () => {
    dispatch(deleteClub(id));
  };

  return (
    <>
      <Meta title={club?.name || 'Club Details'} />
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Club Header */}
          <div className="club-header">
            <img 
              src={club?.image || '/images/club-default.jpg'} 
              alt={club?.name} 
            />
            <div className="club-header-content">
              <h1 className="club-title">{club?.name}</h1>
              <div className="club-admin">
                <img 
                  src={club?.admin?.avatar || '/images/default-avatar.png'} 
                  alt={club?.admin?.name} 
                />
                <span>Admin: {club?.admin?.name}</span>
              </div>
              <Badge bg="light" text="dark" className="mb-2">
                {club?.members?.length} {club?.members?.length === 1 ? 'Member' : 'Members'}
              </Badge>
              <div className="club-actions">
                {userInfo ? (
                  isMember ? (
                    <Button 
                      variant="danger" 
                      onClick={leaveHandler}
                      disabled={loadingLeave}
                    >
                      {loadingLeave ? 'Leaving...' : 'Leave Club'}
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={joinHandler}
                      disabled={loadingJoin}
                    >
                      {loadingJoin ? 'Joining...' : 'Join Club'}
                    </Button>
                  )
                ) : (
                  <Button as={Link} to="/login" variant="primary">
                    Login to Join
                  </Button>
                )}
                {isAdmin && (
                  <>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowEventModal(true)}
                    >
                      Create Event
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Club
                    </Button>
                  </>
                )}
              </div>
              {errorJoin && <Alert variant="danger">{errorJoin}</Alert>}
              {errorLeave && <Alert variant="danger">{errorLeave}</Alert>}
            </div>
          </div>

          {/* Club Content */}
          <div className="container py-5">
            <Tabs defaultActiveKey="about" id="club-tabs" className="mb-4">
              <Tab eventKey="about" title="About">
                <Row>
                  <Col lg={8}>
                    <h2 className="club-section-title">Description</h2>
                    <p className="club-description">{club?.description}</p>
                    
                    <h2 className="club-section-title">Upcoming Events</h2>
                    {club?.events?.length === 0 ? (
                      <Message>No upcoming events scheduled.</Message>
                    ) : (
                      <Row>
                        {club?.events?.map((event) => (
                          <Col key={event._id} md={6} lg={4} className="mb-4">
                            <EventCard event={event} />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                  <Col lg={4}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="card-title">Club Details</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <strong>Created:</strong> {new Date(club?.createdAt).toLocaleDateString()}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Category:</strong> {club?.category || 'General'}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Meeting Schedule:</strong> {club?.meetingSchedule || 'Not specified'}
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="members" title="Members">
                <h2 className="club-section-title">Club Members</h2>
                {club?.members?.length === 0 ? (
                  <Message>No members yet.</Message>
                ) : (
                  <div className="members-grid">
                    {club?.members?.map((member) => (
                      <MemberCard 
                        key={member._id} 
                        member={member} 
                        isAdmin={member._id === club?.admin._id}
                      />
                    ))}
                  </div>
                )}
              </Tab>
              <Tab eventKey="events" title="All Events">
                <h2 className="club-section-title">Past & Upcoming Events</h2>
                {club?.events?.length === 0 ? (
                  <Message>No events yet.</Message>
                ) : (
                  <div className="events-timeline">
                    {club?.events?.map((event) => (
                      <div key={event._id} className="timeline-item">
                        <div className="event-date">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-location">
                          <i className="fas fa-map-marker-alt"></i>
                          {event.location}
                        </div>
                        <p className="event-description">
                          {event.description.substring(0, 200)}...
                        </p>
                        <div className="event-actions">
                          <Button 
                            as={Link} 
                            to={`/events/${event._id}`} 
                            variant="outline-primary" 
                            size="sm"
                          >
                            View Details
                          </Button>
                          {isAdmin && (
                            <Button variant="outline-danger" size="sm">
                              Cancel Event
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </>
      )}

      {/* Create Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorEventCreate && <Message variant="danger">{errorEventCreate}</Message>}
          <Form onSubmit={submitEventHandler}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="date" className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="location" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={loadingEventCreate}
              >
                {loadingEventCreate ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Club Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          <p>Are you sure you want to delete the club "{club?.name}"? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={deleteHandler}
            disabled={loadingDelete}
          >
            {loadingDelete ? 'Deleting...' : 'Delete Club'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClubScreen;