import React, { useEffect } from 'react';
import styled from 'styled-components';
import { createObjectURL, revokeObjectURL } from '../../utils/imageUtils';

// Styled components for file viewer
const FileViewerContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const DocumentPreview = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-top: 10px;
`;

const DownloadLink = styled.a`
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ExpandedImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
`;

const ExpandedImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const FileViewer = ({ file, imageUrl }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [fileObjectUrl, setFileObjectUrl] = React.useState(null);
  
  useEffect(() => {
    // Create object URL for file if provided
    if (file) {
      const url = createObjectURL(file);
      setFileObjectUrl(url);
      
      // Clean up object URL when component unmounts
      return () => {
        if (url) revokeObjectURL(url);
      };
    }
  }, [file]);
  
  if (!file && !imageUrl) return null;
  
  // Determine source URL
  const sourceUrl = imageUrl || fileObjectUrl;
  
  // Determine if it's an image
  const isImage = imageUrl || (file && file.type.split('/')[0] === 'image');
  
  // Determine file name and extension
  const fileName = file ? file.name : imageUrl.split('/').pop();
  const fileExtension = fileName ? fileName.split('.').pop().toLowerCase() : '';
  
  // Handle image click to expand
  const handleImageClick = () => {
    setExpanded(true);
  };
  
  // Handle closing expanded image
  const handleCloseExpanded = () => {
    setExpanded(false);
  };
  
  // Render appropriate preview based on file type
  const renderPreview = () => {
    if (isImage) {
      return <ImagePreview src={sourceUrl} alt={fileName || 'Image'} onClick={handleImageClick} />;
    } else if (fileExtension === 'pdf') {
      return (
        <DocumentPreview>
          <div>PDF Document: {fileName}</div>
          <DownloadLink href={sourceUrl} target="_blank" rel="noopener noreferrer">
            View PDF
          </DownloadLink>
        </DocumentPreview>
      );
    } else if (['doc', 'docx'].includes(fileExtension)) {
      return (
        <DocumentPreview>
          <div>Word Document: {fileName}</div>
          <DownloadLink href={sourceUrl} download={fileName}>
            Download Document
          </DownloadLink>
        </DocumentPreview>
      );
    } else {
      return (
        <DocumentPreview>
          <div>File: {fileName}</div>
          <DownloadLink href={sourceUrl} download={fileName}>
            Download File
          </DownloadLink>
        </DocumentPreview>
      );
    }
  };

  return (
    <FileViewerContainer>
      {renderPreview()}
      
      {expanded && (
        <ExpandedImageContainer onClick={handleCloseExpanded}>
          <ExpandedImage src={sourceUrl} alt={fileName || 'Expanded image'} />
        </ExpandedImageContainer>
      )}
    </FileViewerContainer>
  );
};

export default FileViewer;
