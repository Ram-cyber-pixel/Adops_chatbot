import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { resolveLocalImagePath } from '../../utils/enhancedLocalImageHandler';

const TextContent = styled.div`
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 1.5;
`;

const StyledLink = styled.a`
  color: ${(props) => (props.isUser ? '#90cdf4' : '#3182ce')};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  margin-top: 0.5rem;
  max-width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  will-change: transform;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageFallback = styled.div`
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ChatContent = ({ type, content, isUser }) => {
  const [imageError, setImageError] = React.useState(false);
  const [expandedImage, setExpandedImage] = React.useState(null);

  const handleImageError = () => {
    console.error(`Failed to load image: ${content}`);
    setImageError(true);
  };

  const closeModal = () => {
    setExpandedImage(null);
  };

  switch (type) {
    case 'image': {
      const imagePath = resolveLocalImagePath(content);

      return (
        <>
          <ImageContainer>
            {!imageError ? (
              <StyledImage 
              src={imagePath} 
              alt={`Image: ${content}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error('Failed to load image:', e.target.src);
                handleImageError();
              }}
            />
            ) : (
              <ImageFallback>
                Failed to load image: {content}
              </ImageFallback>
            )}
          </ImageContainer>

          {expandedImage && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                cursor: 'pointer',
              }}
              onClick={closeModal}
            >
              <img
                src={expandedImage}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  border: '2px solid white',
                  borderRadius: '4px',
                }}
                alt="Expanded"
              />
            </div>
          )}
        </>
      );
    }

    case 'text':
      return <TextContent isUser={isUser}>{content}</TextContent>;

    default:
      console.error(`Unsupported content type: ${type}`);
      return null;
  }
};

ChatContent.propTypes = {
  type: PropTypes.oneOf(['text', 'image']).isRequired,
  content: PropTypes.string.isRequired,
  isUser: PropTypes.bool,
};

ChatContent.defaultProps = {
  isUser: false,
};

export default ChatContent;