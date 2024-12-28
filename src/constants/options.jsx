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

export const AI_PROMPT = `
  Generate a travel plan for the destination: {location} for {totalDays} days. 
  Traveler type: {traveler}, with a {budget} budget. 
  Provide a list of hotel options including the name, address, and the most recent image URL (ensure the URL is working), geo coordinates, rating, and descriptions. 
  Suggest a daily itinerary with place names, details, image URLs, geo coordinates, ticket pricing, ratings, and travel time for each location for {totalDays} days, including the best time to visit. 
  Output in JSON format.
`;