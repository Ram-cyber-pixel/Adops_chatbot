import React, { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faPaperPlane, faImage, faTimes, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { animations } from '../../utils/enhancedInteractivity';
import html2canvas from 'html2canvas';

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0.75rem;
    border: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    border-top: 1px solid #e5e7eb;
    padding: 1rem 1.5rem;
  }
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const FormControl = styled(Form.Control)`
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  font-size: 1rem;
  
  &:focus {
    border-color: #2d3748;
    box-shadow: 0 0 0 3px rgba(6, 7, 7, 0.25);
  }
`;

const FormTextarea = styled(Form.Control)`
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    border-color:rgb(15, 16, 16);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #2d3748;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover, &:focus {
    background-color: #1a202c;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid #1a202c;
    outline-offset: 2px;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &:hover, &:focus {
    background-color: #e5e7eb;
    color: #1f2937;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid rgb(14, 14, 15);
    outline-offset: 2px;
  }
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const RemoveFileButton = styled(Button)`
  padding: 0.25rem;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #6b7280;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #e5e7eb;
    color: #1f2937;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid rgb(0, 1, 2);
    outline-offset: 2px;
  }
`;

const SuccessMessage = styled.div`
  background-color: #ecfdf5;
  border: 1px solid #d1fae5;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #065f46;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #b91c1c;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const ScreenshotPreview = styled.div`
  margin-top: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  position: relative;
  max-width: 100%;
  max-height: 200px;
  animation: ${animations.fadeIn} 0.3s ease-out;
  
  img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem;
  }
`;

const ReportIssue = ({ show, onClose }) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleClose = () => {
    onClose();
    // Reset form after a delay to allow modal close animation
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setIssueType('');
    setDescription('');
    setEmail('');
    setScreenshot(null);
    setScreenshotPreview('');
    setSubmitSuccess(false);
    setSubmitError(false);
    setErrorMessage('');
  };

  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        setSubmitError(true);
        setErrorMessage('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError(true);
        setErrorMessage('File size exceeds 5MB limit');
        return;
      }
      
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setSubmitError(false);
      setErrorMessage('');
    }
  };

  const handleRemoveScreenshot = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshot(null);
    setScreenshotPreview('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!issueType) {
      setSubmitError(true);
      setErrorMessage('Please select an issue type');
      return;
    }
    
    if (!description || description.trim().length < 10) {
      setSubmitError(true);
      setErrorMessage('Please provide a detailed description (at least 10 characters)');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(false);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would send the data to your backend:
      // const formData = new FormData();
      // formData.append('issueType', issueType);
      // formData.append('description', description);
      // formData.append('email', email);
      // if (screenshot) {
      //   formData.append('screenshot', screenshot);
      // }
      // const response = await fetch('/api/report-issue', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) throw new Error('Failed to submit issue');
      
      setSubmitSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting issue:', error);
      setSubmitError(true);
      setErrorMessage('Failed to submit issue. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const captureScreenshot = async () => {
    try {
      setSubmitError(false);
      setErrorMessage('');
  
      // Select the element to capture (modify to target a specific section if needed)
      const targetElement = document.body; // Replace with a specific element if required
  
      // Capture the element as a canvas
      const canvas = await html2canvas(targetElement, {
        useCORS: true, // Handle CORS for external resources
        logging: true, // Enable logging for debugging
        scale: 2, // Increase resolution (optional)
      });
  
      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a screenshot file
          const screenshotFile = new File([blob], 'screenshot.png', { type: 'image/png' });
  
          // Update state with the captured screenshot
          setScreenshot(screenshotFile);
          setScreenshotPreview(URL.createObjectURL(screenshotFile));
        } else {
          throw new Error('Failed to capture screenshot.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      setSubmitError(true);
      setErrorMessage(error.message || 'An error occurred while capturing the screenshot.');
    }
  };

  return (
    <StyledModal show={show} onHide={handleClose} centered aria-labelledby="report-issue-modal">
      <Modal.Header closeButton>
        <Modal.Title id="report-issue-modal">Report an Issue or Query</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitSuccess && (
          <SuccessMessage>
            <FontAwesomeIcon icon={faCheck} />
            Your issue has been submitted successfully! We'll review it shortly.
          </SuccessMessage>
        )}
        
        {submitError && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {errorMessage || 'An error occurred. Please try again.'}
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <FormLabel>Issue Type</FormLabel>
            <FormControl
              as="select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              disabled={submitting}
              aria-label="Select issue type"
            >
              <option value="">Select an issue type</option>
              <option value="bug">Bug or Error</option>
              <option value="feature">Feature Request</option>
              <option value="question">Question</option>
              <option value="other">Other</option>
            </FormControl>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormTextarea
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              disabled={submitting}
              aria-label="Issue description"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <FormLabel>Email (optional)</FormLabel>
            <FormControl
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={submitting}
              aria-label="Your email address (optional)"
            />
            <Form.Text className="text-muted">
              We'll use this to follow up on your issue if needed.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <FormLabel className="mb-0">Screenshot</FormLabel>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={captureScreenshot}
                disabled={submitting}
                aria-label="Capture current screen"
              >
                <FontAwesomeIcon icon={faImage} className="me-1" />
                Capture Screen
              </Button>
            </div>
            
            <FormControl
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              disabled={submitting}
              aria-label="Upload screenshot (optional)"
              ref={fileInputRef}
            />
            <Form.Text className="text-muted">
              Upload or capture a screenshot to help us understand the issue better.
            </Form.Text>
            
            {screenshotPreview && (
              <>
                <ScreenshotPreview>
                  <img 
                    src={screenshotPreview} 
                    alt="Screenshot preview" 
                    loading="lazy"
                  />
                  <div className="overlay">
                    <RemoveFileButton 
                      onClick={handleRemoveScreenshot}
                      aria-label="Remove screenshot"
                      disabled={submitting}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </RemoveFileButton>
                  </div>
                </ScreenshotPreview>
                
                <FilePreview>
                  <FileInfo>
                    <FontAwesomeIcon icon={faImage} />
                    <span>{screenshot?.name || 'Screenshot'}</span>
                  </FileInfo>
                  <RemoveFileButton 
                    onClick={handleRemoveScreenshot}
                    aria-label="Remove screenshot"
                    disabled={submitting}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </RemoveFileButton>
                </FilePreview>
              </>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={handleClose} disabled={submitting}>
          Cancel
        </CancelButton>
        <SubmitButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} />
              Submit Report
            </>
          )}
        </SubmitButton>
      </Modal.Footer>
    </StyledModal>
  );
};

export default ReportIssue;
