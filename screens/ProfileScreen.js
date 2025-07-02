import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Card, Modal, Form } from 'react-bootstrap';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyClubs } from '../actions/clubActions';
import { listMyEvents } from '../actions/eventActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import '../screens/ProfileScreen.css';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avatar, setAvatar] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const clubListMy = useSelector((state) => state.clubListMy);
  const { clubs } = clubListMy;

  const eventListMy = useSelector((state) => state.eventListMy);
  const { events } = eventListMy;

  useEffect(() => {
    if (!userInfo) {
      // Redirect to login if not logged in
    } else {
      if (!user || !user.name || success) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyClubs());
        dispatch(listMyEvents());
      } else {
        setName(user.name);
        setEmail(user.email);
        if (user.avatar) {
          setAvatar(user.avatar);
        }
      }
    }
  }, [dispatch, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      const updatedUser = {
        id: user._id,
        name,
        email,
        password: password || undefined,
        avatar,
      };
      dispatch(updateUserProfile(updatedUser));
      setShowModal(false);
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    // Dispatch upload action here
    // After successful upload, set the avatar URL
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <>
      <Meta title="My Profile | College Clubs" />
      <Row>
        <Col md={4}>
          <div className="profile-header">
            <img
              src={avatar || '/images/default-avatar.png'}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <span className="profile-role">
                {user?.role === 'student' ? 'Student' : user?.role === 'club_admin' ? 'Club Admin' : 'Administrator'}
              </span>
              <div className="profile-contact">
                <div className="profile-contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{user?.email}</span>
                </div>
                <div className="profile-contact-item">
                  <i className="fas fa-user-tag"></i>
                  <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="profile-actions">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="profile-section">
            <h2 className="profile-section-title">My Clubs</h2>
            {clubs?.length === 0 ? (
              <Message>You haven't joined any clubs yet.</Message>
            ) : (
              <Row className="clubs-grid">
                {clubs?.map((club) => (
                  <Col key={club._id} sm={6} lg={4}>
                    <Card className="mb-3">
                      <Card.Img variant="top" src={club.image} />
                      <Card.Body>
                        <Card.Title>{club.name}</Card.Title>
                        <Button 
                          href={`/clubs/${club._id}`} 
                          variant="outline-primary" 
                          size="sm"
                        >
                          View Club
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Upcoming Events</h2>
            {events?.length === 0 ? (
              <Message>You don't have any upcoming events.</Message>
            ) : (
              <ListGroup variant="flush" className="events-list">
                {events?.map((event) => (
                  <ListGroup.Item key={event._id}>
                    <Row>
                      <Col md={3}>
                        <strong>{new Date(event.date).toLocaleDateString()}</strong>
                      </Col>
                      <Col md={6}>
                        <h5>{event.title}</h5>
                        <p className="text-muted">{event.club?.name}</p>
                      </Col>
                      <Col md={3} className="text-end">
                        <Button 
                          href={`/events/${event._id}`} 
                          variant="outline-primary" 
                          size="sm"
                        >
                          Details
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <div className="avatar-upload">
              <img
                src={avatar || '/images/default-avatar.png'}
                alt="Preview"
                className="avatar-preview"
              />
              <label className="upload-btn btn btn-secondary">
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  accept="image/*"
                />
                Change Avatar
              </label>
            </div>

            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Text className="text-muted">
                Leave blank to keep current password
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">Profile Updated</Message>}

            <div className="d-grid gap-2 mt-4">
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileScreen;