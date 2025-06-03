/**
 * Enhanced process search utility functions
 */
/**
 * Checks if the input contains process-related queries
 * @param {string} input - User input to check
 * @returns {boolean} - True if input appears to be process-related
 */
export const isProcessQuery = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  const lowerInput = input.toLowerCase().trim();
  
  // Check for process keywords
  const processKeywords = [
    'process', 'processes', 'procedure', 'procedures', 'workflow', 
    'workflows', 'steps', 'protocol', 'protocols', 'operation', 
    'operations', 'method', 'methods', 'system', 'systems',
    'how to', 'how do', 'what is the process', 'what are the steps',
    'give me', 'show me', 'tell me'
  ];
  
  // Check for keyword matches
  return processKeywords.some(keyword => 
    lowerInput.includes(keyword)
  );
};

/**
 * Process data for various organizational processes
 */
export const processData = {
  "adCopyQC": {
    "name": "Ad Copy QC",
    "description": "Quality control process for advertisement copy",
    "steps": [
      "**QC Ticket Processing Steps**\n\n**Step 1:**\n- Retrieve tickets from the mail.\n- Record the ticket number and type in your personal ticket tracking system.\n\n**Step 2:**\n- Copy the ticket number and paste it into the Team Support ticket search.\n\n**Step 3:**\n- Click on the ticket number displayed below to access the Ticket.\n\n**Step 4:**\n- Update the status from QC Team to QC In Progress and include your initials.\n- Refresh the ticket to preserve the status and initials.\n\n**Step 5:**\n- Retrieve the attachments from the ticket labeled 'Copy instructions.'\n- Compare the instructions with the copy and date entered in XG.\n- If instructions are missing, check for screenshots or spot details in the ticket body, or add a private note requesting traffic instructions.\n- Confirm that the estimate and customer name align with the ticket.\n\n**Step 6:**\n- Copy the customer's name from the ticket header, then click the cancel button.\n- Ensure the name is copied before canceling, as it cannot be retrieved again.\n\n**Step 7:**\n- Input the estimate (EST), client name, system code, and database into the team support search to check for duplicate tickets.\n- If duplicates exist, add a private action and proceed with closing the duplicate ticket.\n\n**Step 8:**\n- If no duplicates exist, access the XG and CHI databases.\n\n**Step 9:**\n- Log into the database and navigate to the orders page.\n\n**Step 10:**\n- Select the orders tab and click on orders again.\n\n**Step 11:**\n- Check the active checkbox to display only active orders.\n- Verify if any orders are missing.",
        "\n**Step 12:**\n- Enter the customer's name into the filter field and press the search button.\n- For specific clients like FORD, Volkswagen, Stellantis, and BPG LMA, search using the estimate as client names may vary in XG.\n\n**Step 13:**\n- Investigate if any orders are missing and verify alignment with ticket and copy instructions.\n- Click on the order number.\n\n**Step 14:**\n- Confirm the order number, PO - Ampersand number, and TIM - contract estimate in the XG profile match the ticket.\n- Ensure the product and client codes align with the guidelines.\n\n**Step 15:**\n- Verify the order lines status as SC – Scheduled and AP – Approved.\n- For SP – Suspended, indicate the order is no longer valid.\n- For PR – Pending Response, wait for approval or add a private note if approval exceeds one hour.\n\n**Step 16:**\n- Verify the system code (Reg/Ret) against the master syscode list.",
        "\n**Step 17:**\n- Click the View button to navigate to the ISCI page.\n\n**Step 18:**\n- Verify the client ID and estimate mentioned in the ISCI description align with the ticket.\n\n**Step 19:**\n- Verify spots with NE***** numbers (not DA spots).\n- Confirm ISCI/title, dates, spot length, rotations/weights, and ensure they run as per instructions.\n- Handle date conflicts or missing instructions appropriately.\n\n**Step 20:**\n- If everything looks good, change the QC classification to NA and update the status to Complete.\n\n**Weights:**\n- For equal rotation, the weight will be 1.\n- Each ISCI will have 100% rotation."
    ],
    "keywords": ["ad copy", "ad copy qc", "qc", "copy qc", "ad", "copy"]
  },

  "retailAdCopyQC": {
    "name": "Retail Ad Copy QC",
    "description": "Quality control process for retail advertisement copy",
    "steps": [
      "Receive retail ad copy",
      "Verify pricing and promotion details",
      "Check for compliance with retail guidelines",
      "Validate technical specifications",
      "Approve or return with feedback"
    ],
    "keywords": ["retail ad copy", "retail quality control", "retail verification", "retail qc"]
  },
  "enterpriseQC": {
    "name": "Enterprise QC",
    "description": "Quality control process for enterprise clients",
    "steps": [
      "Receive enterprise content",
      "Perform comprehensive compliance check",
      "Validate against enterprise SLAs",
      "Conduct technical verification",
      "Generate QC report",
      "Approve or escalate issues"
    ],
    "keywords": ["enterprise qc", "enterprise quality", "enterprise verification", "enterprise compliance"]
  },
  "nationalUploads": {
    "name": "National Uploads",
    "description": "Process for uploading national advertisements",
    "steps": [
      "Receive approved national ad content",
      "Prepare content for upload",
      "Verify target markets and networks",
      "Schedule upload according to deadlines",
      "Execute upload process",
      "Verify successful upload",
      "Generate upload report"
    ],
    "keywords": ["national upload", "national ad upload", "upload national", "national content upload"]
  },
  "retailUploads": {
    "name": "Retail Uploads",
    "description": "Process for uploading Retail Coding & Uploads",
    "steps": [
      "Procedure for Handling Retail Coding and Uploads Tickets\n\n1. **Assign Ownership**: Immediately assign the ticket to yourself by changing the status from Unassigned on the right-hand side of the ticket.\n\n2. **Set the Due Date & Severity**:\n   - Check the attachment or template for the start date.\n   - Verify if the request was received before the deadline.\n   - If received **on time**, set the due date based on the start date provided.\n   - If received **after the deadline**, set the due date to the next applicable deadline.\n   - Code the **Severity** as:\n     - **Deadline**\n     - **Next**\n     - **Future**\n\n3. **Select the Ticket Type**: Select and code the appropriate **Ticket Type**.\n\n4. **TIM and Deal ID**: Enter all the **TIM numbers** and **Deal IDs** in the **TIM field**, referencing the ticket, template, or traffic details.\n\n5. **Duplicate Check**: Review and verify that the ticket is **not a duplicate** of an existing one.\n\n6. **Ad Copy Type**: Determine and code the **Ad Copy Type** as either:\n   - **New**\n   - **Revised**\n\n7. **Populate Header**: Fill in the header field with the following details:\n   - **EST**\n   - **Client ID**\n   - **Client Name**\n\n8. **EST and Time Zone**: Enter the **EST field** and ensure the **correct Time Zone** is selected.\n\n9. **Match Spots in Inncreative**:\n   - **Linear & Digital Ad Copy Tickets**: Spot matching is **not required**.\n   - **Other Ticket Types**:\n     - Open Inncreative and navigate to the relevant Ad Copy group.\n     - Enter the **TIM number** in the **OMS Number** field.\n     - Use the Library option and click the **plus icon** (Add to Library).\n     - Search for the spot by entering the ISCI or Media Title in the search field.\n     - Ensure there are no special characters or extra spaces in the search query.\n     - Click the **Search** button to display matching spots.\n     - Verify the spot matches the ticket's instructions.\n     - Select the correct spot by checking the box next to it.\n     - Finalize the addition by clicking the **Plus icon** at the bottom right corner.\n\n10. **Ticket Status Updates**: Before updating the ticket status to **Ready for Processing** or **CSM Code Digital**, ensure that all required steps have been completed and verified.\n\n    **Status Update Scenarios**:\n    - **Spot Expired or Unavailable**: If the spot has expired or cannot be located, update the ticket status from **Coding in Progress** to **Pending Content**.\n    - **No Contract or Missing Information**: If there is no contract, no orders to display, or no ad copy group available, update the status to **Pending No Contract**.\n    - **Due Date Confirmation Required**: If the due date needs to be confirmed, update the status to **CSM Code**."
    ],
    "keywords": ["retail upload", "retail ad copy upload", "upload retail", "retail coding", "retailupload"]
  },
  "enterpriseUploads": {
    "name": "Enterprise Uploads",
    "description": "Process for uploading enterprise client content",
    "steps": [
      "Receive approved enterprise content",
      "Prepare content according to enterprise specifications",
      "Verify target platforms and networks",
      "Schedule upload according to SLAs",
      "Execute upload process with priority handling",
      "Perform post-upload verification",
      "Generate detailed upload report",
      "Notify enterprise client"
    ],
    "keywords": ["enterprise upload", "enterprise content upload", "upload enterprise", "enterprise ad upload"]
  },
  "fulfillmentDigital": {
    "name": "Fulfillment Digital",
    "description": "Digital content fulfillment process",
    "steps": [
      "Receive digital fulfillment request",
      "Verify content availability",
      "Prepare content for digital platforms",
      "Schedule fulfillment according to deadlines",
      "Execute digital delivery",
      "Verify successful fulfillment",
      "Generate fulfillment report"
    ],
    "keywords": ["digital fulfillment", "fulfillment digital", "digital delivery", "content fulfillment"]
  },
  "screenshot": {
    "name": "Screenshot",
    "description": "Process for capturing and delivering advertisement screenshots",
    "steps": [
      "Receive screenshot request",
      "Verify advertisement details and broadcast schedule",
      "Schedule screenshot capture",
      "Capture screenshot during broadcast",
      "Process and optimize screenshot",
      "Deliver screenshot to client",
      "Archive screenshot for records"
    ],
    "keywords": ["screenshot", "screen capture", "ad screenshot", "broadcast capture"]
  },
  "laCoding": {
    "name": "LA Coding",
    "description": "Process for coding advertisements for Los Angeles market",
    "steps": [
      "Receive LA coding request",
      "Verify advertisement specifications",
      "Apply LA-specific coding parameters",
      "Validate coding against LA requirements",
      "Generate coding report",
      "Submit coded content for upload"
    ],
    "keywords": ["la coding", "los angeles coding", "la market coding", "coding la"]
  }
};

/**
 * Extracts process information from user input
 * @param {string} input - User input text
 * @returns {Object} - Extracted process information
 */
export const extractProcessInfo = (input) => {
  if (!input || typeof input !== 'string') {
    return { hasProcess: false };
  }
  
  const lowerInput = input.toLowerCase().trim();
  
  // Initialize result object
  const result = {
    hasProcess: false,
    processName: null,
    isDetailRequest: false,
    isStepsRequest: false,
    query: lowerInput
  };
  
  // Check for specific step requests first
  if (lowerInput.includes("step") || 
      lowerInput.includes("how to") || 
      lowerInput.includes("procedure") || 
      lowerInput.includes("workflow") ||
      (lowerInput.includes("give me") && (lowerInput.includes("steps") || lowerInput.includes("process")))) {
    result.isStepsRequest = true;
  }
  
  // Check for retail uploads specifically
  if ((lowerInput.includes("retail") && lowerInput.includes("upload")) || 
      lowerInput.includes("retailupload") || 
      lowerInput.includes("retail upload") || 
      (lowerInput.includes("retail") && lowerInput.includes("coding"))) {
    result.hasProcess = true;
    result.processName = "retailUploads";
    return result;
  }
  
  // Check for ad copy qc specifically
  if ((lowerInput.includes("ad copy") || lowerInput.includes("ad copy qc") || 
       lowerInput.includes("copy qc") || 
       (lowerInput.includes("ad") && lowerInput.includes("qc"))) && 
      !lowerInput.includes("retail")) {
    result.hasProcess = true;
    result.processName = "adCopyQC";
    return result;
  }
  
  // Check for national uploads specifically
  if ((lowerInput.includes("national") && lowerInput.includes("upload")) || 
      lowerInput.includes("national upload")) {
    result.hasProcess = true;
    result.processName = "nationalUploads";
    return result;
  }
  
  // Check for enterprise uploads specifically
  if ((lowerInput.includes("enterprise") && lowerInput.includes("upload")) || 
      lowerInput.includes("enterprise upload")) {
    result.hasProcess = true;
    result.processName = "enterpriseUploads";
    return result;
  }
  
  // Check for enterprise QC specifically
  if ((lowerInput.includes("enterprise") && lowerInput.includes("qc")) || 
      lowerInput.includes("enterprise quality")) {
    result.hasProcess = true;
    result.processName = "enterpriseQC";
    return result;
  }
  
  // Check for retail ad copy QC specifically
  if ((lowerInput.includes("retail") && lowerInput.includes("ad") && lowerInput.includes("copy")) || 
      (lowerInput.includes("retail") && lowerInput.includes("qc"))) {
    result.hasProcess = true;
    result.processName = "retailAdCopyQC";
    return result;
  }
  
  // Check for digital fulfillment specifically
  if ((lowerInput.includes("fulfillment")) || 
      lowerInput.includes("fulfillment digital")) {
    result.hasProcess = true;
    result.processName = "fulfillmentDigital";
    return result;
  }
  
  // Check for screenshot specifically
  if (lowerInput.includes("screenshot") || 
      (lowerInput.includes("screen") && lowerInput.includes("capture"))) {
    result.hasProcess = true;
    result.processName = "screenshot";
    return result;
  }
  
  // Check for LA coding specifically
  if ((lowerInput.includes("la") && lowerInput.includes("coding")) || 
      lowerInput.includes("los angeles coding")) {
    result.hasProcess = true;
    result.processName = "laCoding";
    return result;
  }
  
  // If no specific process was identified through direct checks, try keywords
  for (const [processId, process] of Object.entries(processData)) {
    // Check if any of the process keywords are in the input
    if (process.keywords && process.keywords.some(keyword => lowerInput.includes(keyword))) {
      result.hasProcess = true;
      result.processName = processId;
      break;
    }
    
    // Also check if the process name itself is in the input
    if (lowerInput.includes(process.name.toLowerCase())) {
      result.hasProcess = true;
      result.processName = processId;
      break;
    }
  }
  
  // Check if this is a request for detailed information
  if (lowerInput.includes("detail") || 
      lowerInput.includes("explain") || 
      lowerInput.includes("tell me about") || 
      lowerInput.includes("what is")) {
    result.isDetailRequest = true;
  }
  
  // If no specific process was identified but it's a general process query
  if (!result.hasProcess && isProcessQuery(input)) {
    result.hasProcess = true;
    result.isGeneralProcessQuery = true;
  }
  
  return result;
};

/**
 * Generates a response for process-related queries
 * @param {string} input - User input text
 * @returns {Object} - Response object with text and metadata
 */
export const generateProcessResponse = (input) => {
  if (!input) {
    return {
      text: "I couldn't determine which process you're asking about. We have various processes including Ad Copy QC, Retail Uploads, Enterprise QC, and more. Could you specify which process you're interested in?",
      confidence: 0.5
    };
  }
  
  const processInfo = extractProcessInfo(input);
  
  // Special handling for retail uploads steps
  if ((input.toLowerCase().includes("retail") && input.toLowerCase().includes("upload") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("retailupload") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("retail") && input.toLowerCase().includes("coding") && input.toLowerCase().includes("steps"))) {
    
    const retailUploadsProcess = processData["retailUploads"];
    if (retailUploadsProcess && Array.isArray(retailUploadsProcess.steps)) {
      let response = `Here are the detailed steps for the ${retailUploadsProcess.name} process:\n\n`;
      response += retailUploadsProcess.steps.join("\n\n");
      
      return {
        text: response,
        confidence: 0.95,
        category: 'process'
      };
    }
  }
  
  // Special handling for ad copy qc steps
  if ((input.toLowerCase().includes("ad copy qc") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("ad copy") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("copy qc") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("ad") && input.toLowerCase().includes("qc") && input.toLowerCase().includes("steps") && !input.toLowerCase().includes("retail"))) {
    
    const adCopyQCProcess = processData["adCopyQC"];
    if (adCopyQCProcess && Array.isArray(adCopyQCProcess.steps)) {
      let response = `Here are the detailed steps for the ${adCopyQCProcess.name} process:\n\n`;
      response += adCopyQCProcess.steps.join("\n\n");
      
      return {
        text: response,
        confidence: 0.95,
        category: 'process'
      };
    }
  }
  
  // Special handling for national uploads steps
  if ((input.toLowerCase().includes("national") && input.toLowerCase().includes("upload") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("national upload") && input.toLowerCase().includes("steps"))) {
    
    const nationalUploadsProcess = processData["nationalUploads"];
    if (nationalUploadsProcess && Array.isArray(nationalUploadsProcess.steps)) {
      let response = `Here are the detailed steps for the ${nationalUploadsProcess.name} process:\n\n`;
      
      // Format steps with numbers
      nationalUploadsProcess.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      
      return {
        text: response,
        confidence: 0.95,
        category: 'process'
      };
    }
  }
  
  // Special handling for enterprise uploads steps
  if ((input.toLowerCase().includes("enterprise") && input.toLowerCase().includes("upload") && input.toLowerCase().includes("steps")) ||
      (input.toLowerCase().includes("enterprise upload") && input.toLowerCase().includes("steps"))) {
    
    const enterpriseUploadsProcess = processData["enterpriseUploads"];
    if (enterpriseUploadsProcess && Array.isArray(enterpriseUploadsProcess.steps)) {
      let response = `Here are the detailed steps for the ${enterpriseUploadsProcess.name} process:\n\n`;
      
      // Format steps with numbers
      enterpriseUploadsProcess.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      
      return {
        text: response,
        confidence: 0.95,
        category: 'process'
      };
    }
  }
  
  // // If it's a general process query without a specific process
  // if (processInfo.isGeneralProcessQuery && (!processInfo.processName || processInfo.processName === null)) {
  //   // List all available processes
  //   const allProcesses = Object.values(processData)
  //     .map(process => process.name)
  //     .join(", ");
    
  //   return {
  //     text: `I can provide information about the following processes: ${allProcesses}. Which one would you like to know more about?`,
  //     confidence: 0.8,
  //     category: 'process'
  //   };
  // }
  
  // If no specific process was identified
  if (!processInfo.hasProcess) {
    return {
      text: "I couldn't identify a specific process in your query. We have various processes including Ad Copy QC, Retail Uploads, Enterprise QC, and more. Could you specify which process you're interested in?",
      confidence: 0.5,
      category: 'process'
    };
  }
  
  // If a specific process was identified
  const process = processData[processInfo.processName];
  
  if (!process) {
    return {
      text: "I couldn't find information for that specific process. Please check the process name and try again.",
      confidence: 0.5,
      category: 'process'
    };
  }
  
  // Generate a response based on the request type
  let response = "";
  
  // If steps were requested or it's a "how to" query
  if (processInfo.isStepsRequest) {
    response = `Here are the detailed steps for the ${process.name} process:\n\n`;
    
    // Check if steps is an array
    if (Array.isArray(process.steps)) {
      // If the steps array contains long text items (paragraphs), join them directly
      if (process.steps.some(step => step.length > 100)) {
        response += process.steps.join("\n\n");
      } else {
        // For shorter steps, format them with numbers
        process.steps.forEach((step, index) => {
          response += `${index + 1}. ${step}\n`;
        });
      }
    } else {
      response += "Steps information is not available in the expected format.";
    }
  } 
  // If details were requested
  else if (processInfo.isDetailRequest) {
    response = `${process.name}: ${process.description}\n\n`;
    
    // Add a summary of steps
    if (Array.isArray(process.steps)) {
      response += "Key steps include:\n";
      
      // If there are many steps or they're very long, summarize
      if (process.steps.length > 10 || process.steps.some(step => step.length > 200)) {
        // Take first few steps or summarize
        const stepsToShow = process.steps.slice(0, 5);
        stepsToShow.forEach((step, index) => {
          // For long steps, truncate them
          const displayStep = step.length > 100 ? step.substring(0, 100) + "..." : step;
          response += `${index + 1}. ${displayStep}\n`;
        });
        
        if (process.steps.length > 5) {
          response += `\n...and ${process.steps.length - 5} more steps.\n`;
          response += "\nTo see all steps in detail, ask 'What are the steps for " + process.name + "?'";
        }
      } else {
        // Show all steps if there aren't too many
        process.steps.forEach((step, index) => {
          response += `${index + 1}. ${step}\n`;
        });
      }
    } else {
      response += "Detailed steps information is not available.";
    }
  }
  // Default response with basic information
  else {
    response = `${process.name}: ${process.description}\n\n`;
    response += "To see the detailed steps for this process, you can ask 'What are the steps for " + process.name + "?'";
  }
  
  return {
    text: response,
    confidence: 0.9,
    category: 'process'
  };
};
