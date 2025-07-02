import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../actions/eventActions';
import { getClubDetails } from '../actions/clubActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import DateTimePicker from 'react-datetime-picker';
import '../screens/CreateEventsScreen.css';

const CreateEventsScreen = () => {
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const eventCreate = useSelector((state) => state.eventCreate);
  const { loading, error, success } = eventCreate;

  const clubDetails = useSelector((state) => state.clubDetails);
  const { club } = clubDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'club_admin') {
      navigate('/login');
    }

    dispatch(getClubDetails(clubId));

    if (success) {
      navigate(`/clubs/${clubId}`);
    }
  }, [dispatch, navigate, userInfo, clubId, success]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Replace with your actual upload endpoint
      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !description || !date || !location) {
      setMessage('Please fill in all required fields');
    } else {
      dispatch(createEvent({
        title,
        description,
        date,
        location,
        club: clubId,
        image
      }));
    }
  };

  return (
    <Container className="create-event-container">
      <Meta title="Create Event | College Clubs" />
      <FormContainer>
        <h1 className="text-center mb-4">
          Create Event for {club?.name || 'Club'}
        </h1>
        {message && <Alert variant="danger">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Loader />}
        
        <Form onSubmit={submitHandler} className="create-event-form">
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Event Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="date" className="mb-3">
                <Form.Label>Date & Time *</Form.Label>
                <div className="datetime-picker">
                  <DateTimePicker
                    onChange={setDate}
                    value={date}
                    minDate={new Date()}
                    format="y-MM-dd h:mm a"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="location" className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Where is the event?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="image" className="mb-4">
            <Form.Label>Event Image</Form.Label>
            <div className="file-upload">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag & drop an image here or click to browse</p>
              <input type="file" onChange={uploadFileHandler} />
            </div>
            {uploading && <Loader />}
            {image && (
              <img 
                src={image} 
                alt="Preview" 
                className="image-preview show"
              />
            )}
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default CreateEventsScreen;