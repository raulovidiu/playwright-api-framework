# E-commerce Demo Store

A simple e-commerce application built for demonstrating software testing concepts.

## Features

* Product listing with filtering and sorting
* Shopping cart functionality
* User registration and login
* Checkout process and order retrieval
* RESTful API

## Setup

### Prerequisites

* Node.js (v14 or higher recommended)
* npm

### Installation

```bash
cd sample-app
npm install
npm start
```

The application will run at:

```text
http://localhost:3000
```

## Demo Credentials

Use the following credentials to access the demo account:

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Email    | [demo@techmart.com](mailto:demo@techmart.com) |
| Password | demo123                                       |

## API Endpoints

### Products

#### Get all products

```http
GET /api/products
```

Supported query parameters:

| Parameter | Description                 |
| --------- | --------------------------- |
| category  | Filter products by category |
| search    | Search products by keyword  |
| minPrice  | Minimum product price       |
| maxPrice  | Maximum product price       |

#### Get a single product

```http
GET /api/products/:id
```

### Cart

#### Get cart contents

```http
GET /api/cart
```

#### Add item to cart

```http
POST /api/cart
```

Request body:

```json
{
  "productId": 1,
  "quantity": 2
}
```

#### Update cart item quantity

```http
PUT /api/cart/:productId
```

#### Remove item from cart

```http
DELETE /api/cart/:productId
```

#### Clear cart

```http
DELETE /api/cart
```

### Authentication

#### Login

```http
POST /api/login
```

Request body:

```json
{
  "email": "demo@techmart.com",
  "password": "demo123"
}
```

#### Register

```http
POST /api/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
```

#### Logout

```http
POST /api/logout
```

#### Get current user

```http
GET /api/user
```

### Checkout & Orders

#### Place an order

```http
POST /api/checkout
```

Request body:

```json
{
  "shipping": {
    "address": "123 Main Street",
    "city": "New York",
    "zip": "10001"
  }
}
```

#### Retrieve order details

```http
GET /api/orders/:id
```

Returns detailed information for a specific order.

Response body:

### Example Order Response

```json
{
  "id": 1781172154832,
  "items": [
    {
      "productId": 2,
      "quantity": 1,
      "product": {
        "id": 2,
        "name": "Mechanical Keyboard",
        "price": 127.77,
        "category": "electronics",
        "image": "keyboard.svg",
        "stock": 7
      }
    }
  ],
  "total": "127.77",
  "shipping": {
    "firstName": "dsadasdsa",
    "lastName": "dsadsa",
    "address": "dsadsa",
    "address2": "dsa",
    "city": "dsa",
    "state": "CA",
    "zip": "12311",
    "phone": "5555555555"
  },
  "date": "2026-06-11T10:02:34.832Z"
}
```

### Health Check

#### Application health status

```http
GET /api/health
```

Used for monitoring and availability checks.

## Project Structure

```text
sample-app/
├── src/
├── public/
├── package.json
└── README.md
```

## License

This project is intended for educational and software testing demonstration purposes.
