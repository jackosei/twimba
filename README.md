## Twimba

A minimal Twitter-style feed built with vanilla JavaScript, focusing on DOM manipulation, state management, and UX details without frameworks.

### Overview

Twimba lets you:

- **Browse tweets**: See a feed of mock users, content, likes, and replies.
- **Post new tweets**: Add tweets that appear instantly in the timeline.
- **Like and reply**: Interact with tweets and see counts update in real time.

### Tech Stack

- **Core**: HTML, CSS, JavaScript (no frameworks)
- **Styling**: Custom CSS, mobile-only layout
- **State**: In-memory JavaScript objects for tweets and interactions

### Key Implementation Details

- **State-driven rendering**: The feed is generated from a single source of truth (`data.js`), then rendered via JS template strings.
- **Event delegation**: Click handlers attached at the container level for likes, replies, and new tweets to avoid many individual listeners.
- **Pure rendering logic**: Rendering is handled by a dedicated function that re-renders the feed when state changes.
- **Separation of concerns**: Data (`data.js`), logic (`js/index.js`), and presentation (`styles.css`) are kept distinct.

### Project Structure

- **`index.html`**: Markup and root app container.
- **`styles.css`**: Layout, typography, and responsive styling.
- **`js/data.js`**: Seed data for tweets and users.
- **`js/index.js`**: App logic, state updates, DOM rendering, and event handling.
- **`images/`**: Image assets for the app

### Running the Project

- **Option 1 – Open directly**

  - Open `index.html` in any modern browser.

- **Option 2 – Local server (recommended)**
  - Run a simple static server (e.g. `npx serve` or VS Code Live Server) in the project root.
  - Navigate to the provided URL in the browser.

### Notable Challenges / Focus Areas

- **Interaction flows**: Ensuring likes, replies, and new tweets update the UI from a single state source.
- **DOM performance**: Minimizing direct DOM mutations by re-rendering sections from state.
- **UX details**: Handling empty input, basic layout responsiveness, and tweet metadata (e.g. timestamps).

### How to Extend

- **Add new features**: Implement in `js/index.js`, keep state shape consistent in `js/data.js`.
- **Log changes**: Document each new feature or refactor under **Changelog** with a short, technical note.

### Changelog

Versioning follows Semantic Versioning: `MAJOR.MINOR.PATCH`.

- **v0.6.0 – Image Attachments & Optimization**

  - Added ability to attach images to tweets via file picker.
  - Integrated `js-image-compressor` for client-side image optimization (50KB threshold).
  - Implemented image preview and removal functionality before posting.
  - Refactored `index.js` and `utilities.js` to support asynchronous tweet creation.

- **v0.5.0 – localStorage persistence & data expiry**

  - Implemented localStorage persistence for user-created tweets, interactions (likes/retweets), and timestamps.
  - Added automatic data expiry (1 hour) to clear demo data periodically.
  - Fixed timestamp regeneration issue by persisting timestamps after first render.
  - Created `dataStorage.js` module for localStorage operations and `utilities.js` for shared utility functions.
  - Timestamps now remain stable across page refreshes and user interactions.

- **v0.4.1 - code refactor and minor bug fixes**

  - refactored index.js to replace some "if else" statements with tenary operators to reduce the lines of code
  - fixed a bug where reacting to a tweet was affecting another tweet due to same UUID used on both tweets
  - posting a new tweet now generate a timestamp of "1m" ago instead of the random timestamp that was being used

- **v0.4.0 – Responsive layout & sticky header**

  - Updated layout to use full viewport height on mobile and center a mobile-sized app shell on larger screens.
  - Added sticky header to keep the Twimba title and actions visible while scrolling the feed.

- **v0.3.1 – Minor fix**

  - Rendering of user's full name instead of hardcoded text

- **v0.3.0 – Dynamic timestamps**

  - Implemented dynamic tweet timestamps with relative time formatting (e.g. `5m`, `2h`, `3d`).

- **v0.2.0 – Hashtags**

  - Added hashtag detection in tweet text.
  - Styled hashtags to stand out visually in the feed.
  - Added attachments to the data structure and rendered one example (poll) in the feed.

- **v0.1.0 – Initial setup**
  - Initial project structure, basic tweet feed, and styling.
