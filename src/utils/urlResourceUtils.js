/**
 * URL and resource utilities for enhanced search capabilities
 */
 
import roeData from "../data/roeData";
 
 
/**
 * Resource data with URLs for various categories
 */
export const resourceData = {
  // National upload resources
  nationalUploads: {
    "Daily Tracker": "https://onedrive.live.com/national-upload-templates",
    generallinks: [
      {
        Month: "January",
        title: "January National Upload Process",
        url: "https://comcastcorp-my.sharepoint.com/personal/kobili497_apac_comcast_com/_layouts/15/Doc.aspx?sourcedoc=%7B14fe5ed0-0f9b-451d-ab6a-08272320dd70%7D&action=view&wd=target%28January.one%7C82a90435-250f-4328-a02f-4e09ede84696%2F%29&wdorigin=717"
      },
      {
        Month: "february",
        title: "February Updated National Uploads",
        url: "https://comcastcorp-my.sharepoint.com/personal/kobili497_apac_comcast_com/_layouts/15/Doc.aspx?sourcedoc=%7B14fe5ed0-0f9b-451d-ab6a-08272320dd70%7D&action=view&wd=target%28February.one%7C9a031161-f5f4-4cae-8d21-6485c9227f5f%2F%29&wdorigin=717"
      },
      {
        Month: "march",
        title: "March Updated National Uploads",
        url: "https://comcastcorp-my.sharepoint.com/personal/kobili497_apac_comcast_com/_layouts/15/Doc.aspx?sourcedoc=%7B14fe5ed0-0f9b-451d-ab6a-08272320dd70%7D&action=view&wd=target%28March.one%7Cbc00e3a6-6d43-4d1e-9a93-7cb07ed89c54%2F%29&wdorigin=717"
      },
      {
        Month: "april",
        title: " April Updated National Uploads",
        url: "https://comcastcorp-my.sharepoint.com/personal/kobili497_apac_comcast_com/_layouts/15/Doc.aspx?sourcedoc=%7B14fe5ed0-0f9b-451d-ab6a-08272320dd70%7D&action=view&wd=target%28April.one%7C95307def-bd53-4e86-9b3e-63a30b7657fa%2F%29&wdorigin=717"
      },
    ]
  },
 
  // Retail upload resources
  retailUploads: {
    "Retail One Note": "https://onedrive.live.com/retail-uploads-main",
    "Retail Coding & Upload Tracker": "https://comcastcorp-my.sharepoint.com/:x:/g/personal/stanwe022_apac_comcast_com/Echt0s0l701Jq_XtLdEyeGgBxzdwxpGYOy43hjgwO5C0Ig?e=CDCCKF&CID=A28C9CBF-4B37-4566-832B-7F94EF8E1422&wdLOR=cD8A5997D-E8A8-4684-A47E-A53F06E6CD7A",
    generallinks: [
      {
        title: "Retail Upload onenote",
        url: "https://comcastcorp-my.sharepoint.com/:o:/r/personal/prajen532_apac_comcast_com/_layouts/15/Doc.aspx?sourcedoc=%7Bc64bfe3b-07ec-4ee0-b456-254b62cac535%7D&action=edit&wd=target(General%20Updates.one%7C482fbc44-1883-4270-a08b-ffdfea8af569%2FGeneral%20Updates%7Ccb4e4768-b80c-40f3-8910-f847be8e25f9%2F)&wdorigin=NavigationUrl"
      },
      {
        title: "New Updates in onenote-retail",
        url: "https://comcastcorp-my.sharepoint.com/:o:/g/personal/kg414_apac_comcast_com/EhvgtFX07TdDub9BgXmFzQIBjlnOA8O4A-XRyTAioQ7Ffw?e=2kgrvN"
      },
    ]
  },
  screenshot: {
    "Daily Tracker": "https://comcastcorp-my.sharepoint.com/:x:/r/personal/ssubra578_apac_comcast_com/Documents/Microsoft%20Teams%20Chat%20Files/Screenshot%20Tracker%20-%20Q2%202025%201.xlsx?d=w3fbe79c2d794415ead954db48c9f69e6&csf=1&web=1&e=CyiUOt",
    generallinks: [
      {
        title: "Onenote Screenshot",
        url: "https://comcastcorp.sharepoint.com/:w:/r/teams/AudienceDirect/Shared%20Documents/General/CIOC%20Screen%20Shot%20Process%20-%209.5.24.docx?d=w51f4f5e65ccb4e30bb9887f05bf150f0&csf=1&web=1&e=Es0bMh"
      },
    ]
  },  makegood: {
    "Daily Tracker": "https://comcastcorp-my.sharepoint.com/:x:/r/personal/ssubra578_apac_comcast_com/Documents/Microsoft%20Teams%20Chat%20Files/Screenshot%20Tracker%20-%20Q2%202025%201.xlsx?d=w3fbe79c2d794415ead954db48c9f69e6&csf=1&web=1&e=CyiUOt",
    generallinks: [
      {
        title: "Onenote Screenshot",
        url: "https://comcastcorp.sharepoint.com/:w:/r/teams/AudienceDirect/Shared%20Documents/General/CIOC%20Screen%20Shot%20Process%20-%209.5.24.docx?d=w51f4f5e65ccb4e30bb9887f05bf150f0&csf=1&web=1&e=Es0bMh"
      },
    ]
  },
 
  // QC resources
  qualityControl: {
    "Qc One Note": "https://onedrive.live.com/qc-main",
      generallinks: [
      {
        date: "2025-04-05",
        title: "New Quality Control Requirements",
        url: "https://onedrive.live.com/qc-requirements-2025"
      }
    ]
  },
  enterprise: {
    "Enterprise Qc Tracker": "https://comcastcorp-my.sharepoint.com/:x:/r/personal/kjeyar840_apac_comcast_com/Documents/Automated Trackers/ENT QC Productivity Tracker (Main Tracker).xlsm?d=we896d66bb8324df9b652e507621c9b97&csf=1&web=1&e=4J8xw4",
    "Enterprise uploads Tracker": "https://comcastcorp-my.sharepoint.com/:x:/r/personal/kjeyar840_apac_comcast_com/Documents/Automated Trackers/ENT Uploads Productivity Tracker (Main Tracker).xlsm?d=w9bc55fa30bd940afb9713740dc90b0d7&csf=1&web=1&e=pYK4vX",
    generallinks: [
      {
        title: "TEAM SUPPORT",
        url: "https://app.na3.teamsupport.com/"
      },
      {
        title: "Inncreative",
        url: "https://inncreative.comcast.com/#/acw/dashboard"
      },
      {
        title: "OneTim",
        url: "https://onetimprod.cable.comcast.com/OneTimMvc/OrderStatus"
      },
      {
        title: "XG",
        url: "https://comcastcorp.sharepoint.com/sites/xGLinear?xsdata=MDV8MDF8fDU3OWIwYjQyNWEwOTQ2Y2RkOTM3MDhkYjdiZWQxNDA5fDkwNmFlZmU5NzZhNzRmNjViODJkNWVjMjA3NzVkNWFhfDB8MHw2MzgyNDAwMzAzNzY3MTI1MDN8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxMMk5vWVhSekx6RTVPbTFsWlhScGJtZGZUWHBaTWsxNlRUTk5iVmwwV20xU2JFNURNREJaYWxrd1RGZEZOVTlIVFhSYVZHY3hXV3BaTlZwVVozaFBSMUY2UUhSb2NtVmhaQzUyTWk5dFpYTnpZV2RsY3k4eE5qZzROREEyTWpNM05EZzF8NzRlNDIzZjkxZjEzNDg5YmQ5MzcwOGRiN2JlZDE0MDl8OTUxN2ZlOTc4ZmZkNGRhNGE0MzgxZTYxNTM4MzJlY2Q%3D&sdata=UXplSWdaWTRHK3hZd2JWUTdZNzRxNUw4YkJybHA4WjEzenRuM1hPeXVhST0%3D&ovuser=906aefe9-76a7-4f65-b82d-5ec20775d5aa%2Cpdhars515%40apac.comcast.com&OR=Teams-HL&CT=1689859059739&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMzA2MTgwMTExNSIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D"
      }
    ]
  },fulfillmentDigital: {
    "Fulfillment Tracker": "https://comcastcorp-my.sharepoint.com/:x:/r/personal/mmanso012_apac_comcast_com/Documents/Fulfillment%20Tracker%20Q1%202025.xlsx?d=w7ae2354c01a84578a25772fa089e72b5&csf=1&web=1&e=Jzi8qN%22",
    generallinks: [
      {
        title: "Onenote Fullfillment Uploads",
        url: ""
      }
    ]
  },
 
 
  // System resources
  system: {
    main: "https://onedrive.live.com/system-main",
    userGuide: "https://onedrive.live.com/system-user-guide",
    troubleshooting: "https://onedrive.live.com/system-troubleshooting",
    updates: "https://onedrive.live.com/system-updates",
    generallinks: [
      {
        date: "2025-03-28",
        title: "System Maintenance Notice",
        url: "https://onedrive.live.com/system-maintenance-april"
      }
    ]
  }
};
 
/**
 * Checks if the input is requesting URL or resource information
 * @param {string} input - User input to check
 * @returns {boolean} - True if input is requesting URL information
 */
export const isUrlResourceQuery = (input) => {
  if (!input || typeof input !== 'string') return false;
 
  const lowerInput = input.toLowerCase().trim();
 
  // Check for URL and resource keywords
  const urlKeywords = [
    'url', 'link', 'national onenote', 'sharepoint', 'share point',
    'resource', 'resources', 'document', 'documents', 'file', 'files',
    'guide', 'guidelines', 'template', 'templates', 'training',
    'national daily tracker','daily tracker','national onenote link','retail onenote link','retail onenote','ss onenote','ss daily tracker','screenshot onenote','screenshot daily tracker','screenshot tracker','enterprise links', 'fulfillment', "fulfillmentDigital"
  ];
 
  // Check for category keywords
  const categoryKeywords = [
    'national', 'retail', 'qc', 'quality control',
    'upload', 'uploads','screenshot', 'ss', 'enterprise links', 'fulfillment'
  ];
 
  // Check for keyword matches
  const hasUrlKeyword = urlKeywords.some(keyword =>
    lowerInput.includes(keyword)
  );
 
  const hasCategoryKeyword = categoryKeywords.some(keyword =>
    lowerInput.includes(keyword)
  );
 
  return hasUrlKeyword && hasCategoryKeyword;
};
 
/**
 * Extracts category information from user input
 * @param {string} input - User input text
 * @returns {Object} - Extracted category information
 */
export const extractCategoryInfo = (input) => {
  if (!input || typeof input !== 'string') {
    return { hasCategory: false };
  }
 
  const lowerInput = input.toLowerCase().trim();
 
  // Initialize result object
  const result = {
    hasCategory: false,
    category: null,
    resourceType: null,
    wantsGeneralLinks: false
  };
 
  // Check for category matches
  if (lowerInput.includes('national') ||
      (lowerInput.includes('national') && lowerInput.includes('upload'))) {
    result.hasCategory = true;
    result.category = 'nationalUploads';
  } else if (lowerInput.includes('retail') ||
            (lowerInput.includes('retail') && lowerInput.includes('upload'))) {
    result.hasCategory = true;
    result.category = 'retailUploads';
  } else if (lowerInput.includes('qc') || lowerInput.includes('quality control')) {
    result.hasCategory = true;
    result.category = 'qualityControl';
  }else if (lowerInput.includes('ss') || lowerInput.includes('screenshot')) {
    result.hasCategory = true;
    result.category = 'screenshot';
  } else if (lowerInput.includes('training') && !lowerInput.includes('upload')) {
    result.hasCategory = true;
    result.category = 'training';
  } else if (lowerInput.includes('enterprise links') || lowerInput.includes('enterprise upload')) {
    result.hasCategory = true;
    result.category = 'enterprise';
  } else if (lowerInput.includes('fulfillment') ||lowerInput.includes('fullfillment')) {
    result.hasCategory = true;
    result.category = 'fulfillmentDigital';
  }else if (lowerInput.includes('system')) {
    result.hasCategory = true;
    result.category = 'system';
  } else if (lowerInput.includes('upload') || lowerInput.includes('uploads')) {
    // Default to national uploads if just "upload" is mentioned
    result.hasCategory = true;
    result.category = 'nationalUploads';
  }
 
  // Check for resource type
  if (lowerInput.includes('template')) {
    result.resourceType = 'templates';
  } else if (lowerInput.includes('guideline') || lowerInput.includes('guide')) {
    result.resourceType = 'guidelines';
  } else if (lowerInput.includes('schedule')) {
    result.resourceType = 'schedules';
  } else if (lowerInput.includes('training') && result.category !== 'training') {
    result.resourceType = 'training';
  } else if (lowerInput.includes('checklist') && result.category === 'qualityControl') {
    result.resourceType = 'checklists';
  } else if (lowerInput.includes('troubleshoot') && result.category === 'system') {
    result.resourceType = 'troubleshooting';
  }
 
  // Check if requesting recent updates
  if (lowerInput.includes('update') || lowerInput.includes('recent')) {
    result.wantsGeneralLinks = true;
  }
 
  return result;
};
 
/**
 * Generates a response for URL and resource queries
 * @param {string} input - User input text
 * @returns {Object} - Response object with text and metadata
 */
export const generateUrlResourceResponse = (input) => {
  if (!input) {
    return {
      text: "I couldn't determine what resource information you're looking for. Please specify a category (like national uploads, retail, QC, etc.) and what type of resource you need.",
      confidence: 0.5
    };
  }
 
  const categoryInfo = extractCategoryInfo(input);
 
  if (!categoryInfo.hasCategory) {
    return {
      text: "I couldn't identify which category of resources you're looking for. We have resources for national uploads, retail uploads, quality control, training, and system information. Please specify which area you need URLs for.",
      confidence: 0.6
    };
  }
 
  const category = categoryInfo.category;
  const categoryData = resourceData[category];
 
  if (!categoryData) {
    return {
      text: "I couldn't find resource information for that category. Please try asking about national uploads, retail uploads, quality control, training, or system resources.",
      confidence: 0.5
    };
  }
 
  // Generate response based on what was requested
  let responseText = "";
  let sidebarContent = null;
 
  // Category title for display
  const categoryTitle = {
    nationalUploads: "National Uploads",
    retailUploads: "Retail Uploads",
    qualityControl: "Quality Control",
    screenshot: "Screenshots",
    enterprise: "Enterpriselinks",
    fulfillmentDigital: "Fulfillment",
    training: "Training",
    system: "System"
  }[category];
 
  // If specific resource type was requested
  if (categoryInfo.resourceType && categoryData[categoryInfo.resourceType]) {
    const resourceType = categoryInfo.resourceType;
    const resourceTypeTitle = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
   
    responseText = `Here is the ${categoryTitle} ${resourceTypeTitle} URL:\n\n`;
    responseText += `${categoryData[resourceType]}\n`;
   
    // Add recent updates if requested
    if (categoryInfo.wantsGeneralLinks && categoryData.generallinks) {
      responseText += `\nGeneral Links for ${categoryTitle}:\n`;
      categoryData.generallinks.forEach((update, index) => {
        responseText += `${index + 1}. ${update.date} - ${update.title}\n`;
        responseText += `   URL: ${update.url}\n`;
      });
    }  
    if (categoryInfo.wantsGeneralLinks && categoryData.enterprisegenerallink) {
      responseText += `\nGeneral Links for ${categoryTitle}:\n`;
      categoryData.enterprisegenerallink.forEach((update, index) => {
        responseText += `${index + 1}. ${update.date} - ${update.title}\n`;
        responseText += `   URL: ${update.url}\n`;
      });
    }  
    // Prepare sidebar content
    sidebarContent = {
      title: `${categoryTitle} Resources`,
      content: [
        { type: "heading", text: `${resourceTypeTitle} Resource` },
        { type: "link", text: resourceTypeTitle, url: categoryData[resourceType] }
      ]
    };
    // Add other resources to sidebar
    const otherResources = Object.entries(categoryData)
      .filter(([key, _]) => key !== resourceType && key !== 'generallinks')
      .map(([key, url]) => ({
        type: "link",
        text: key.charAt(0).toUpperCase() + key.slice(1),
        url: url
      }));
   
    if (otherResources.length > 0) {
      sidebarContent.content.push({ type: "heading", text: "Other Resources" });
      sidebarContent.content.push(...otherResources);
    }
  }
  // If recent updates were specifically requested
  else if (categoryInfo.wantsGeneralLinks && categoryData.generallinks) {
    responseText = `General Links for ${categoryTitle}:\n\n`;
   
    categoryData.generallinks.forEach((update, index) => {
      responseText += `${index + 1}. ${update.date} - ${update.title}\n`;
      responseText += `   URL: ${update.url}\n\n`;
    });
   
    // Prepare sidebar content
    sidebarContent = {
      title: `${categoryTitle} Updates`,
      content: [
        { type: "heading", text: "General Links" },
        ...categoryData.generallinks.map(update => ({
          type: "update",
          month: update.month,
          date: update.date,
          title: update.title,
          url: update.url
        }))
      ]
    };
  }
  // Default to providing all URLs for the category
  else {
    responseText = `Here are the ${categoryTitle} resource URLs:\n\n`;
   
    Object.entries(categoryData)
      .filter(([key, _]) => key !== 'generallinks')
      .forEach(([key, url], index) => {
        const resourceTitle = key.charAt(0).toUpperCase() + key.slice(1);
        responseText += `${index + 1}. ${resourceTitle}: ${url}\n`;
      });
   
    // Add recent updates if available
    if (categoryData.generallinks && categoryData.generallinks.length > 0) {
      responseText += `\nGeneral Links:\n`;
      categoryData.generallinks.forEach((update, index) => {
        responseText += `${index + 1}. ${update.date} - ${update.title}\n`;
        responseText += `   URL: ${update.url}\n`;
      });
    }
   
    // Prepare sidebar content
    sidebarContent = {
      title: `${categoryTitle} Resources`,
      content: [
        { type: "heading", text: "Available Resources" },
        ...Object.entries(categoryData)
          .filter(([key, _]) => key !== 'generallinks')
          .map(([key, url]) => ({
            type: "link",
            text: key.charAt(0).toUpperCase() + key.slice(1),
            url: url
          }))
      ]
    };
   
    // Add recent updates to sidebar if available
    if (categoryData.generallinks && categoryData.generallinks.length > 0) {
      sidebarContent.content.push({ type: "heading", text: "General Links" });
      sidebarContent.content.push(...categoryData.generallinks.map(update => ({
        type: "update",
        date: update.date,
        title: update.title,
        url: update.url
      })));
    }
  }
 
  return {
    text: responseText,
    confidence: 0.9,
    category: 'urlResource',
    sidebarContent: sidebarContent
  };
};
 