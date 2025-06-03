import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCalendarAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Styled components for the sidebar content
const ContentContainer = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 3px solid #2d3748;
`;

const ContentTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
`;

const ContentHeading = styled.h4`
  margin: 1rem 0 0.5rem 0;
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e6;
  padding-bottom: 0.25rem;
`;

const ContentLink = styled.a`
  display: flex;
  align-items: center;
  color: #3182ce;
  text-decoration: none;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
    font-size: 0.8rem;
  }
`;

const ContentText = styled.p`
  margin: 0.25rem 0 0.5rem 0;
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.4;
`;

const UpdateItem = styled.div`
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e5e6;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const UpdateDate = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const UpdateTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

/**
 * SidebarContent component to display additional information in the sidebar
 * @param {Object} props - Component props
 * @param {Object} props.content - Content data to display
 */
const SidebarContent = ({ content }) => {
  if (!content) return null;
  
  return (
    <ContentContainer>
      <ContentTitle>{content.title || 'Additional Information'}</ContentTitle>
      
      {content.content && content.content.map((item, index) => {
        // Render different content types
        switch (item.type) {
          case 'heading':
            return <ContentHeading key={index}>{item.text}</ContentHeading>;
            
          case 'link':
            return (
              <ContentLink 
                key={index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                {item.text}
              </ContentLink>
            );
            
          case 'text':
            return <ContentText key={index}>{item.text}</ContentText>;
            
          case 'update':
            return (
              <UpdateItem key={index}>
                <UpdateDate>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {item.date}
                </UpdateDate>
                <UpdateTitle>{item.title}</UpdateTitle>
                {item.description && <ContentText>{item.description}</ContentText>}
                {item.url && (
                  <ContentLink 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                    View Details
                  </ContentLink>
                )}
              </UpdateItem>
            );
            
          default:
            return (
              <ContentText key={index}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '0.5rem' }} />
                {item.text || 'Additional information'}
              </ContentText>
            );
        }
      })}
    </ContentContainer>
  );
};

export default SidebarContent;
