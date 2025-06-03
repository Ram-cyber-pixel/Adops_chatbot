import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Styled components for the sidebar
const SidebarContainer = styled.div`
  position: fixed;
  left: ${props => props.$isOpen ? '0' : '-300px'};
  top: 0;
  height: 100vh;
  width: 300px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
  font-weight: 600;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e5e6;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
`;

const QuestionItem = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #e5e7eb;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const QuestionText = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
`;

const CategoryTitle = styled.h3`
  margin: 1.5rem 0 0.75rem;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e6;
  padding-bottom: 0.5rem;
`;

const ToggleButton = styled.button`
  position: fixed;
  left: ${props => props.$isOpen ? '300px' : '0'};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: ${props => props.$isOpen ? '0 4px 4px 0' : '0 4px 4px 0'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s ease-in-out;
  z-index: 1001;
  
  &:hover {
    background-color: #4a5568;
  }
  
  &:focus {
    outline: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e5e6;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

/**
 * PremadeQuestionsSidebar component
 * @param {Object} props - Component props
 * @param {Array} props.questions - Array of premade questions
 * @param {Function} props.onSelectQuestion - Callback when a question is selected
 */
const PremadeQuestionsSidebar = ({ questions, onSelectQuestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState({});
  
  // Organize questions by category
  useEffect(() => {
    if (!questions || !Array.isArray(questions)) return;
    
    // Group questions by category
    const categorized = questions.reduce((acc, question) => {
      const category = question.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(question);
      return acc;
    }, {});
    
    setCategories(categorized);
    
    // Initialize filtered questions
    filterQuestions(searchTerm, categorized);
  }, [questions]);
  
  // Filter questions based on search term
  const filterQuestions = (term, cats = categories) => {
    if (!term) {
      setFilteredQuestions(Object.entries(cats));
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filtered = {};
    
    Object.entries(cats).forEach(([category, categoryQuestions]) => {
      const matchingQuestions = categoryQuestions.filter(q => 
        q.text.toLowerCase().includes(lowerTerm)
      );
      
      if (matchingQuestions.length > 0) {
        filtered[category] = matchingQuestions;
      }
    });
    
    setFilteredQuestions(Object.entries(filtered));
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterQuestions(term);
  };
  
  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle question selection
  const handleQuestionClick = (question) => {
    if (onSelectQuestion) {
      onSelectQuestion(question.text);
      // Optionally close the sidebar on mobile
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };
  
  return (
    <>
      <ToggleButton $isOpen={isOpen} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </ToggleButton>
      
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Premade Questions</SidebarTitle>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </SidebarHeader>
        
        <SidebarContent>
          <SearchInput 
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {filteredQuestions.length === 0 ? (
            <p>No questions found. Try a different search term.</p>
          ) : (
            filteredQuestions.map(([category, categoryQuestions]) => (
              <div key={category}>
                <CategoryTitle>{category}</CategoryTitle>
                {categoryQuestions.map((question, index) => (
                  <QuestionItem 
                    key={index} 
                    onClick={() => handleQuestionClick(question)}
                  >
                    <QuestionText>{question.text}</QuestionText>
                  </QuestionItem>
                ))}
              </div>
            ))
          )}
        </SidebarContent>
        
        <SidebarFooter>
          Click on any question to start a conversation
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default PremadeQuestionsSidebar;
