const questionAndAnswerData = {
  "question1": {
    description: "Is it mandatory to match Local ID with the spot as per recent update?",
    keywords: ["match local id", "spot as per recent update", "local id"],
    responses: [
      "Answer: Yes"
    ]
  },
  "question2": {
    description: "FOX DEPORTS is Spanish or English?",
    keywords: ["fox deports", "is fox deports spanish", "is fox deports english"],
    responses: [
      "Answer: FOX Deports is Spanish Spot"
    ]
  },
  "question3": {
    description: "Client: Alexander family requires QC, or can we close the ticket?",
    keywords: ["alexander family requires qc", "alexander require", "alexander family", "alexander family need qc"],
    responses: [
      "Answer: We need to push QC Team"
    ]
  },
  "question4": {
    description: "Do we handle tickets for small business?",
    keywords: ["small business", "small business ticket", "small business tickets"],
    responses: [
      "Answer: No, we don't handle small business tickets"
    ]
  },
  "question5": {
    description: "After the copy is applied in XG, what status should be updated in Team Support for the Deadline ticket if the validation indicates submit as Pending (OMS approval)?",
    keywords: ["team support", "deadline ticket", "status update", "XG", "validation", "oms approval", "pending", "complete"],
    responses: [
      "After the copy is applied in XG, the status that should be updated in Team Support for the Deadline ticket, if the validation indicates submit as Pending (OMS approval), is **Complete**."
    ]
  },
  "spanishNetworks": {
    description: "What are Spanish networks?",
    keywords: [ "gala", "span", "hispanic", "CCES", "CNNE", "DFAM", "DSE", "DXDE", "EACT", "ENES", "ESPD", "FOXD", "GALA", 
      "HITN", "HSTE", "HTV", "INF", "INFO", "LFTV", "LTN", "MCNL", "MMTV", "NGM", 
      "NOT1", "PASN", "SMEX", "TELS", "span nets","span networks"],
    responses: [
      "Answer: These are the Spanish Networks:\nCCES, CNNE, DFAM, DSE, DXDE, EACT, ENES, ESPD, FOXD, GALA, HITN, HSTE, HTV, INF, INFO, LFTV, LTN, MCNL, MMTV, NGM, NOT1, PASN, SMEX, TEAM, TELS"
    ]
  },
  "combinedBkDetails": {
      "description": "Combined details for Retail Uploads & QC rotations and National Bookend Pairing.",
      "keywords": [
        "retail uploads", "50,50", "33,33,33", "25,25,25,25", "20,20,20,20,20",
        "50,25,25", "25,25,50", "40,60", "40,30,30", "20,40,15,25", "33,33,34",
        "retail rotation", "15,20,15,30,20", "bk rotation", "retail bookend rotation", "rotation bk", "rotation retail",
        "national 50 50", "national 75 25", "national pairing", "national bookend pairing",
        "national 50 25 25", "national 33 33 33", "national 25 25 25 25", "bookend pairing"
      ],
    "responses": [
    "***Bookend Details***\n\n" +
    "**Retail Uploads & QC Rotations:**\n\n" +
    "| Rotation Type       | Pattern            |\n" +
    "|---------------------|--------------------|\n" +
    "|  50/50             | AB                 |\n" +
    "| 33/33/33           | AB BC CA           |\n" +
    "| 25/25/25/25        | AB CD              |\n" +
    "| 20/20/20/20/20     | AB BC CD DE EA     |\n" +
    "| 50/25/25           | AB AC              |\n" +
    "| 25/25/50           | CA CB              |\n\n" +
    "**Notes:**\n" +
    "- For the following rotations, add a note and confirm: 40/60, 40/30/30, 20/40/15/25, 15/20/15/30/20.\n" +
    "- If it is 33/33/34, apply it as 33/33/33.\n\n" +
    "**Bookend Pairing - National Uploads & QC:**\n\n" +
    "| Rotation Type       | Pattern            | Description                                                                 |\n" +
    "|---------------------|--------------------|-----------------------------------------------------------------------------|\n" +
    "| 50/50              | A/B                | Apply 'A' in the top title and 'B' in the bottom title.                     |\n" +
    "| 75/25              | AA/BB              | Apply 'A' in both the top and bottom titles, same for 'B'.                  |\n" +
    "| 50/25/25           | AA/BB/CC           | Same rule applies for 'A,' 'B,' and 'C'.                                    |\n" +
    "| 33/33/33           | AB/BC/CA           | Run 33% for AB, then BC, and CA.                                            |\n" +
    "| 25/25/25/25        | AB/CD              | Run 50% for AB, and 50% for CD.                                             |\n\n" +
    "**Notes:**\n" +
    "Unless otherwise specified, Bookend Pairing should follow the described rules."
  ]
    },
 
  "pushQcTeam": {
    description: "Clients' needs to push to QC Team.",
    keywords: ["qc team", "qc team client", "catdaa", "push qc", "clients qc team"],
    responses: [
      "Clients’ needs to push to QC Team:\n\n" +
      "- CATDAA\n" +
      "- CARDI’s FURNITURE\n" +
      "- JORDANS FURNITURE – HART/BOS\n" +
      "- NETDAA – BOS/BUR/SPR\n" +
      "- CAMBRIDGE PAVERS"
    ]
  },
  "secondQcNeeded": {
    description: "Tickets requiring 2nd QC push.",
    keywords: [
      "2nd qc needed","2nd qc", "ampersand political", "ampersand tune in", "ampersand vip", 
      "retail vip", "retail political", "second qc tickets"
    ],
    responses: [
      "Tickets to push for 2nd QC needed:\n\n" +
      "- Ampersand Political\n" +
      "- Ampersand Political Dish\n" +
      "- Ampersand Tune In\n" +
      "- Ampersand VIP\n\n" +
      "Tickets to push to QC Team (2nd QC needed):\n\n" +
      "- Retail VIP\n" +
      "- Retail Political"
    ]
  },
  spanishspot: {
    description: "should we need to apply spanish network for dish",
    keywords: ["dish spanish","dish"],
    responses: [
      "No, we don't apply spanish spot for DISH orders" 
    ]
  },
  starbox:{
    description:"should i need to follow the starbox instruction",
    keywords:["starbox instruction","starbox"],
    responses:[
      "If the dates are given in the starbox it must be followed\n\n Reference Ticket: 1938099\n\n***If the dates in the starbox is lesser than the dates given in the above instruction***\n\nCIOC should get confirmation from CSM"
    ]
  },
  "pst_deadline timings": {
  description: "Deadline market timings for various processes.",
  keywords: [ "pst market timing", "pst deadline timing","pst deadline time zone","pst"],
  responses: [
      " ***Deadline Market Timings***\n\n***PST Markets:***\n\n California\n\n Northwest\n\n**Instructions Deadline**\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 10:30 AM     |\n| PST       | 01:00 PM     |\n\n**Spot Received Time**\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 11:30 AM     |\n| PST       | 02:00 PM     |\n\n**Political Instruction Deadline**\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 02:30 PM     |\n| PST       | 05:00 PM     |\n\n https://images.pexels.com/photos/31645439/pexels-photo-31645439.jpeg"
  ]
},
"cst_deadline timings": {
  description: "Deadline market timings for various processes.",
  keywords: ["cst market timing", "cst deadline timing","cst deadline time zone","cst"],
  responses: [
    "***Deadline Market Timings***\n\n***CST Markets:***\n\nChat/Knox\n\nChicago\n\nNasville\n\nHouston\n\nJackson\n\nMemphis\n\nTwin Cities\n\n***Instructions Deadline***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 08:30        |\n| CST       | 11:00        ||\n\n***Spot Received Time***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 09:30        |\n| CST       | 12:00        ||\n\n***Political Instruction Deadline***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 12:30        |\n| CST       | 03:00 PM     || https://images.pexels.com/photos/31645439/pexels-photo-31645439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2.jpg",
  ]
},

"mst_deadline timings": {
  description: "Deadline market timings for various processes.",
  keywords: [ "mst market timing", "mst deadline timing","mst deadline time zone","mst"],
  responses: [
       " ***Deadline Market Timings***\n\n***MST Markets:***\n\nMountain\n\n ***Instructions Deadline***\n | Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 09:30        |\n| MST       | 12:00        ||\n\n***Spot Received Time***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 10:30        |\n| MST       | 13:00        ||\n\n***Political Instruction Deadline***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 13:30        |\n| MST       | 04:00 PM     || https://images.pexels.com/photos/31645439/pexels-photo-31645439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2.jpg",
  ]
},
"est_deadline timings": {
  description: "Deadline market timings for various processes.",
  keywords: ["est market timing", "est deadline timing","est deadline time zone","est"],
  responses: [
    " ***Deadline Market Timings***\n\n***EST Markets:***\n\nAtlanta\n\nJacksonville\n\nLiberty\n\nNew England\n\nNew York\n\nSarasota\n\nSouth Florida\n\nDetriot\n\nMid-atlantic\n\n***Instructions Deadline***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 07:30        |\n| EST       | 10:00        ||\n\n***Spot Received Time***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 08:30        |\n| EST       | 11:00        ||\n\n***Political Instruction Deadline***\n\n| Time Zone | Time (Local) |\n|-----------|--------------|\n| IST       | 11:30        |\n| EST       | 02:00 PM     || https://images.pexels.com/photos/31645439/pexels-photo-31645439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2.jpg",
  ]
},
vipclient:{
  description:"Vip clients National uploads",
  keywords:["vip client for national"],
  responses:[
    "***VIP CLIENT***\n\nPOINTSBET\n\nLINCOLN TECH\n\nCONTINUUM\n\nGOLDEN NUGGET\n\nBMG – AGENCY\n\nCALIFORNIA TOBACCO\n\nDUNCAN CHANNON\n\nCOVERED CALIFORNIA\n\nCALIFORNIA COVID\n\nINNOVASIAN\n\n98POINT 6\n\n***BETMGM is removed from the VIP CLIENT LIST***",
  ]
},
nationalcodingtiming:{
  description: "National coding timing for various processes.",
  keywords: ["national coding timing", "national coding time zone", "national coding"],
  responses: [

      "### Deadline & Timing Table by US Time Zone  \n\n#### ***Instructions Deadline***\n| Time Zone | IST   | EST   |\n|-----------|-------|-------|\n| EST       | 7:30  | 10:00 |\n| CST       | 8:30  | 11:00 |\n| MST       | 9:30  | 12:00 |\n| PST       | 10:30 | 13:00 |\n\n#### ***Spot Received Time***\n| Time Zone | IST   | EST   |\n|-----------|-------|-------|\n| EST       | 8:30  | 11:00 |\n| CST       | 9:30  | 12:00 |\n| MST       | 10:30 | 13:00 |\n| PST       | 11:30 | 14:00 |\n\n ***Ticket Complete Time***\n| Time Zone | IST           | EST   |\n|-----------|--------------|-------|\n| EST       | 10:30   | 1:00  |\n| CST       | 11:30   | 2:00  |\n| MST       | 12:30   | 3:00  |\n| PST       | 1:30    | 4:00  |\n\n#### ***Political Instruction Deadline***\n| Time Zone | IST   | EST      |\n|-----------|-------|----------|\n| EST       | 11:30 | 2:00 PM  |\n| CST       | 12:30 | 3:00 PM  |\n| MST       | 13:30 | 4:00 PM  |\n| PST       | 14:30 | 5:00 PM  |"

    ]
 
}

};


// Improved math calculator utilities
export const mathCalculator = {
add: (a, b) => a + b,
subtract: (a, b) => a - b,
multiply: (a, b) => a * b,
divide: (a, b) => b !== 0 ? a / b : "Cannot divide by zero",

// Parse a rotation string like "50/50" and verify it sums to 100
validateRotation: (rotationString) => {
  const percentages = rotationString.split('/').map(Number);
  const sum = percentages.reduce((acc, curr) => acc + curr, 0);
  return {
    isValid: sum === 100,
    values: percentages,
    sum: sum
  };
},

// Calculate how many spots need to be assigned for each percentage in a rotation
calculateSpotDistribution: (rotationString, totalSpots) => {
  const percentages = rotationString.split('/').map(Number);
  const distribution = percentages.map(percent => {
    const spots = Math.round((percent / 100) * totalSpots);
    return {
      percentage: percent,
      spots: spots
    };
  });
  
  // Verify the total spots assigned matches the input
  const totalAssigned = distribution.reduce((acc, curr) => acc + curr.spots, 0);
  const needsAdjustment = totalAssigned !== totalSpots;
  
  return {
    distribution,
    totalAssigned,
    needsAdjustment
  };
}
};

// Enhanced calculator function with better pattern matching
export const calculator = (expression) => {
try {
  // Remove all whitespace for consistent processing
  const sanitized = expression.replace(/\s+/g, '').replace(/[^0-9+\-*/.\(\)]/g, '');
  
  // Check if it's a simple binary operation
  if (/^[\d.]+[\+\-\*\/][\d.]+$/.test(sanitized)) {
    // Extract numbers and operator
    const match = sanitized.match(/^([\d.]+)([\+\-\*\/])([\d.]+)$/);
    if (!match) {
      return "Invalid expression format";
    }
    
    const [_, a, operator, b] = match;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (isNaN(numA) || isNaN(numB)) {
      return "Invalid numbers in expression";
    }
    
    switch (operator) {
      case '+': return mathCalculator.add(numA, numB);
      case '-': return mathCalculator.subtract(numA, numB);
      case '*': return mathCalculator.multiply(numA, numB);
      case '/': return mathCalculator.divide(numA, numB);
      default: return "Invalid operator";
    }
  } else {
    // More complex expressions
    try {
      // WARNING: This is not safe for production use - eval is dangerous
      // In a real app, use a proper math expression parser library
      // This is only for demonstration purposes
      const result = Function(`'use strict'; return (${sanitized})`)();
      return isNaN(result) ? "Invalid calculation" : result;
    } catch (error) {
      return "Complex expression format not supported. Use format: number operator number";
    }
  }
} catch (error) {
  return `Calculation error: ${error.message}`;
}
};

// Function to check if input is a math expression
export const isMathExpression = (input) => {
if (!input || typeof input !== 'string') return false;

// Clean up input and check for basic math pattern
const cleaned = input.trim().replace(/\s+/g, '');
return /^[\d.]+[\+\-\*\/][\d.]+$/.test(cleaned);
};

// Export the QA data as default and math utilities as named exports
export default questionAndAnswerData;