import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createClub } from '../actions/clubActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import '../screens/CreateClubScreen.css';

const CreateClubScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('academic');
  const [meetingSchedule, setMeetingSchedule] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clubCreate = useSelector((state) => state.clubCreate);
  const { loading, error, success, club } = clubCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'club_admin') {
      navigate('/login');
    }

    if (success) {
      navigate(`/clubs/${club._id}`);
    }
  }, [navigate, userInfo, success, club]);

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
    if (!name || !description) {
      setMessage('Please fill in all required fields');
    } else {
      dispatch(createClub({
        name,
        description,
        category,
        meetingSchedule,
        image
      }));
    }
  };

  return (
    <Container className="create-club-container">
      <Meta title="Create Club | College Clubs" />
      <FormContainer>
        <h1 className="text-center mb-4">Create New Club</h1>
        {message && <Alert variant="danger">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Loader />}
        
        <Form onSubmit={submitHandler} className="create-club-form">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Club Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter club name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Tell us about your club..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="academic">Academic</option>
                  <option value="arts">Arts</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="meetingSchedule" className="mb-3">
                <Form.Label>Meeting Schedule</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Every Tuesday at 5 PM"
                  value={meetingSchedule}
                  onChange={(e) => setMeetingSchedule(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="image" className="mb-4">
            <Form.Label>Club Image</Form.Label>
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
              {loading ? 'Creating Club...' : 'Create Club'}
            </Button>
          </div>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default CreateClubScreen;