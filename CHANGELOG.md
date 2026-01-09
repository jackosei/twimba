### CHANGELOG

Versioning follows Semantic Versioning: `MAJOR.MINOR.PATCH`.

- **v0.7.0 – Tweet Actions Dropdown**

  - Added a dropdown menu accessed via the ellipsis icon.
  - Implemented "Delete" action within the dropdown menu.

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
