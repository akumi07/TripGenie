export const SelectTravelesList=[
    {
        id: 1,
        title:'Just Me',
        desc:'A sole traveles in exploration',
        icon:'✈️',
        person:'1'
    },
    {
        id: 2,
        title:'Couple',
        desc:'Two traveles in tandem',
        icon:'🥂',
        person:'2'
    },
    {
        id: 3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏡',
        person:'3 to 5 person'
    },
    {
        id: 4,
        title:'Friends',
        desc:'A bunch of thrill-seekes',
        icon:'⛵',
        person:'5 to 10 people'
    }

    
]

export const selectBudgetOptions=[
    {
        id: 1,
        title:'Cheap',
        desc:'Stay Conscious of Cost',
        icon:'💵',
        
    },
    {
        id: 2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰',
        
    },
    {
        id: 3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸',
        
    },

]

// export const AI_PROMPT = `
//   Generate a travel plan for the destination: {location} for {totalDays} days. 
//   Traveler type: {traveler}, with a {budget} budget. 
//   Provide a list of minumum 3-4 hotel options name, address, and the most recent image URL (ensure the URL is working), geo coordinates, rating,pricing  and descriptions. 
//   Suggest a daily itinerary with place names, details, image URLs, geo coordinates, ticket pricing, ratings, and travel time for each location for {totalDays} days, including the best time to visit. 
//   Output in JSON format.
// `;

export const AI_PROMPT = `
  Generate a comprehensive travel plan for the destination: {location} for {totalDays} days. 
  Traveler type: {traveler}, with a {budget} budget. 
  Provide a list of **at least 3-4 hotel options** with the following details for each:
  - Hotel name (ensure it is realistic and exists for the given location, even for budget options).
  - Address (specific and accurate, not placeholders).
  - The most recent image URL (ensure the URL is working and relevant to the hotel).
  - Geo coordinates (latitude and longitude).
  - Rating (realistic values between 1-5 stars).
  - Pricing (adjusted for the given budget).
  - Description (specific, accurate, and detailed, especially for budget or cheap options).

  Suggest a detailed daily itinerary for {totalDays} days, including:
  - Place names (popular attractions, landmarks, or experiences).
  - Detailed descriptions of each location or activity.
  - Image URLs (ensure they are working and relevant to the place).
  - Geo coordinates for each location (latitude and longitude).
  - Ticket pricing (accurate and adjusted for budget or free options where applicable).
  - Ratings (realistic and based on traveler feedback or popularity).
  - Travel time for each location (between attractions or activities).
  - The best time to visit the destination overall and for specific attractions.

  Ensure all output is provided in valid JSON format without errors.
  If {budget} is "cheap" or "budget," ensure realistic but economical options for hotels and activities while maintaining quality.
  `;
