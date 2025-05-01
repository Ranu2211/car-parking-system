# Car Parking System

This is a RESTful API implementation for a car parking system built with NestJS and TypeScript.

## Features

1. Initialize a parking lot with a specific number of slots
2. Expand the parking lot by adding more slots
3. Allocate a parking slot to a car
4. Free a parking slot by slot number or car registration number
5. Fetch all occupied slots in the parking lot
6. Fetch registration numbers of cars with a particular color
7. Fetch slot number for a car with a given registration number
8. Fetch slot numbers of all cars with a particular color

## Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run start:dev

# Build for production
npm run build

# Run in production mode
npm run start:prod

# Run tests
npm test
```

## API Endpoints

### 1. Initialize Parking Lot
```
POST /parking_lot
Body: { "no_of_slot": 6 }
Response: { "total_slot": 6 }
```

### 2. Expand Parking Lot
```
PATCH /parking_lot
Body: { "increment_slot": 3 }
Response: { "total_slot": 9 }
```

### 3. Park a Car
```
POST /park
Body: { "car_reg_no": "KA-01-AB-2211", "car_color": "white" }
Response: { "allocated_slot_number": 1 }
```

### 4. Get Registration Numbers by Color
```
GET /registration_numbers/:color
Response: [ "KA-01-HH-1234", "KA-02-AB-9999", "KA-03-PK-2211" ]
```

### 5. Get Slot Numbers by Color
```
GET /slot_numbers/:color
Response: [ "1", "5", "12" ]
```

### 6. Clear a Parking Slot
```
POST /clear
Body: { "slot_number": 1 }
Response: { "freed_slot_number": 1 }
```
or
```
POST /clear
Body: { "car_registration_no": "KA-01-AB-2211" }
Response: { "freed_slot_number": 1 }
```

### 7. Get Parking Lot Status
```
GET /status
Response: [
  {
    "slot_no": 1,
    "registration_no": "KA-01-HH-1234",
    "color": "red"
  },
  {
    "slot_no": 2,
    "registration_no": "KA-01-HH-1235",
    "color": "blue"
  }
]
```

### 8. Get Slot Number by Registration Number
```
GET /slot_number/:registration_number
Response: { "slot_number": 1 }
```

## Design 

1. **Time complexity**: The system allocates slots in O(n) time complexity, where n is the number of slots. This could be optimized further with priority queues.
2. **Data storage**: In-memory storage is used instead of external databases.
3. **Error handling**: The system throws appropriate exceptions and returns meaningful error messages.
4. **API design**: RESTful API guidelines are followed for consistent request/response formats.
5. **Testing**: Unit tests are included to ensure the functionality of the system. 