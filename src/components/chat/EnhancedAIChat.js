import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faRobot, faUser, faImage, faXmark, faLink, faFlag, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import FileViewer from '../common/FileViewer';
import PremadeQuestionsSidebar from '../common/PremadeQuestionsSidebar';
import SidebarContent from '../common/SidebarContent';
import ReportIssue from '../common/ReportIssue';
import ChatContent from '../common/ChatContent';
import syscodeData from '../../data/syscodeData';
import ticketData from '../../data/ticketdata';
import questionAndanserData from '../../data/questionAndAnswerData';
import generalResponses from '../../data/generalResponses';
import roeData from '../../data/roeData';
import fulfillmentData from '../../data/fulfillmentData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  extractImageUrls, 
  removeImageUrls, 
  isImageUrl, 
  validateImageUrl, 
  extractLinks, 
  formatLink, 
  enhanceTextWithImages 
} from '../../utils/enhancedImageUtils';
import { 
  findBestMatches, 
  analyzeConversationContext, 
  determineResponseCategory 
} from '../../utils/enhancedFuzzyMatching';
import { 
  generateEnhancedResponse, 
  handleSpecialCommands, 
  enhanceResponseWithContext 
} from '../../utils/enhancedResponseGenerator';
import {
  analyzeSentenceIntent,
  resolveKeywordAmbiguity,
  groupRelatedKeywords,
  mapSynonymsToCanonical
} from '../../utils/enhancedIntentAnalyzer';
import {
  animations,
  animationStyles,
  showUploadSuccessAnimation,
  highlightNewMessage,
  addSmoothScrolling
} from '../../utils/enhancedInteractivity';
import {
  resolveLocalImagePath,
  preloadImage,
  addImageErrorHandling
} from '../../utils/enhancedLocalImageHandler';
import {
  addAriaAttributes,
  addKeyboardNavigation,
  addVisibleFocusIndicators,
  announceToScreenReader
} from '../../utils/enhancedAccessibility';
import {
  isUrlResourceQuery,
  generateUrlResourceResponse
} from '../../utils/urlResourceUtils';
import 'bootstrap/dist/css/bootstrap.min.css';

// Sample pre-defined questions with categories
const allPremadeQuestions = [
  { text: "Our 13 Processes Details?", category: "Processes" },
  { text: "Client Name & Ticket Number", category: "Tickets" },
  { text: "Market Deadline Timings For Various Time Zone", category: "Deadlines" },
  { text: "Rules for Bookend Pairing", category: "Bookends" },
  { text: "Spot Restricted & Special Instructions", category: "Instructions" },
  { text: "Type of order in ROE?", category: "ROE" },
];

const getRandomMainChatQuestions = (allQuestions, count = 6) => {
  const questionsCopy = [...allQuestions];
  const randomQuestions = [];
  const selectedIndices = new Set();
  for (let i = 0; i < Math.min(count, questionsCopy.length); i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questionsCopy.length);
    } while (selectedIndices.has(randomIndex));
    
    selectedIndices.add(randomIndex);
    randomQuestions.push(questionsCopy[randomIndex]);
  }
  return randomQuestions;
};

export const ChatContainer = styled(Container)`
  max-width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #f7f7f8;
  overflow: hidden;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 1rem 1rem;
  border-bottom: 1px solid #e5e5e6;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatTitle = styled.h1`
  font-size: 1.10rem;
  color: #2d3748;
  margin: 0;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ReportButton = styled(Button)`
  background: transparent;
  border: 1px solid #e5e5e6;
  color: #4b5563;
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover, &:focus {
    background-color: #f3f4f6;
    color:rgb(25, 28, 32);
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SidebarArea = styled.div`
  width: 300px;
  border-left: 1px solid #e5e5e6;
  background: #ffffff;
  overflow-y: auto;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: relative;
  animation: ${props => props.$show ? animations.slideInRight : 'none'} 0.3s ease-out;
`;

const SidebarCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color:rgb(18, 19, 21);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid rgb(11, 12, 13);
    outline-offset: 2px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f7f7f8;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  position: relative;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const MessageRow = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  max-width: 100%;
  ${props => animationStyles.message(props.$isUser)}

  @media (min-width: 768px) {
    max-width: 800px;
    margin-left: ${props => props.$isUser ? 'auto' : '0'};
    margin-right: ${props => props.$isUser ? '0' : 'auto'};
  }
`;

const MessageBubble = styled.div`
  max-width: 90%;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.$isUser ? '0.75rem 0.25rem 0.75rem 0.75rem' : '0.25rem 0.75rem 0.75rem 0.75rem'};
  background: ${props => props.$isUser ? '#2d3748' : '#ffffff'};
  color: ${props => props.$isUser ? '#ffffff' : '#2d3748'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  position: relative;
  line-height: 1.5;
  word-break: break-word;

  @media (min-width: 768px) {
    max-width: 80%;
  }
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.$isUser ? 'rgba(255,255,255,0.7)' : '#9ca3af'};
  margin-top: 0.25rem;
  text-align: right;
`;

const AvatarContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.$isUser ? '#2d3748' : '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.$isUser ? '0 0 0 0.75rem' : '0 0.75rem 0 0'};
  color: ${props => props.$isUser ? '#ffffff' : '#4b5563'};
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const InputContainer = styled.div`
  padding: 0.75rem;
  background: #ffffff;
  border-top: 1px solid #e5e5e6;
  display: flex;
  flex-direction: column;
`;

const PreMadeQuestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 0.75rem; 
  margin-bottom: 1rem; 
`;

const PreMadeQuestionButton = styled.button`
  background: transparent; 
  border: 1px solid #2d3748; 
  border-radius: 0.5rem;
  padding: 0.5rem 1rem; 
  font-size: 0.875rem; 
  color: #2d3748; 
  cursor: pointer;
  font-weight: 500; 
  transition: all 0.2s ease-in-out; 
  ${animationStyles.buttonHover}
  ${animationStyles.focusIndicator}

  &:hover {
    background: #2d3748; 
    color: #ffffff; 
    transform: translateY(-1px); 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); 
  }

  &:active {
    transform: translateY(0); 
    box-shadow: none; 
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

const StyledInput = styled(Form.Control)`
  border-radius: 0.5rem;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #e5e5e6;
  font-size: 1rem;
  flex: 1;
  resize: none;
  min-height: 40px;
  max-height: 150px;
  line-height: 1.3;
  box-shadow: none;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 46, 62, 0.2);
    border-color: #2d3748;
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid #2d3748;
    outline-offset: 2px;
  }
`;

const ButtonGroup = styled.div`
  position: absolute;
  right: 0.75rem;
  bottom: 0.20rem;
  display: flex;
  gap: 0.5rem;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const SendButton = styled(Button)`
  border-radius: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #2d3748;
  border: none;
  transition: all 0.2s ease-in-out;
  ${animationStyles.buttonHover}
  ${animationStyles.focusIndicator}

  &:hover, &:focus {
    background: #2d3748;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background: #9ca3af;
    opacity: 0.7;
  }
`;

const AttachButton = styled(Button)`
  border-radius: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #f3f4f6;
  border: none;
  color: #4b5563;
  transition: all 0.2s ease-in-out;
  ${animationStyles.buttonHover}
  ${animationStyles.focusIndicator}

  &:hover, &:focus {
    background: #e5e7eb;
    color: #1f2937;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const FileInput = styled(Form.Control)`
  display: none;
`;

const FilePreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  margin: 0.5rem auto 0;
  width: 100%;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileAttachment = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const FileLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border-radius: 0.5rem;
  width: fit-content;
  margin: 0.25rem 0;
  align-self: flex-start;
  ${animationStyles.typingIndicator}
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  animation: ${animations.typingBounce} 1.4s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
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
  }
  
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  max-width: 200px;
  max-height: 200px;
`;

const MessageImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LinkPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.$isUser ? 'rgba(255,255,255,0.1)' : '#f3f4f6'};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.2)' : '#e5e7eb'};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${animations.fadeIn} 0.3s ease-out;
`;

const LinkIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isUser ? '#90cdf4' : '#3182ce'};
`;

const LinkText = styled.a`
  color: ${props => props.$isUser ? '#90cdf4' : '#3182ce'};
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const EnhancedAIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Assistant. I can help with organization processes, answer questions, and provide information with images and links. AdOps chatbot that checks for mistakes and asks questions differently. How can I assist you today?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrls: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentSidebarContent, setCurrentSidebarContent] = useState(null);
  const [showPreMadeQuestions, setShowPreMadeQuestions] = useState(true);
  const [mainChatQuestions, setMainChatQuestions] = useState([]);
  const [showSidebarContent, setShowSidebarContent] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  
  const [tickets, setTickets] = useState([
    "Ticket: 1903610 - Client Name - Hyundai",
    "Ticket: 1893721 - Client Name - BETMGM",
    "Ticket: 1888210 - Client Name - DANA FABER",
    "Ticket: 1914910 - Tickets with Multi TIFS",
    "Ticket: 1917981 - Client Name: KROGER CO",
    "Ticket: 1918333 - Client Name: RAM (Starcom)",
    "Ticket: 1917415 - Client Name: Camping World",
    "Ticket: 1917415 - Client Name: BLUE RIDGE HONDA",
    "Ticket: 1918314 - Political Client",
    "Ticket: 1912216 - Client: American Signature",
    "Ticket: 1942100 - Audience Addresable Ticket",
    "Ticket: 1878385 - Cilent Name: Papa Murphy's ",
    "Ticket: 1867681 - ",
    "Ticket: 1902222",
    "Ticket: 1901111"
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowingTickets, setIsShowingTickets] = useState(false);
  const ticketsPerPage = 10;
  const [expandedImage, setExpandedImage] = useState(null);

  // Initialize accessibility features when component mounts
  useEffect(() => {
    if (chatContainerRef.current) {
      addAriaAttributes(chatContainerRef.current);
      addKeyboardNavigation(chatContainerRef.current);
      addVisibleFocusIndicators();
    }
    
    if (messagesContainerRef.current) {
      addSmoothScrolling(messagesContainerRef.current);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    setMainChatQuestions(getRandomMainChatQuestions(allPremadeQuestions));
  }, []);
  
  // Function to generate ticket responses with pagination
  const generateTicketResponse = () => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = Math.min(startIndex + ticketsPerPage, tickets.length);
    const currentTickets = tickets.slice(startIndex, endIndex);
    
    let response = "Here are the current tickets:\n\n";
    currentTickets.forEach((ticket, index) => {
      response += `${startIndex + index + 1}. ${ticket}\n`;
    });
    
    if (endIndex < tickets.length) {
      response += "\nThere are more tickets available. Click on 'More Button' to see the next page.";
    }
    return response;
  };
  
  const handleMoreTickets = () => {
    if (currentPage * ticketsPerPage < tickets.length) {
      setCurrentPage(prev => prev + 1);
      
      // Create a user message
      const userMessage = {
        id: Date.now(),
        text: "Show more tickets",
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    
      setMessages(prev => [...prev, userMessage]);
      
      // Generate the bot's response with the next page of tickets
      setTimeout(() => {
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * ticketsPerPage;
        const endIndex = Math.min(startIndex + ticketsPerPage, tickets.length);
        const nextTickets = tickets.slice(startIndex, endIndex);
        
        let response = "Here are more tickets:\n\n";
        nextTickets.forEach((ticket, index) => {
          response += `${startIndex + index + 1}. ${ticket}\n`;
        });
        
        if (endIndex < tickets.length) {
          response += "\nThere are more tickets available. Click on 'more button' to see the next page.";
        } else {
          response += "\nThat's all the tickets we have.";
        }
        
        const botMessage = {
          id: Date.now(),
          text: response,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    }
  };
  
  const handlePreMadeQuestionClick = (questionText) => {
    const userMessage = {
      id: Date.now(),
      text: questionText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowPreMadeQuestions(false);
    setIsTyping(true);
    
    announceToScreenReader(`Sent: ${questionText}`, "polite");
    
 
    generateBotResponse(questionText, userMessage);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '' && !file) return;
    
    // Create a user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: file
    };
    

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setFile(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl('');
    }
    setShowPreMadeQuestions(false);
    setIsTyping(true);
    
    announceToScreenReader(`Message sent: ${inputMessage}`, "polite");
    
    // Check for special commands
    const specialCommandResponse = handleSpecialCommands(inputMessage);
    if (specialCommandResponse) {
      if (specialCommandResponse.systemAction === 'clear') {
        // Clear chat history except for the initial greeting
        setMessages([messages[0]]);
        setIsTyping(false);
        setShowPreMadeQuestions(true);
        return;
      }
      
      // Handle other special commands
      setTimeout(() => {
        const botMessage = {
          id: Date.now(),
          text: specialCommandResponse.text,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Announce to screen readers
        announceToScreenReader("Response received", "polite");
      }, 500);
      
      return;
    }
    
    // Generate the bot's response
    generateBotResponse(inputMessage, userMessage);
  };
  
  const generateBotResponse = async (userInput, userMessage) => {
    setTimeout(async () => {
      const sentenceIntent = analyzeSentenceIntent(userInput, messages);
      const normalizedInput = mapSynonymsToCanonical(userInput);
      
      if (isUrlResourceQuery(userInput)) {
        const urlResourceResponse = generateUrlResourceResponse(userInput);
        
        if (urlResourceResponse.confidence > 0.6) {
          // If there's sidebar content, show it
          if (urlResourceResponse.sidebarContent) {
            setCurrentSidebarContent(urlResourceResponse.sidebarContent);
            setShowSidebarContent(true);
          }
          
          const botMessage = {
            id: Date.now(),
            text: urlResourceResponse.text,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: urlResourceResponse.category || 'urlResource'
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          
          // Announce to screen readers
          announceToScreenReader("Response received with resource links", "polite");
          
          return;
        }
      }
      
      // Combine all response data sources
      const responseData = {
        syscodeData,
        questionAndAnswerData: questionAndanserData,
        ticketData,
        roeData,
        generalResponses,
        fulfillmentData
      };
      
      // Analyze conversation context
      const context = analyzeConversationContext([...messages, userMessage]);
      
      // Generate enhanced response
      const response = generateEnhancedResponse(normalizedInput, [...messages, userMessage], responseData);
      
      // Resolve keyword ambiguity if multiple matches
      if (response.matchedKeywords && response.matchedKeywords.length > 1) {
        const resolvedKeyword = resolveKeywordAmbiguity(
          normalizedInput,
          response.matchedKeywords,
          responseData
        );
        
        // Use the resolved keyword if confidence is high enough
        if (resolvedKeyword.confidence > 0.7) {
          response.category = resolvedKeyword.category;
        }
      }
      
      // Check if this is a ticket-related query
      if (response.showTickets || /ticket|client name|ticket details/i.test(userInput.toLowerCase())) {
        setIsShowingTickets(true);
        setCurrentPage(1);
        
        // Replace [TICKET_LIST] placeholder with actual ticket list
        let responseText = response.text;
        if (responseText.includes('[TICKET_LIST]')) {
          responseText = responseText.replace('[TICKET_LIST]', generateTicketResponse());
        } else {
          // If no placeholder but still ticket-related, append ticket list
          responseText += "\n\n" + generateTicketResponse();
        }
        
        response.text = responseText;
      } else {
        setIsShowingTickets(false);
      }
      
      // Enhance response with context and intent
      const enhancedResponse = enhanceResponseWithContext({
        ...response,
        intent: sentenceIntent.intent,
        isQuestion: sentenceIntent.isQuestion
      }, context);
      
      // Validate image URLs
      const validatedImageUrls = [];
      for (const url of enhancedResponse.imageUrls || []) {
        try {
          const isValid = await validateImageUrl(url);
          if (isValid) {
            // Preload image
            await preloadImage(url);
            validatedImageUrls.push(url);
          }
        } catch (error) {
          console.error("Error validating image URL:", error);
        }
      }
      
      // Add bot response to chat
      const botMessage = {
        id: Date.now(),
        text: enhancedResponse.text,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        imageUrls: validatedImageUrls,
        localImages: enhancedResponse.localImages || [],
        links: enhancedResponse.links || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Announce to screen readers
      announceToScreenReader("Response received", "polite");
      
      // Highlight new message with subtle animation
      setTimeout(() => {
        const lastMessageElement = document.querySelector('.message-bubble:last-child');
        if (lastMessageElement) {
          highlightNewMessage(lastMessageElement);
        }
      }, 100);
    }, 1000 + Math.random() * 1000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      
      // Show success animation
      const filePreviewContainer = document.querySelector('.file-preview-container');
      if (filePreviewContainer) {
        showUploadSuccessAnimation(filePreviewContainer);
      }
      
      // Announce to screen readers
      announceToScreenReader(`File selected: ${selectedFile.name}`, "polite");
    }
  };

  const handleCloseSidebar = () => {
    setShowSidebarContent(false);
    setCurrentSidebarContent(null);
    
    // Announce to screen readers
    announceToScreenReader("Sidebar closed", "polite");
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl('');
    }
    
    // Announce to screen readers
    announceToScreenReader("File removed", "polite");
  };

  const handleImageClick = (url) => {
    setExpandedImage(url);
    
    // Announce to screen readers
    announceToScreenReader("Image expanded. Click anywhere to close.", "polite");
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
    
    // Announce to screen readers
    announceToScreenReader("Expanded image closed", "polite");
  };

  const handleOpenReportIssue = () => {
    setShowReportIssue(true);
    
    // Announce to screen readers
    announceToScreenReader("Report issue dialog opened", "polite");
  };

  const handleCloseReportIssue = () => {
    setShowReportIssue(false);
    
    // Announce to screen readers
    announceToScreenReader("Report issue dialog closed", "polite");
  };

  const renderMessageContent = (message) => {
    return (
      <>
        {/* Render Markdown content with table support */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
  
        {/* For local images from ticket data */}
        {message.localImages && message.localImages.length > 0 && (
          <div className="local-images-container">
            {message.localImages.map((imageName, index) => (
              <ChatContent
                key={`local-img-${index}`}
                type="image"
                content={imageName}
                isUser={message.sender === 'user'}
              />
            ))}
          </div>
        )}
  
        {/* Remote image handling */}
        {message.imageUrls && message.imageUrls.length > 0 && (
          <ImageGallery>
            {message.imageUrls.map((url, index) => (
              <ImageContainer key={index}>
                <MessageImage
                  src={url}
                  alt={`Image ${index + 1}`}
                  onClick={() => handleImageClick(url)}
                  loading="lazy"
                  decoding="async"
                  aria-label={`Image ${index + 1}. Click to expand.`}
                />
              </ImageContainer>
            ))}
          </ImageGallery>
        )}
  
        {/* Link rendering */}
        {message.links && message.links.length > 0 && message.links.map((link, index) => (
          <LinkPreview key={index} $isUser={message.sender === 'user'}>
            <LinkIcon $isUser={message.sender === 'user'}>
              <FontAwesomeIcon icon={faLink} />
            </LinkIcon>
            <LinkText
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              $isUser={message.sender === 'user'}
              aria-label={`Link: ${link}`}
            >
              {link}
            </LinkText>
          </LinkPreview>
        ))}
  
        {/* File attachment */}
        {message.file && (
          <FileAttachment>
            <FileLink
              href={URL.createObjectURL(message.file)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Attached file: ${message.file.name}`}
            >
              {message.file.name}
            </FileLink>
          </FileAttachment>
        )}
  
        <MessageTime $isUser={message.sender === 'user'}>{message.time}</MessageTime>
      </>
    );
  };

  const handleSidebarQuestionSelect = (questionText) => {
    const userMessage = {
      id: Date.now(),
      text: questionText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  
    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setShowPreMadeQuestions(false); // Hide pre-made questions
    setIsTyping(true); // Show typing indicator
    
    // Announce to screen readers
    announceToScreenReader(`Selected question: ${questionText}`, "polite");
  
    // Generate the bot's response
    generateBotResponse(questionText, userMessage);
  };

  return (
    
    <ChatContainer ref={chatContainerRef} role="region" aria-label="AI Chat Interface">
      <ChatHeader>
        <ChatTitle>Adops Process Assistant</ChatTitle>
        <HeaderActions>
          <ReportButton onClick={handleOpenReportIssue} aria-label="Report an issue">
            <FontAwesomeIcon icon={faFlag} />
            <span>Report Issue</span>
          </ReportButton>
        </HeaderActions>
      </ChatHeader>
      <PremadeQuestionsSidebar 
        questions={allPremadeQuestions} 
        onSelectQuestion={handleSidebarQuestionSelect} 
      />
      <MainContent>
        <ChatArea>
          <MessagesContainer ref={messagesContainerRef} role="log" aria-live="polite">
            {messages.map((message) => (
              <MessageRow key={message.id} $isUser={message.sender === 'user'}>
                <AvatarContainer $isUser={message.sender === 'user'}>
                  <FontAwesomeIcon icon={message.sender === 'user' ? faUser : faRobot} />
                </AvatarContainer>
                <MessageBubble $isUser={message.sender === 'user'} role="article" aria-label={`${message.sender === 'user' ? 'You' : 'AI Assistant'} said`}>
                  {renderMessageContent(message)}
                </MessageBubble>
              </MessageRow>
            ))}
            {isTyping && (
              <MessageRow $isUser={false}>
                <AvatarContainer $isUser={false}>
                  <FontAwesomeIcon icon={faRobot} />
                </AvatarContainer>
                <TypingIndicator aria-label="AI Assistant is typing">
                  <Dot className="typing-dot" />
                  <Dot className="typing-dot" />
                  <Dot className="typing-dot" />
                </TypingIndicator>
              </MessageRow>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          {showPreMadeQuestions && mainChatQuestions.length > 0 && (
              <PreMadeQuestionsContainer>
                {mainChatQuestions.map((question, index) => (
                  <PreMadeQuestionButton 
                    key={index} 
                    onClick={() => handlePreMadeQuestionClick(question.text)}
                    aria-label={`Suggested question: ${question.text}`}
                  >
                    {question.text}
                  </PreMadeQuestionButton>
                ))}
              </PreMadeQuestionsContainer>
            )}
            
            {isShowingTickets && !isTyping && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <PreMadeQuestionButton 
                  onClick={handleMoreTickets}
                  aria-label="Load more tickets"
                >
                  More
                </PreMadeQuestionButton>
              </div>
            )}
          <InputContainer>
            <StyledForm onSubmit={handleSendMessage} role="form" aria-label="Chat message form">
              <StyledInput
                as="textarea"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                aria-label="Type your message"
              />
              <ButtonGroup>
                <AttachButton
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  aria-label="Attach file"
                  className="attach-button"
                >
                  <FontAwesomeIcon icon={faPaperclip} />
                </AttachButton>
                <SendButton 
                  type="submit" 
                  disabled={inputMessage.trim() === '' && !file}
                  aria-label="Send message"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </SendButton>
              </ButtonGroup>
              <FileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
                aria-label="Upload file"
              />
            </StyledForm>
            
            {file && (
              <FilePreview className="file-preview-container">
                <FileInfo>
                  <FontAwesomeIcon icon={faImage} />
                  <span>{file.name}</span>
                </FileInfo>
                <RemoveFileButton 
                  onClick={handleRemoveFile}
                  aria-label="Remove file"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFileButton>
              </FilePreview>
            )}
          </InputContainer>
        </ChatArea>
        
        <SidebarArea $show={showSidebarContent}>
          <SidebarCloseButton 
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </SidebarCloseButton>
          {currentSidebarContent && (
            <SidebarContent 
              content={currentSidebarContent} 
              onQuestionSelect={handleSidebarQuestionSelect} 
            />
          )}
        </SidebarArea>
      </MainContent>
      
      {/* Add the Report Issue component with proper props */}
      <ReportIssue 
        show={showReportIssue} 
        onClose={handleCloseReportIssue} 
      />
      
      {/* Expanded image modal */}
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
            cursor: 'pointer'
          }}
          onClick={handleCloseExpandedImage}
          role="dialog"
          aria-label="Expanded image. Click anywhere to close."
        >
          <img 
            src={expandedImage} 
            alt="Expanded view" 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              border: '2px solid white',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
    </ChatContainer>
  );
};

export default EnhancedAIChat;
