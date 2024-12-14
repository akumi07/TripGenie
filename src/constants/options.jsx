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

export const AI_PROMPT='Generate travel Plan for Location: {location},for {totalDays}days for{Traveller}person with a budget {budget},,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image uri, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Uri, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {totalDays}days with each day plan with best time to visit in json format please make sure it should in json format no backtick not any error i want the repsonse should be strictly json so that i can directly save in db please use indian currency'