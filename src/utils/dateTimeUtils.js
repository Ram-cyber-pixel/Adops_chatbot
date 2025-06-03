/**
 * Enhanced date and time utility functions for improved search capabilities
 */

/**
 * Checks if the input contains date or time related queries
 * @param {string} input - User input to check
 * @returns {boolean} - True if input appears to be date/time related
 */
export const isDateTimeQuery = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  const lowerInput = input.toLowerCase().trim();
  
  // Check for date/time keywords
  const dateTimeKeywords = [
    'date', 'time', 'deadline', 'schedule', 'when', 'hour', 'day', 
    'week', 'month', 'year', 'morning', 'afternoon', 'evening', 
    'night', 'today', 'tomorrow', 'yesterday', 'timezone', 'est', 
    'cst', 'mst', 'pst', 'edt', 'cdt', 'mdt', 'pdt', 'gmt', 'utc',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'last week', 'next week', 'last month', 'next month', 'last year', 'next year'
  ];
  
  // Check for date/time patterns
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/,  // MM/DD/YYYY or DD/MM/YYYY
    /\d{1,2}-\d{1,2}-\d{2,4}/,    // MM-DD-YYYY or DD-MM-YYYY
    /\d{4}-\d{1,2}-\d{1,2}/,      // YYYY-MM-DD
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(st|nd|rd|th)?,? \d{4}\b/i, // Month DD, YYYY
    /\b\d{1,2}(st|nd|rd|th)? of (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*,? \d{4}\b/i // DD of Month, YYYY
  ];
  
  const timePatterns = [
    /\d{1,2}:\d{2}/,              // HH:MM
    /\d{1,2}(am|pm)/i,            // HHam/pm
    /\d{1,2} (am|pm)/i,           // HH am/pm
    /\d{1,2}:\d{2} (am|pm)/i,     // HH:MM am/pm
    /\d{1,2}:\d{2}:\d{2}/         // HH:MM:SS
  ];
  
  // Check for keyword matches
  const hasDateTimeKeyword = dateTimeKeywords.some(keyword => 
    lowerInput.includes(keyword)
  );
  
  // Check for pattern matches
  const hasDatePattern = datePatterns.some(pattern => 
    pattern.test(lowerInput)
  );
  
  const hasTimePattern = timePatterns.some(pattern => 
    pattern.test(lowerInput)
  );
  
  return hasDateTimeKeyword || hasDatePattern || hasTimePattern;
};

/**
 * Get date object for relative date terms
 * @param {string} term - Relative date term (e.g., "yesterday", "today")
 * @returns {Date|null} - Date object or null if not a recognized term
 */
export const getRelativeDateObject = (term) => {
  if (!term) return null;
  
  const lowerTerm = term.toLowerCase().trim();
  const today = new Date();
  
  switch (lowerTerm) {
    case 'today':
      return today;
    
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday;
    
    case 'tomorrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    
    case 'last week':
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      return lastWeek;
    
    case 'next week':
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    
    case 'last month':
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      return lastMonth;
    
    case 'next month':
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return nextMonth;
    
    default:
      // Check for day of week
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayIndex = daysOfWeek.indexOf(lowerTerm);
      
      if (dayIndex !== -1) {
        const targetDay = new Date(today);
        const currentDay = today.getDay();
        const daysToAdd = (dayIndex + 7 - currentDay) % 7;
        
        // If today is the target day, return today
        if (daysToAdd === 0) {
          return today;
        }
        
        targetDay.setDate(today.getDate() + daysToAdd);
        return targetDay;
      }
      
      return null;
  }
};

/**
 * Format date object to string
 * @param {Date} date - Date object to format
 * @param {string} format - Format type ('short', 'medium', 'long')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date || !(date instanceof Date)) return '';
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: 'numeric' },
    medium: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };
  
  return date.toLocaleDateString('en-US', options[format] || options.medium);
};

/**
 * Extracts date and time information from user input
 * @param {string} input - User input text
 * @returns {Object} - Extracted date/time information
 */
export const extractDateTimeInfo = (input) => {
  if (!input || typeof input !== 'string') {
    return { hasDateTime: false };
  }
  
  const lowerInput = input.toLowerCase().trim();
  
  // Initialize result object
  const result = {
    hasDateTime: false,
    hasDate: false,
    hasTime: false,
    hasTimeZone: false,
    hasRelativeDate: false,
    dateText: null,
    timeText: null,
    timeZone: null,
    relativeDate: null,
    dateObject: null,
    query: lowerInput
  };
  
  // Check for relative date terms
  const relativeDateTerms = [
    'today', 'yesterday', 'tomorrow', 
    'last week', 'next week', 'last month', 'next month',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  for (const term of relativeDateTerms) {
    if (lowerInput.includes(term)) {
      result.hasRelativeDate = true;
      result.relativeDate = term;
      result.dateObject = getRelativeDateObject(term);
      result.dateText = result.dateObject ? formatDate(result.dateObject) : term;
      result.hasDate = true;
      break;
    }
  }
  
  // If no relative date found, extract explicit date patterns
  if (!result.hasRelativeDate) {
    const datePatterns = [
      { regex: /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/, format: 'MM/DD/YYYY' },
      { regex: /\b(\d{1,2})-(\d{1,2})-(\d{2,4})\b/, format: 'MM-DD-YYYY' },
      { regex: /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/, format: 'YYYY-MM-DD' },
      { regex: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})(st|nd|rd|th)?,? (\d{4})\b/i, format: 'Month DD, YYYY' },
      { regex: /\b(\d{1,2})(st|nd|rd|th)? of (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*,? (\d{4})\b/i, format: 'DD of Month, YYYY' }
    ];
    
    for (const pattern of datePatterns) {
      const match = lowerInput.match(pattern.regex);
      if (match) {
        result.hasDate = true;
        result.dateText = match[0];
        
        // Try to create a date object from the matched text
        try {
          if (pattern.format === 'MM/DD/YYYY') {
            const [_, month, day, year] = match;
            result.dateObject = new Date(year.length === 2 ? `20${year}` : year, month - 1, day);
          } else if (pattern.format === 'YYYY-MM-DD') {
            const [_, year, month, day] = match;
            result.dateObject = new Date(year, month - 1, day);
          }
        } catch (e) {
          // If date parsing fails, just use the text
        }
        
        break;
      }
    }
  }
  
  // Extract time patterns
  const timePatterns = [
    { regex: /\b(\d{1,2}):(\d{2})(:(\d{2}))?\b/, format: 'HH:MM(:SS)' },
    { regex: /\b(\d{1,2})(am|pm)\b/i, format: 'HHam/pm' },
    { regex: /\b(\d{1,2}) (am|pm)\b/i, format: 'HH am/pm' },
    { regex: /\b(\d{1,2}):(\d{2}) (am|pm)\b/i, format: 'HH:MM am/pm' }
  ];
  
  for (const pattern of timePatterns) {
    const match = lowerInput.match(pattern.regex);
    if (match) {
      result.hasTime = true;
      result.timeText = match[0];
      break;
    }
  }
  
  // Extract timezone patterns
  const timeZonePatterns = [
    { regex: /\b(est|edt|eastern)\b/i, zone: 'Eastern' },
    { regex: /\b(cst|cdt|central)\b/i, zone: 'Central' },
    { regex: /\b(mst|mdt|mountain)\b/i, zone: 'Mountain' },
    { regex: /\b(pst|pdt|pacific)\b/i, zone: 'Pacific' },
    { regex: /\b(gmt|utc)([+-]\d{1,2})?\b/i, zone: 'GMT' }
  ];
  
  for (const pattern of timeZonePatterns) {
    const match = lowerInput.match(pattern.regex);
    if (match) {
      result.hasTimeZone = true;
      result.timeZone = pattern.zone;
      break;
    }
  }
  
  // Set overall hasDateTime flag
  result.hasDateTime = result.hasDate || result.hasTime || result.hasTimeZone || result.hasRelativeDate;
  
  return result;
};

/**
 * Generates a response for date/time related queries
 * @param {string} input - User input text
 * @param {Object} dateTimeData - Date/time reference data
 * @returns {Object} - Response object with text and metadata
 */
export const generateDateTimeResponse = (input, dateTimeData) => {
  if (!input || !dateTimeData) {
    return {
      text: "I couldn't find specific date or time information for your query. Could you provide more details?",
      confidence: 0.5
    };
  }
  
  const dateTimeInfo = extractDateTimeInfo(input);
  
  if (!dateTimeInfo.hasDateTime) {
    return {
      text: "I couldn't identify any specific date or time in your query. Could you rephrase your question?",
      confidence: 0.5
    };
  }
  
  // Handle relative date queries specifically
  if (dateTimeInfo.hasRelativeDate) {
    const formattedDate = dateTimeInfo.dateObject ? formatDate(dateTimeInfo.dateObject, 'long') : dateTimeInfo.relativeDate;
    
    // Check if it's a query about schedules for a specific day
    if (input.toLowerCase().includes('schedule') || input.toLowerCase().includes('upload')) {
      return {
        text: `Upload schedule for ${formattedDate}:\n\n${dateTimeData.uploadSchedule}\n\nNote: This is the standard schedule. For specific adjustments on ${formattedDate}, please check with your team lead.`,
        confidence: 0.9,
        category: 'schedule'
      };
    }
    
    // Check if it's a query about deadlines for a specific day
    if (input.toLowerCase().includes('deadline') || input.toLowerCase().includes('due')) {
      const allDeadlines = Object.entries(dateTimeData.marketDeadlines)
        .map(([zone, time]) => `${zone}: ${time}`)
        .join('\n');
      
      return {
        text: `Market deadlines for ${formattedDate}:\n\n${allDeadlines}\n\nNote: These are the standard deadlines. For specific adjustments on ${formattedDate}, please check with your team lead.`,
        confidence: 0.9,
        category: 'deadline'
      };
    }
    
    // General response for relative date queries
    return {
      text: `For ${formattedDate}`,
      confidence: 0.8,
      category: 'datetime'
    };
  }
  
  // Check for market deadline queries
  // if (input.toLowerCase().includes('deadline') || 
  //     input.toLowerCase().includes('market') || 
  //     input.toLowerCase().includes('timing')) {
    
    // If timezone is specified, prioritize that information
    // if (dateTimeInfo.hasTimeZone) {
    //   const timezone = dateTimeInfo.timeZone;
    //   const timezoneData = dateTimeData.marketDeadlines[timezone];
      
    //   if (timezoneData) {
    //     return {
    //       text: `Market deadline for ${timezone} timezone: ${timezoneData}`,
    //       confidence: 0.9,
    //       category: 'deadline'
    //     };
    //   }
    // }
    
    // If no specific timezone or timezone not found, return all deadlines
    // const allDeadlines = Object.entries(dateTimeData.marketDeadlines)
    //   .map(([zone, time]) => `${zone}: ${time}`)
    //   .join('\n');
    
  //   return {
  //     text: `Market deadlines for various time zones:\n\n${allDeadlines}`,
  //     confidence: 0.9,
  //     category: 'deadline'
  //   };
  // }
  
  // Check for upload schedule queries
  if (input.toLowerCase().includes('upload') || 
      input.toLowerCase().includes('schedule')) {
    
    // If date is specified, prioritize that information
    if (dateTimeInfo.hasDate) {
      const dateText = dateTimeInfo.dateObject 
        ? formatDate(dateTimeInfo.dateObject, 'long')
        : dateTimeInfo.dateText;
        
      return {
        text: `Upload schedule for ${dateText}:\n\n${dateTimeData.uploadSchedule}\n\nNote: This is the standard schedule. For specific adjustments on ${dateText}, please check with your team lead.`,
        confidence: 0.8,
        category: 'schedule'
      };
    }
    
    // If no specific date, return general upload schedule
    return {
      text: dateTimeData.uploadSchedule || "Upload schedule information is not available. Please contact your team lead for the current schedule.",
      confidence: 0.8,
      category: 'schedule'
    };
  }
  
  // Default response for other date/time queries
  if (dateTimeInfo.hasDate) {
    const dateText = dateTimeInfo.dateObject 
      ? formatDate(dateTimeInfo.dateObject, 'long')
      : dateTimeInfo.dateText;
      
    return {
      text: `For ${dateText},standard business operations apply. You can ask about specific schedules, deadlines, or other time-sensitive information for this date.`,
      confidence: 0.7,
      category: 'datetime'
    };
  }
  
  return {
    text: "I found date or time information in your query, but I'm not sure what specific information you're looking for. You can ask about market deadlines, upload schedules, or other time-sensitive processes.",
    confidence: 0.6,
    category: 'datetime'
  };
};

/**
 * Market deadline data for various time zones
 */
export const marketDeadlineData = {
  // Eastern: "5:00 PM EST / 4:00 PM EDT",
  // Central: "4:00 PM CST / 3:00 PM CDT",
  // Mountain: "3:00 PM MST / 2:00 PM MDT",
  // Pacific: "2:00 PM PST / 1:00 PM PDT",
  // GMT: "10:00 PM GMT / 9:00 PM BST"
};

/**
 * Upload schedule data
 */
export const uploadScheduleData = 
  "Standard Upload Schedule:\n\n" +
  "- National Uploads: Monday-Friday, 9:00 AM - 3:00 PM EST\n" +
  "- Retail Uploads: Monday-Friday, 10:00 AM - 4:00 PM EST\n" +
  "- Enterprise Uploads: Tuesday-Thursday, 11:00 AM - 2:00 PM EST\n\n" +
  "Note: Special handling is required for uploads outside of these windows.";
