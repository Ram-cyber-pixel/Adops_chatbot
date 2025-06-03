const roeData = {
    ordersROE: {
        description: "Types of orders in ROE",
        keywords: ["12 order types in ROE","types of orders in ROE"],
        responses: [
            "Linear\n\nTrade order\n\nExchange order\n\nUP Linear\n\nUP Digital\n\nUP Linear & Digital\n\nSET – OTO\n\nSET – Package\n\nOC order\n\nMerge order\n\nInsertion Order\n\nPolitical order"
        ]
    },
    preempt0dollarlines: {
        description: "Details about pre-empting 0$ lines.",
        keywords: ["0$ lines", "pre empt", "0 dollar"],
        responses: [
            "Yes, we can pre-empt the 0$ lines."
        ]
    },
    "15secbookends": {
        description: "Details about marking bookends for a 15-second unit length.",
        keywords: ["15_sec", "bookends"],
        responses: [
            " Marking Bookends\n\n Can we mark bookends for a 15-second unit length?\n\n No, it should be revised back to CM."
        ]
    },
    processOCorder: {
        description: "Details about processing OC orders with 'contract confirmed' status without confirmation in D365.",
        keywords: ["oc order", "contract confirmed","without confimation"],
        responses: [
            " Processing OC Order\n\n Can we process OC order with 'contract confirmed' status without any confirmation in D365?\n\n No, it should be revised back to CM."
        ]
    },
    processopportunitywon: {
        description: "Details about processing an opportunity in 'WON' status.",
        keywords: ["opportunity", "won"],
        responses: [
            " Processing Opportunity\n\n Can we process if opportunity in 'WON' Status?\n\n No, it should be revised back to CM."
        ]
    },
    aemismatchd365oc: {
        description: "Details about handling AE mismatch between D365 and OC.",
        keywords: ["ae mismatch", "ae doesn’t match"],
        responses: [
            "Handling AE Mismatch\n\nWhat should be done if AE doesn’t match between D365 & OC?\n\n Update it manually according to D365."
        ]
    },
    pastdatescurrentweek: {
        description: "Details about handling past dates in the current week.",
        keywords: ["past dates", "current week"],
        responses: [
            " Handling Past Dates in Current Week\n\n What should we do if we have past dates in the current week?\n\n Process the order and leave it in proposal."
        ]
    },
    processOCrevisionnotim: {
        description: "Details about processing OC orders in 'Revision' status without Tim number.",
        keywords: ["revision status", "revision confirmed"],
        responses: [
            " Processing OC Order in 'Revision' Status\n\n Can we process OC order in 'Revision' status without Tim number?\n\n Yes, process as normal order."
        ]
    },
    agencymismatchaosd365: {
        description: "Details about handling agency mismatch between AOS and D365.",
        keywords: ["agency mismatch", "agency doesn’t match"],
        responses: [
            " Handling Agency Mismatch\n\n What should we do if the agency does not match between AOS and D365?\n\n Process it and leave the order in 'proposal'."
        ]
    },
    reservesetwithtimelinelink: {
        description: "Details about reserving a set if there is already a set link in the timeline.",
        keywords: ["timeline link", "d365", "set link"],
        responses: [
            "Reserving Set with Timeline Link\n\n Can we reserve set if we already have set link in timeline?\n\n Yes, we should reserve unless it is mentioned in D365."
        ]
    },
    reserveset15sec: {
        description: "Details about reserving a set for a 15-second unit length.",
        keywords: ["reserve set", "15 sec", "unit length", "no reserve"],
        responses: [
            " Reserving Set for 15 sec Unit Length\n\n Can we reserve set for 15 sec unit length?\n\n No, we should not reserve set for 15 sec."
        ]
    },
    zoneicsamescx: {
      "description": "Details about handling Zone and IC in the same SCX file.",
      "keywords": ["zone", "ic", "process separately"],
      "responses": [
          " Handling Zone and IC in the Same SCX File\n\n**Question:** What if we have Zone and IC in the same SCX file?\n\n**Response:** We should process it separately."
      ]
  },
  digitallinesinscx: {
      "description": "Details about handling digital lines in the SCX file.",
      "keywords": ["digital lines", "scx file", "revise to cm"],
      "responses": [
          "Handling Digital Lines in SCX File\n\n**Question:** What if we have digital lines in SCX file?\n\n**Response:** Revise it back to CM."
      ]
  },
  pastdates_previousweek: {
      "description": "Details about handling orders containing past dates in the previous week.",
      "keywords": ["past dates orders", "previous week", "order"],
      "responses": [
          "Handling Orders with Past Dates in the Previous Week\n\n**Question:** What if the order contains past dates in the previous week?\n\n**Response:** Revise it back to CM."
      ]
  },
  setreservationbluelinesinterconnect: {
      "description": "Details about handling 'Set Reservation' with blue lines and Zone as 'Interconnect'.",
      "keywords": ["set reservation", "blue lines", "interconnect", "Code pc105"],
      "responses": [
          "Handling 'Set Reservation' with Blue Lines and Zone as 'Interconnect'\n\n**Question:** What should be done if the 'Set Reservation' has blue lines and the Zone is 'Interconnect'?\n\n**Response:** Please Code PC105 for set lines."
      ]
  },
  duplicatescxcp0files: {
      "description": "Details about handling two SCX or CP0 files with identical gross, units, and dates.",
      "keywords": ["duplicate files", "cp0 file", "identical gross", "identical units", "identical dates", "process recent", "leave in proposal"],
      "responses": [
          " Handling Duplicate SCX or CP0 Files\n\n**Question:** What should be done if there are two SCX or CP0 files with identical gross, units, and dates?\n\n**Response:** Process the recently attached file and leave the order in proposal."
      ]
  },
  bookendsnotind365automatictim: {
      "description": "Details about handling Bookends not mentioned in D365 but automatically marked in TIM.",
      "keywords": ["bookends", "proposal status", "process order"],
      "responses": [
          " Handling Bookends Not Mentioned in D365 but Automatically Marked in TIM\n\n**Question:** What should be done if Bookends are not mentioned in D365 but are automatically marked in TIM?\n\n**Response:** Process the order and leave it in the proposal status."
      ]
  },
  unmatchedsetlines: {
      "description": "Details about handling unmatched set lines in an order.",
      "keywords": ["unmatched set lines"],
      "responses": [
          " Handling Unmatched Set Lines\n\n**Question:** What should be done if there are unmatched set lines?\n\n**Response:** Process the order and leave it in the proposal status."
      ]
  },
  processunitlength60sec: {
      "description": "Details about processing a unit length of 60 seconds.",
      "keywords": ["unit length", "60 seconds", "process order", "submit order"],
      "responses": [
          " Processing Unit Length of 60 Seconds\n\n**Question:** Is it possible to process a unit length of 60 seconds?\n\n**Response:** Yes, the order can be processed and submitted if all the criteria are met."
      ]
  },
  setreservationpinklines: {
      "description": "Details about handling 'Set Reservation' with pink lines.",
      "keywords": ["set reservation", "pink lines"],
      "responses": [
          " Handling 'Set Reservation' with Pink Lines\n\n**Question:** What should be done if the 'Set Reservation' has pink lines?\n\n**Response:** Process the order and leave it in the proposal status."
      ]
  },
  setoto60sec: {
      "description": "Details about handling a SET OTO order with a unit length of 60 seconds.",
      "keywords": ["set oto", "increase spots", "reduce rate"],
      "responses": [
          " Handling SET OTO Order with a Unit Length of 60 Seconds\n\n**Question:** What should be done if the SET OTO order has a unit length of 60 seconds?\n\n**Response:** Increase the spots to 2 and reduce the rate by half."
      ]
  },
  notecmaesetreserved: {
      "description": "Details about handling notes from CM or AE indicating that the set is already reserved.",
      "keywords": ["cm", "ae", "set already reserved", "no need to reserve", "submit order"],
      "responses": [
          " Handling Notes Indicating the Set is Already Reserved\n\n**Question:** What should be done if there is a note from CM or AE indicating that the set is already reserved?\n\n**Response:** No need to reserve the set and submit the order."
      ]
  }
  
  
  };
  export default roeData;