# Requirements.md

---

## 1. Customer Statement of Requirements

MealMatch is a web app that helps people figure out what to cook based on what they can eat and what they already have in their kitchen. We've all been there — staring into the fridge with zero ideas. This app fixes that. Users can make an account, pick their dietary style (like Vegetarian, Vegan, or Gluten-Free), and keep a running list of ingredients they currently have at home. The app then recommends recipes that actually fit their diet and shows a cool pie chart breaking down the protein, carbs, and fat in each meal. The goal for this first version is simple: get a working web app where someone can sign up, browse recipes, filter them by diet, manage their pantry, and see which meals they can cook right now. Everything should feel smooth and look clean on both desktop and mobile screens.

---

## 2. Requirements Specification

### 2.1 Functional Requirements

These are the features the app needs to actually do stuff.

| ID | Requirement | Description |
| :--- | :--- | :--- |
| FR-01 | User Registration | New users can sign up with a username, email, and password. |
| FR-02 | User Login/Logout | Users can log in and log out safely using sessions or tokens. |
| FR-03 | Dietary Preference Setting | Users can pick or change their diet type (Vegetarian, Vegan, Gluten-Free, or None). |
| FR-04 | Recipe Browsing | The app shows all available recipes in a table or card view with basic info like name, category, calories, and prep time. |
| FR-05 | Recipe Filtering | Users can filter recipes by diet using a dropdown or buttons. |
| FR-06 | Recipe Details View | Clicking a recipe shows full nutrition info including protein, carbs, and fat. |
| FR-07 | Nutritional Pie Chart | When a user clicks a recipe, a pie chart pops up instantly showing the macro breakdown. |
| FR-08 | Pantry Management | Users can add, view, and remove ingredients from their personal pantry. |
| FR-09 | Recipe Match Percentage | The app calculates a match percentage for each recipe based on what's in the user's pantry. |
| FR-10 | Favorites System | Users can save recipes as favorites and view them later. |
| FR-11 | Search Functionality | Users can search recipes by name or ingredient. |

### 2.2 Non-Functional Requirements

These are the quality standards the app has to meet.

| ID | Requirement | Description |
| :--- | :--- | :--- |
| NFR-01 | Performance | Recipe searches should return results in under 2 seconds. |
| NFR-02 | Usability | The UI should be easy to use and work on both desktop and mobile. |
| NFR-03 | Security | Passwords get hashed before saving, and all queries use parameterized statements to block SQL injection. |
| NFR-04 | Scalability | The database can handle new recipes and users without needing a redesign. |
| NFR-05 | Reliability | The app should stay up 99% of the time during the grading period. |
| NFR-06 | Maintainability | The code follows MVC so it's easy to update later. |
| NFR-07 | Compatibility | It should work on Chrome, Firefox, Safari, and Edge. |
| NFR-08 | Data Integrity | Foreign keys keep everything linked correctly across tables. |

---

## 3. Data and Storage Blueprint

### 3.1 Data Input

There are three ways data gets into the app:

**Manual Entry:** Users type in their own stuff — like their signup info, dietary preference, and pantry ingredients — through regular web forms.

**Seed Dataset:** The recipe and ingredient data gets pre-loaded into the database using a SQL seed script called `schema.sql`. This means the app has data to show right away when someone opens it, without needing an outside API.

**Future API Integration:** Down the road, the app will be able to pull recipes from something like the Spoonacular API. The database is already set up to handle bulk inserts from outside sources when that happens.

### 3.2 Database and Storage

For storage, the app uses a **relational SQL database**. During development and demos, it runs on **SQLite** because it's dead simple — no server setup, everything lives in one file, and it just works the moment someone clones the repo. Later on, if we need to go live, we can switch to **PostgreSQL** just by changing the JDBC connection string since the schema is compatible with both.

**Database Schema:**

There are six tables in total:

| Table | Columns | Purpose |
| :--- | :--- | :--- |
| users | id, username, email, hashed_password, dietary_preference | Holds user account info. |
| meals | id, name, category, calories, protein, carbs, fat, prep_time, image_url | Holds recipe info. |
| ingredients | id, name, allergen_flag | Holds ingredient names and whether they're allergens. |
| meal_ingredients | meal_id, ingredient_id, quantity | Links meals to ingredients (many-to-many). |
| pantry | id, user_id, ingredient_id, quantity | Holds what each user has at home. |
| favorites | id, user_id, meal_id | Holds each user's favorite recipes. |

**Why This Design:** The `meal_ingredients` junction table keeps things tidy by avoiding duplicate data, and it makes it fast to match pantry items against recipe requirements using INNER JOINs. Foreign keys keep everything linked properly, and we add indexes on columns we query a lot (like category and user_id) so things stay quick.

**Visual Connection:** The database talks to the frontend through a backend API built with Node.js and Express. When a user clicks a recipe, the frontend sends a fetch request, the backend runs a SQL query, and the results come back as JSON. That JSON feeds directly into a Chart.js pie chart that updates on the spot.

---

## 4. Agile Product Backlog

These are the user stories I'll track as individual issues on GitHub. Each one follows the standard format: *"As a [user type], I want to [action] so that [benefit]."*

| Story ID | User Story | Priority | Story Points |
| :--- | :--- | :--- | :--- |
| US-01 | As a new user, I want to register an account so that I can save my dietary preferences and pantry items. | High | 3 |
| US-02 | As a registered user, I want to log in and log out securely so that my personal data stays protected. | High | 3 |
| US-03 | As a user, I want to set my dietary preference so that I only see recipes that fit my diet. | High | 2 |
| US-04 | As a user, I want to browse all available recipes so that I can discover new meal ideas. | High | 3 |
| US-05 | As a user, I want to filter recipes by dietary category so that I can quickly find meals that match my restrictions. | High | 3 |
| US-06 | As a user, I want to view detailed nutritional info for a recipe so that I can make smart eating choices. | High | 5 |
| US-07 | As a user, I want to see a pie chart of a recipe's macros so that I can visualize its nutrition instantly. | High | 5 |
| US-08 | As a user, I want to add ingredients to my pantry so that the app knows what I have to cook with. | Medium | 3 |
| US-09 | As a user, I want to remove ingredients from my pantry so that my inventory stays accurate. | Medium | 2 |
| US-10 | As a user, I want to see a match percentage for each recipe so that I know which meals I can cook right now. | Medium | 5 |
| US-11 | As a user, I want to save recipes as favorites so that I can easily find them later. | Low | 2 |
| US-12 | As a user, I want to search for recipes by name or ingredient so that I can find specific meals fast. | Low | 3 |


**GitHub:** https://github.com/JadenCH12/School-things
