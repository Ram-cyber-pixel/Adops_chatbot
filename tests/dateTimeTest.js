// Simple test runner for date/time functionality
const { 
  isDateTimeQuery, 
  extractDateTimeInfo, 
  generateDateTimeResponse, 
  marketDeadlineData, 
  uploadScheduleData 
} = require('../src/utils/dateTimeUtils');

// Test data
const testQueries = [
  "What is the schedule for yesterday?",
  "Tell me about deadlines for tomorrow",
  "What are the market deadlines for EST?",
  "Upload schedule for today",
  "What happened yesterday?",
  "What's due next Monday?",
  "Show me the schedule for 04/20/2025",
  "What are the deadlines for last week?",
  "Tell me about tomorrow's uploads",
  "What's the timing for Pacific timezone?"
];

// Run tests
console.log("===== DATE/TIME FUNCTIONALITY TESTS =====\n");

testQueries.forEach((query, index) => {
  console.log(`Test ${index + 1}: "${query}"`);
  
  // Test query detection
  const isDateTime = isDateTimeQuery(query);
  console.log(`Is date/time query: ${isDateTime}`);
  
  if (isDateTime) {
    // Test date/time extraction
    const dateTimeInfo = extractDateTimeInfo(query);
    console.log("Extracted info:", JSON.stringify(dateTimeInfo, null, 2));
    
    // Test response generation
    const dateTimeData = {
      marketDeadlines: marketDeadlineData,
      uploadSchedule: uploadScheduleData
    };
    
    const response = generateDateTimeResponse(query, dateTimeData);
    console.log("Generated response:", response.text);
    console.log(`Confidence: ${response.confidence}, Category: ${response.category || 'unknown'}`);
  }
  
  console.log("\n-----------------------------------\n");
});

console.log("===== TEST COMPLETE =====");
