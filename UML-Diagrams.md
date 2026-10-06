# UML Diagrams for MealMatch

This document contains three UML diagrams for the MealMatch application: a Use-Case diagram, a Sequence diagram, and a Class diagram. Each diagram is rendered directly on GitHub using Mermaid syntax.

---

## 1. Use-Case Diagram

### Use Case Descriptions

| Use Case ID | Name | Primary Actor | Description |
| :--- | :--- | :--- | :--- |
| UC-01 | Register Account | Guest | A new visitor creates an account with a username, email, and password. |
| UC-02 | Log In | Registered User | A user enters credentials to access their personalized dashboard. |
| UC-03 | Set Dietary Preference | Registered User | A user picks or updates their diet (Vegetarian, Vegan, Gluten-Free, or None). |
| UC-04 | Browse & Filter Recipes | Registered User | A user views all recipes and filters them by dietary category. |
| UC-05 | View Recipe Details & Pie Chart | Registered User | A user clicks a recipe to see its full nutritional breakdown rendered as a Pie Chart. |
| UC-06 | Manage Pantry | Registered User | A user adds, views, or removes ingredients from their personal pantry. |
| UC-07 | View Match Percentage | Registered User | The system calculates how well each recipe matches the user's pantry. |
| UC-08 | Save Favorites | Registered User | A user marks recipes as favorites for quick access later. |
| UC-09 | Search Recipes | Registered User | A user searches recipes by name or ingredient. |
| UC-10 | Manage Recipes | Administrator | An admin adds, edits, or removes recipes and ingredients from the database. |

### Include & Extend Relationships

- **UC-04 (Browse & Filter Recipes)** `<<include>>` **UC-09 (Search Recipes)** — searching is always available during browsing.
- **UC-05 (View Recipe Details)** `<<include>>` **UC-07 (View Match Percentage)** — every detail view shows the match percentage.
- **UC-08 (Save Favorites)** `<<extend>>` **UC-04 (Browse Recipes)** — saving a favorite is an optional action triggered while browsing.
- **UC-03 (Set Dietary Preference)** `<<extend>>` **UC-02 (Log In)** — users can optionally set their diet right after logging in.
- **UC-10 (Manage Recipes)** `<<extend>>` **UC-04 (Browse Recipes)** — admin actions extend the browsing use case.

### Diagram

```mermaid
graph LR
    Guest([👤 Guest])
    User([👤 Registered User])
    Admin([👤 Administrator])

    subgraph MealMatch["🏠 MealMatch System Boundary"]
        UC01((UC-01 Register Account))
        UC02((UC-02 Log In))
        UC03((UC-03 Set Dietary Preference))
        UC04((UC-04 Browse & Filter Recipes))
        UC05((UC-05 View Recipe Details & Pie Chart))
        UC06((UC-06 Manage Pantry))
        UC07((UC-07 View Match Percentage))
        UC08((UC-08 Save Favorites))
        UC09((UC-09 Search Recipes))
        UC10((UC-10 Manage Recipes))
    end

    Guest --> UC01
    Guest --> UC02
    User --> UC02
    User --> UC03
    User --> UC04
    User --> UC05
    User --> UC06
    User --> UC08
    Admin --> UC10

    UC04 -.->|include| UC09
    UC05 -.->|include| UC07
    UC08 -.->|extend| UC04
    UC03 -.->|extend| UC02
    UC10 -.->|extend| UC04
```

---

## 2. Sequence Diagram

**Chosen Use Case:** UC-05 — View Recipe Details & Nutrition Pie Chart (the core "visual connection" feature of MealMatch).

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Registered User
    participant UI as 🖥️ Frontend (React)
    participant API as ⚙️ Backend API (Express)
    participant Auth as 🔐 Auth Service
    participant DB as 🗄️ SQLite/PostgreSQL

    User->>UI: Click "Vegan Quinoa Bowl" in recipe table
    activate UI
    UI->>API: GET /api/recipes/{id}
    activate API
    API->>Auth: Validate session token
    activate Auth
    
    alt Token is valid
        Auth-->>API: ✅ Authorized
        API->>DB: SELECT * FROM meals WHERE id = ?
        activate DB
        DB-->>API: Meal row (protein, carbs, fat, ...)
        deactivate DB
        
        API->>DB: SELECT ingredients FROM meal_ingredients WHERE meal_id = ?
        activate DB
        DB-->>API: Ingredient list
        deactivate DB
        
        API->>DB: SELECT pantry match % for user
        activate DB
        DB-->>API: Match percentage
        deactivate DB
        
        API-->>UI: JSON { nutrition, ingredients, matchPercent }
        UI->>UI: Render Pie Chart with Chart.js
        UI-->>User: 🥧 Nutrition pie chart displayed
    else Token is invalid
        Auth-->>API: ❌ 401 Unauthorized
        API-->>UI: Error 401
        UI-->>User: Redirect to Login page
    end
    deactivate Auth
    deactivate API
    deactivate UI
```

**Description:** The user clicks a recipe in the UI, which triggers a request to the backend API. The API validates the session, then queries the database for the recipe, its ingredients, and the pantry match percentage. If the session is valid, the UI renders a pie chart; if not, the user is redirected to log in. The `alt` fragment shows these two possible paths.

---

## 3. Class Diagram

```mermaid
classDiagram
    class User {
        -int id
        -String username
        -String email
        -String hashedPassword
        -String dietaryPreference
        +register() bool
        +login(password) bool
        +logout() void
        +setDietaryPreference(pref) void
        +getFavorites() List~Meal~
    }

    class Meal {
        -int id
        -String name
        -String category
        -int calories
        -int protein
        -int carbs
        -int fat
        -int prepTime
        -String imageUrl
        +getNutritionBreakdown() double[]
        +getMatchPercentage(pantry) int
        +isFavorite(user) bool
    }

    class Ingredient {
        -int id
        -String name
        -boolean allergenFlag
        +isAllergen() bool
    }

    class MealIngredient {
        -int mealId
        -int ingredientId
        -String quantity
        +getQuantity() String
    }

    class PantryItem {
        -int id
        -int userId
        -int ingredientId
        -String quantity
        +addToPantry() void
        +removeFromPantry() void
        +updateQuantity(qty) void
    }

    class Favorite {
        -int id
        -int userId
        -int mealId
        +addFavorite() void
        +removeFavorite() void
    }

    class RecipeController {
        -DatabaseHelper db
        +browseRecipes(filter) List~Meal~
        +filterByDiet(category) List~Meal~
        +searchRecipes(keyword) List~Meal~
        +getRecipeDetails(id) Meal
        +renderPieChart(meal) void
    }

    class DatabaseHelper {
        -Connection connection
        +getConnection() Connection
        +getMealsByDiet(category) List~Meal~
        +getMealById(id) Meal
        +getMatchPercentage(userId, mealId) int
        +addPantryItem(item) bool
        +removePantryItem(id) bool
        +saveFavorite(userId, mealId) bool
    }

    User "1" --> "0..*" PantryItem : has
    User "1" --> "0..*" Favorite : saves
    User "1" --> "0..*" Meal : views
    Meal "1" --> "1..*" MealIngredient : contains
    Ingredient "1" --> "0..*" MealIngredient : used in
    Ingredient "1" --> "0..*" PantryItem : stored as
    Meal "1" --> "0..*" Favorite : favorited in
    RecipeController "1" --> "1" DatabaseHelper : uses
    RecipeController "1" --> "0..*" Meal : manages
```

### Class Descriptions

| Class | Responsibility |
| :--- | :--- |
| User | Represents a registered user. Handles authentication, dietary preference, and owns their pantry and favorites. |
| Meal | Represents a recipe with nutritional data. Provides methods to compute nutrition breakdowns and match percentages. |
| Ingredient | Represents a single ingredient with allergen info. |
| MealIngredient | Junction class linking meals to ingredients (many-to-many), with quantity details. |
| PantryItem | Represents a single item in a user's pantry. |
| Favorite | Represents a saved recipe for a user. |
| RecipeController | Handles the UI logic — browse, filter, search, and trigger chart rendering. |
| DatabaseHelper | Handles all direct database communication via JDBC/SQL queries. |

### Relationships & Cardinality

| Relationship | Cardinality | Description |
| :--- | :--- | :--- |
| User → PantryItem | 1 : 0..* | A user can have many pantry items (or none). |
| User → Favorite | 1 : 0..* | A user can save many favorites. |
| User → Meal (views) | 1 : 0..* | A user can view many recipes. |
| Meal → MealIngredient | 1 : 1..* | Every meal must have at least one ingredient. |
| Ingredient → MealIngredient | 1 : 0..* | An ingredient can appear in zero or many meals. |
| Ingredient → PantryItem | 1 : 0..* | An ingredient can be in many users' pantries. |
| Meal → Favorite | 1 : 0..* | A meal can be favorited by many users. |
| RecipeController → DatabaseHelper | 1 : 1 | The controller has exactly one database helper. |
| RecipeController → Meal | 1 : 0..* | The controller manages many meals. |
