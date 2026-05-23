# Pleny Restaurant Sequence Diagrams

## Application Startup

```mermaid
sequenceDiagram
    participant Runtime as Node Runtime
    participant Main as main.ts
    participant Nest as NestFactory
    participant App as AppModule
    participant Mongo as MongoDB
    participant Swagger as Swagger UI

    Runtime->>Main: bootstrap()
    Main->>Nest: create(AppModule)
    Nest->>App: load modules and controllers
    App->>Mongo: connect using MONGO_URI
    Main->>Swagger: setupSwagger(app)
    Swagger-->>Main: expose /api/docs
    Main->>Runtime: listen on PORT or 3000
```

## Standard Create / Read / Update Flow

This flow is used by users, cuisines, restaurants, and user-restaurant relations.

```mermaid
sequenceDiagram
    participant Client
    participant Controller as Nest Controller
    participant Service as Module Service
    participant Model as Mongoose Model
    participant Mongo as MongoDB

    Client->>Controller: POST /create... or PATCH /update.../:id
    Controller->>Service: pass request body and params
    Service->>Model: create() or findOneAndUpdate()
    Model->>Mongo: write document
    Mongo-->>Model: saved/updated document
    Model-->>Service: document
    Service-->>Controller: result
    Controller-->>Client: JSON response

    Client->>Controller: GET /get... or GET /getAll...
    Controller->>Service: request data
    Service->>Model: findOne() or find({ isDeleted: { $ne: true } })
    Model->>Mongo: read active documents
    Mongo-->>Model: documents
    Model-->>Service: documents
    Service-->>Controller: result
    Controller-->>Client: JSON response
```

## Soft Delete Flow

Soft delete is used for users, cuisines, and restaurants.

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Model as Mongoose Model
    participant Mongo as MongoDB

    Client->>Controller: DELETE /delete.../:id
    Controller->>Service: softDelete(id)
    Service->>Model: findOneAndUpdate({_id, isDeleted != true})
    Model->>Mongo: set isDeleted=true, deletedAt=now
    Mongo-->>Model: updated document
    Model-->>Service: document
    Service-->>Controller: deleted document
    Controller-->>Client: JSON response
```

## Nearby Restaurants Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as RestaurantsController
    participant Service as RestaurantsService
    participant Model as RestaurantModel
    participant Mongo as MongoDB 2dsphere Index

    Client->>Controller: GET /restaurants/nearby?longitude=&latitude=
    Controller->>Service: findNearby({ longitude, latitude })
    Service->>Service: convert longitude and latitude to numbers
    Service->>Model: find with $near and $maxDistance 1000
    Model->>Mongo: geospatial query on location
    Mongo-->>Model: restaurants within 1KM
    Model-->>Service: restaurants
    Service-->>Controller: restaurants
    Controller-->>Client: JSON response
```

## Restaurant Recommendations Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as UserRestaurantController
    participant Service as UserRestaurantService
    participant Users as Users Collection
    participant Relations as UserRestaurants Collection
    participant Restaurants as Restaurants Collection

    Client->>Controller: GET /user-restaurants/recommendations/:userId
    Controller->>Service: getRestaurantRecommendations(userId)
    Service->>Service: validate userId

    Service->>Users: aggregate current user by _id
    Users-->>Service: favoriteCuisines

    Service->>Users: aggregate users sharing favorite cuisines
    Users-->>Service: matching users

    Service->>Relations: aggregate followed restaurant ids for matching users
    Relations-->>Service: restaurant ids

    Service->>Restaurants: aggregate restaurants by ids
    Restaurants-->>Service: restaurants

    Service-->>Controller: { users, restaurants }
    Controller-->>Client: JSON response
```

## Swagger Flow

```mermaid
sequenceDiagram
    participant Client
    participant Swagger as Swagger UI
    participant App as Nest App
    participant Controllers
    participant DTOs

    Client->>Swagger: GET /api/docs
    Swagger->>App: load generated OpenAPI document
    App->>Controllers: read route metadata
    App->>DTOs: read ApiProperty and ApiBody metadata
    App-->>Swagger: OpenAPI JSON
    Swagger-->>Client: interactive API documentation
```

## Brands Transformation Task

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Script as transform-brands.ts
    participant File as brands.json
    participant Schema as brands-schema.ts
    participant Mongo as brands Collection

    Dev->>Script: npm run brands:transform
    Script->>File: read raw brands
    Script->>Mongo: import raw documents with same _id
    Script->>Mongo: read brands collection

    loop each brand
        Script->>Script: normalize name, yearFounded, numberOfLocations
        Script->>Schema: validate transformed brand
        Schema-->>Script: valid document
        Script->>Mongo: update same document in place
    end

    Script-->>Dev: transformed count
```
