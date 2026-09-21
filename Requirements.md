# Requirements.md

---

## 1. Customer Statement of Requirements

MealMatch is a web application designed to help users decide what to cook based on their dietary restrictions and the ingredients they already have at home. The core purpose of this application is to eliminate the daily frustration of meal planning by providing personalized recipe recommendations that match a user's dietary needs and pantry inventory. The application will allow users to create accounts, filter recipes by dietary categories such as Vegetarian, Vegan, and Gluten-Free, maintain a digital pantry of available ingredients, and view detailed nutritional information for each meal through interactive visual charts. The scope of this first iteration focuses on delivering a functional web application with user authentication, recipe browsing and filtering, pantry management, and a dynamic nutritional visualization that clearly demonstrates the connection between the database and the user interface. By the end of this iteration, users will be able to log in, browse meals, filter by diet, add ingredients to their pantry, and see which recipes they can cook right now—all through a clean, responsive web interface.

---

## 2. Requirements Specification

### 2.1 Functional Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| FR-01 | User Registration | The system shall allow new users to create an account with a username, email, and password. |
| FR-02 | User Login/Logout | The system shall allow registered users to log in and log out securely using session-based or token-based authentication. |
| FR-03 | Dietary Preference Setting | The system shall allow users to set and update their dietary preference (Vegetarian, Vegan, Gluten-Free, or None). |
| FR-04 | Recipe Browsing | The system shall display a list of all available recipes in a table or card view with basic information (name, category, calories, prep time). |
| FR-05 | Recipe Filtering | The system shall allow users to filter recipes by dietary category using a dropdown or button selection. |
| FR-06 | Recipe Details View | The system shall display detailed nutritional information for a selected recipe, including protein, carbohydrates, and fat. |
| FR-07 | Nutritional Pie Chart | The system shall render a dynamic Pie Chart that updates instantly when a user selects a different recipe, visually representing the macro breakdown. |
| FR-08 | Pantry Management | The system shall allow users to add, view, and remove ingredients from their personal pantry. |
| FR-09 | Recipe Match Percentage | The system shall calculate and display a match percentage for each recipe based on how many required ingredients the user has in their pantry. |
| FR-10 | Favorites System | The system shall allow users to mark recipes as favorites and view a list of saved favorites. |
| FR-11 | Search Functionality | The system shall allow users to search for recipes by name or ingredient. |

### 2.2 Non-Functional Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| NFR-01 | Performance | The system shall return recipe query results within 2 seconds under normal load. |
| NFR-02 | Usability | The user interface shall be intuitive and responsive, working on both desktop and mobile browsers. |
| NFR-03 | Security | User passwords shall be hashed and salted before storage. All database queries shall use parameterized statements to prevent SQL injection. |
| NFR-04 | Scalability | The database schema shall support the addition of new recipes and users without requiring structural changes. |
| NFR-05 | Reliability | The system shall maintain 99% uptime during the grading period. |
| NFR-06 | Maintainability | The codebase shall follow MVC architecture with clear separation of concerns for easy maintenance. |
| NFR-07 | Compatibility | The web application shall function correctly on Chrome, Firefox, Safari, and Edge browsers. |
| NFR-08 | Data Integrity | Foreign key constraints shall be enforced to maintain referential integrity across all database tables. |

---

## 3. Data and Storage Blueprint

### 3.1 Data Input

MealMatch will use three distinct mechanisms for data input:

**Manual Entry:** Users will manually enter their registration information (username, email, password), set their dietary preferences, and add ingredients to their personal pantry through web forms. This is the primary input method for user-generated data.

**Seed Dataset (Initial Load):** The recipe and ingredient data will be pre-loaded into the database through a SQL seed script (`schema.sql`). This script will insert sample recipes with their nutritional values, categories, and associated ingredients. This ensures the application has data to display immediately upon first launch without requiring an external API.

**Future API Integration (Post-Iteration 1):** For future iterations, the application is designed to support fetching recipe data from external APIs such as Spoonacular. The database schema and backend architecture will accommodate this integration by allowing bulk inserts and updates from external JSON responses.

### 3.2 Database and Storage

**Storage Solution:** The application will use a **relational SQL database**. For local development and demonstration, **SQLite** will be used because it is serverless, requires zero configuration, and stores the entire database in a single file, making it easy to run the application immediately after cloning from GitHub. For production deployment, the application is designed to migrate seamlessly to **PostgreSQL** by simply changing the JDBC connection string, as the SQL syntax and schema are compatible.

**Database Schema:**

The database consists of six normalized tables:

| Table | Columns | Purpose |
| :--- | :--- | :--- |
| users | id, username, email, hashed_password, dietary_preference | Stores user account information. |
| meals | id, name, category, calories, protein, carbs, fat, prep_time, image_url | Stores recipe information. |
| ingredients | id, name, allergen_flag | Stores ingredient names and allergen flags. |
| meal_ingredients | meal_id, ingredient_id, quantity | Junction table linking meals to ingredients (many-to-many). |
| pantry | id, user_id, ingredient_id, quantity | Stores user pantry items. |
| favorites | id, user_id, meal_id | Stores user favorite recipes. |

**Why This Design:** The junction table (`meal_ingredients`) normalizes the database by eliminating data redundancy, enabling efficient queries that match pantry items to recipe requirements using INNER JOIN operations. Foreign key constraints ensure referential integrity, and indexes on frequently queried columns (category, user_id) optimize performance.

**Visual Connection:** The database connects to the user interface through a backend API layer built with Node.js and Express. When a user clicks a recipe in the UI, a fetch request is sent to the backend, which executes a parameterized SQL query against the database. The ResultSet is converted to JSON and returned to the frontend, where the Pie Chart component (using Chart.js) renders the nutritional breakdown dynamically.

---

## 4. Agile Product Backlog

The following user stories have been created and logged as separate tracked items in the GitHub repository's Issues tab. Each story follows the standard format: *"As a [user type], I want to [action] so that [benefit]."*

| Story ID | User Story | Priority | Story Points |
| :--- | :--- | :--- | :--- |
| US-01 | As a new user, I want to register an account so that I can save my dietary preferences and pantry items. | High | 3 |
| US-02 | As a registered user, I want to log in and log out securely so that my personal data remains protected. | High | 3 |
| US-03 | As a user, I want to set my dietary preference so that I only see recipes that fit my diet. | High | 2 |
| US-04 | As a user, I want to browse all available recipes so that I can discover new meal ideas. | High | 3 |
| US-05 | As a user, I want to filter recipes by dietary category so that I can quickly find meals that match my restrictions. | High | 3 |
| US-06 | As a user, I want to view detailed nutritional information for a recipe so that I can make informed eating choices. | High | 5 |
| US-07 | As a user, I want to see a dynamic Pie Chart of a recipe's macros so that I can visualize its nutritional breakdown instantly. | High | 5 |
| US-08 | As a user, I want to add ingredients to my pantry so that the app knows what I have available to cook. | Medium | 3 |
| US-09 | As a user, I want to remove ingredients from my pantry so that my inventory stays accurate. | Medium | 2 |
| US-10 | As a user, I want to see a match percentage for each recipe so that I know which meals I can cook right now. | Medium | 5 |
| US-11 | As a user, I want to save recipes as favorites so that I can easily find them later. | Low | 2 |
| US-12 | As a user, I want to search for recipes by name or ingredient so that I can find specific meals quickly. | Low | 3 |
