# Social Media Post Management System: Architecture, Data Storage & Workflow

This document explains **what has been built**, **where all post data is stored** (database tables, columns, physical file paths), and **step-by-step how the post lifecycle and interactions work** in this application.

---

## 1. System Overview

The post management system is built inside the existing Laravel 12 + React + TypeScript + Inertia.js stack. It integrates directly with the existing authentication session, Tailwind styling, and database schema without breaking legacy features.

Key capabilities implemented:
- **Rich Post Composer**: Text content, single & multi-image uploads with previews and draft discard confirmation, live `@mention` autocomplete, `#hashtag` pill recognition, and 3-tier visibility settings (`public`, `followers`, `only_me`).
- **Dynamic Post Feeds**: Infinite scroll feed (`MiddleFeed.tsx`), explore feed (`allpost.tsx`), user profile posts/bookmarks carousel (`ProfileActivity.tsx`), and popular feed (`popular.tsx`).
- **Social Graph & Privacy Engine**: Relational follow system (`follows` table) enforcing true SQL-level authorization for `followers` and `only_me` posts through `TimeCapsule::visibleTo($user)`.
- **Relational Interactions**: Database-backed Likes (`time_likes`), Threaded Comments & Replies (`time_comments`), Bookmarks (`post_bookmarks`), and Share tracking (`post_shares`).
- **Hashtags & Mentions**: Automated regex parsing, normalized hashtags (`hashtags`, `post_hashtags`), and user mentions (`post_mentions`).
- **Notifications System**: In-app notifications (`notifications` table) with unread counters in the navigation bar.
- **Strict Authorization**: Laravel Policy (`TimeCapsulePolicy`) guaranteeing that only post authors can edit or delete their posts.

---

## 2. Where Post Data is Saved

Post data is divided into **relational database records (MySQL)** and **physical image assets (Storage Disk)**.

### A. Physical File Storage (Images)

| Item | Path / Location |
|---|---|
| **Physical Disk Directory** | `storage/app/public/posts/` |
| **Public Symbolic Link** | `public/storage/posts/` (created via `php artisan storage:link`) |
| **Public URL in Frontend** | `/storage/posts/{filename}` (e.g. `/storage/posts/abc123xyz.jpg`) |
| **Upload Validation** | MIME: `jpeg, png, jpg, gif, webp` \| Max size: `10MB (10240 KB)` per image |
| **Naming Format** | Generated uniquely using `$file->hashName()` or `$file->store('posts', 'public')` |

---

### B. Relational Database Tables

#### 1. `time_capsules` (Core Posts Table)
This is the primary table representing each published post.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key of the post |
| `user_id` | `BIGINT UNSIGNED` | Foreign key referencing `users.id` (Post author) |
| `post_content` | `TEXT` | Post body text containing captions, hashtags, and mentions |
| `image` | `VARCHAR(255) NULL` | Relative path to primary post image (for backward compatibility) |
| `visibility` | `ENUM('public', 'followers', 'only_me')` | Post privacy setting (default: `'public'`) |
| `likes` | `INT DEFAULT 0` | Cached like count (fast reads) |
| `comments_count` | `INT DEFAULT 0` | Cached comment count |
| `shares` | `INT DEFAULT 0` | Cached share count |
| `status` | `VARCHAR(255) DEFAULT 'published'`| Post publishing status |
| `date` / `year` | `DATE` / `INT` | Legacy time capsule metadata |
| `category_id` | `BIGINT UNSIGNED NULL` | Category reference |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

#### 2. `post_images` (Multi-Image Storage)
Supports multiple image uploads per post.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `path` | `VARCHAR(255)` | Storage path (e.g. `posts/filename.jpg`) |
| `sort_order` | `INT DEFAULT 0` | Carousel display order |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

#### 3. `time_likes` (Like System)
Stores unique user likes on posts.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `user_id` | `BIGINT UNSIGNED` | Foreign key referencing `users.id` (`ON DELETE CASCADE`) |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |
| **Constraint** | `UNIQUE KEY (post_id, user_id)` | Guarantees a user can only like a post once at the database level |

---

#### 4. `time_comments` (Threaded Comment System)
Stores root comments and nested replies.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `user_id` | `BIGINT UNSIGNED` | Foreign key referencing `users.id` (`ON DELETE CASCADE`) |
| `parent_id` | `BIGINT UNSIGNED NULL` | Self-referencing FK (`time_comments.id`) for nested replies (`ON DELETE CASCADE`) |
| `comment` | `TEXT` | Comment text content |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

#### 5. `post_bookmarks` (Saved Posts)
Stores bookmarks for the authenticated user's private collection.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `user_id` | `BIGINT UNSIGNED` | Foreign key referencing `users.id` (`ON DELETE CASCADE`) |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |
| **Constraint** | `UNIQUE KEY (post_id, user_id)` | Prevents duplicate bookmarks |

---

#### 6. `post_shares` (Share Tracking)
Tracks share events safely without incrementing counters merely on menu open.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `user_id` | `BIGINT UNSIGNED NULL` | User who shared (or NULL for guest/copy-link) |
| `platform` | `VARCHAR(50)` | Platform used (`copy_link`, `native_share`, etc.) |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

#### 7. `hashtags` & `post_hashtags` (Hashtag Graph)
Normalizes hashtags and connects them to posts in a many-to-many relationship.

- **`hashtags`**: `id`, `name` (unique lowercase string without `#`), `usage_count`, timestamps.
- **`post_hashtags`**: `id`, `post_id` (FK `time_capsules.id`), `hashtag_id` (FK `hashtags.id`), unique key `(post_id, hashtag_id)`.

---

#### 8. `post_mentions` (User Mentions)
Stores `@username` references extracted from posts.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `post_id` | `BIGINT UNSIGNED` | Foreign key referencing `time_capsules.id` (`ON DELETE CASCADE`) |
| `user_id` | `BIGINT UNSIGNED` | Foreign key referencing `users.id` of the mentioned user |
| `username` | `VARCHAR(255)` | Mentioned username string |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

#### 9. `follows` (Social Graph)
Backs follower-only visibility and user relationship queries.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `follower_id` | `BIGINT UNSIGNED` | The user who is following (`users.id`) |
| `following_id` | `BIGINT UNSIGNED` | The user being followed (`users.id`) |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |
| **Constraint** | `UNIQUE KEY (follower_id, following_id)` | Prevents duplicate follows |

---

#### 10. `notifications` (Social Activity Notifications)
Stores notifications for likes, comments, replies, and mentions.

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary key |
| `user_id` | `BIGINT UNSIGNED` | Recipient user (`users.id`) |
| `actor_id` | `BIGINT UNSIGNED` | User who performed the action (`users.id`) |
| `type` | `VARCHAR(50)` | `'like'`, `'comment'`, `'reply'`, `'mention'` |
| `post_id` | `BIGINT UNSIGNED NULL` | Referenced post |
| `comment_id` | `BIGINT UNSIGNED NULL` | Referenced comment (for replies/comments) |
| `message` | `VARCHAR(255)` | Readable notification message |
| `read_at` | `TIMESTAMP NULL` | Timestamp when read, NULL if unread |
| `created_at` / `updated_at` | `TIMESTAMP` | Timestamps |

---

## 3. How Posts Work (Step-by-Step Lifecycles)

```
[ User in PostComposer.tsx ]
            │
            ▼ (POST /posts with FormData: text, visibility, images[])
[ TimeCapsuleController@store ]
            │
            ├─► Validate content & images (MIME, sizes)
            ├─► DB::transaction()
            │     ├─► Create `time_capsules` record (user_id = Auth::id())
            │     ├─► Save images to `storage/app/public/posts/` & insert into `post_images`
            │     └─► Call PostContentService:
            │           ├─► Parse #hashtags -> sync `hashtags` & `post_hashtags`
            │           └─► Parse @mentions -> sync `post_mentions` & send notifications
            │
            ▼
[ Return 201 JSON with normalized post object ]
            │
            ▼
[ Frontend prepends post to feed immediately & clears composer ]
```

---

### Step 1: Post Creation Lifecycle

1. **Frontend (`PostComposer.tsx`)**:
   - Displays real authenticated user profile picture and name.
   - User types text, tags `#topics`, or mentions `@friends`.
   - Mentions trigger live suggestions via `/api/users/search?q=...`.
   - User can attach single or multiple images. Local previews (`URL.createObjectURL`) are generated with individual remove buttons.
   - User selects visibility: **Public**, **Followers only**, or **Only me**.
   - Submits `multipart/form-data` to `POST /posts`.

2. **Backend Processing (`TimeCapsuleController@store`)**:
   - Validates that `post_content` is present (or images are provided) and max length is 5000 characters.
   - Validates images: `image|mimes:jpeg,png,jpg,gif,webp|max:10240`.
   - Starts a database transaction (`DB::transaction`):
     1. Creates `TimeCapsule` with `user_id = Auth::id()` (never trusts user input for author).
     2. Sets `visibility` (`public`, `followers`, or `only_me`).
     3. Stores uploaded images to disk `storage/app/public/posts/` and creates corresponding `PostImage` rows.
     4. Passes content to `PostContentService::syncContentRelations($post)`:
        - Extracts `#hashtags` via regex `/#([a-zA-Z0-9_\x{0080}-\x{ffff}]+)/u`, finds or creates lowercase entries in `hashtags`, and links them in `post_hashtags`.
        - Extracts `@mentions` via regex `/@([a-zA-Z0-9_]+)/`, finds matching `User` records, links them in `post_mentions`, and creates mention notifications.
   - Formats the response using `TimeCapsule::toFeedArray($user)` and returns HTTP `201 Created`.

3. **Feed Update**:
   - The React composer receives the new post object, fires `onPostCreated(newPost)`, prepends it to the active feed state, and clears its form.

---

### Step 2: Feed Retrieval & Privacy Enforcement

When a user browses the home feed (`/feed`), profile (`/my-posts`), or explore page (`/allpost`):

1. **Backend Query Scope (`TimeCapsule::visibleTo($user)`)**:
   ```sql
   SELECT * FROM time_capsules
   WHERE visibility = 'public'
      OR user_id = :current_user_id
      OR (
         visibility = 'followers' AND user_id IN (
            SELECT following_id FROM follows WHERE follower_id = :current_user_id
         )
      )
   ```
   *Security Guarantee:* Posts set to `only_me` are never returned to any user except the author. Posts set to `followers` are only returned if the requesting user actually follows the author in the `follows` table.

2. **Eager Loading (Preventing N+1 Queries)**:
   - Queries eager-load `['user', 'images', 'likes', 'bookmarks', 'hashtags', 'mentions']`.
   - Includes boolean flags: `is_liked` (whether current user liked it) and `is_bookmarked` (whether current user saved it).

3. **Frontend Rendering (`PostCard.tsx`)**:
   - Renders avatar, author name, handle, formatted timestamp (`Xm ago`, `Xh ago`).
   - Renders clickable hashtags (`#tag` filters the feed) and mentions (`@username`).
   - If multiple images exist, renders a responsive carousel or grid with slide indicators.
   - Action buttons: Like (heart), Comment (bubble), Share (paper plane), Bookmark (ribbon).
   - Author dropdown menu: Edit post modal and Delete post action.

---

### Step 3: Likes Flow & Optimistic UI

1. User clicks the Heart icon on `PostCard.tsx`.
2. **Optimistic UI Update**: The button immediately toggles fill color, and the like count increments/decrements locally before the server responds.
3. **Backend Request**: `POST /posts/{id}/like` calls `TimeLikeController@toggle`:
   - Checks if a `TimeLike` row exists for `(post_id, auth_user_id)`.
   - If exists: Deletes row, decrements `time_capsules.likes`.
   - If not exists: Creates row, increments `time_capsules.likes`, creates a `'like'` notification for the post author (if author != current user).
4. **Rollback on Error**: If the network request fails, the UI rolls back to the previous like state and displays an error message.

---

### Step 4: Comments & Replies Flow

1. User clicks the Comment button or opens the comment section on `PostCard.tsx`.
2. Comments are loaded dynamically from `GET /posts/{id}/comments` (without reloading the page).
3. **Posting a Root Comment**:
   - User types in the input and submits to `POST /posts/{id}/comments`.
   - Backend creates `TimeComment` with `parent_id = null`, increments `time_capsules.comments_count`, creates a notification, and returns the comment with author details.
4. **Replying to a Comment**:
   - User clicks "Reply" under an existing comment.
   - Submits with `parent_id = comment_id`.
   - Saved as a nested reply under that parent comment; notifies the parent comment author.
5. **Editing / Deleting Comments**:
   - Authors can edit their comment inline via `PUT /comments/{id}`.
   - Authors can delete their comment via `DELETE /comments/{id}` (decrements post comment count).

---

### Step 5: Bookmarks (Saved Posts)

1. User clicks the Bookmark icon on a post.
2. Sends `POST /posts/{id}/bookmark` (`PostBookmarkController@toggle`).
3. Toggles existence in `post_bookmarks` table.
4. Authenticated users can view all their saved posts anytime via `/bookmarks` or the Saved Posts tab in `ProfileActivity.tsx` / `savedpost.tsx`.

---

### Step 6: Post Sharing

1. User clicks the Share button on a post.
2. Options presented:
   - **Copy Link**: Copies `window.location.origin + '/posts/' + post.id` to clipboard.
   - **Native Device Share**: Triggers `navigator.share()` on mobile devices.
3. Calling `POST /posts/{id}/share` with `platform: 'copy_link'`:
   - Records an entry in `post_shares` table.
   - Safely increments `time_capsules.shares`.

---

### Step 7: Post Management & Authorization

1. **Editing**:
   - Only the post author can edit (`TimeCapsulePolicy::update` checks `$user->id === $post->user_id`).
   - Accessible via the post dropdown -> "Edit Post".
   - Opens modal to update `post_content` and `visibility`.
   - Updates `time_capsules`, re-syncs `#hashtags` and `@mentions`.
2. **Deleting**:
   - Only the post author can delete (`TimeCapsulePolicy::delete`).
   - Sends `DELETE /posts/{id}`.
   - Deletes all associated files from disk `storage/app/public/posts/`.
   - Database cascading automatically deletes related `post_images`, `time_likes`, `time_comments`, `post_bookmarks`, `post_shares`, `post_hashtags`, and `post_mentions`.

---

## 4. API Endpoints Reference

| Method | Endpoint | Controller Action | Description |
|---|---|---|---|
| `GET` | `/feed` | `TimeCapsuleController@feed` | Paginated feed (latest, popular, search, hashtag) |
| `POST` | `/posts` | `TimeCapsuleController@store` | Create a new post with text, visibility, and images |
| `GET` | `/posts/{id}` | `TimeCapsuleController@show` | Get single post details (enforces visibility) |
| `POST` | `/posts/{id}` | `TimeCapsuleController@update` | Update post text and visibility (author only) |
| `DELETE`| `/posts/{id}` | `TimeCapsuleController@destroy` | Delete post and image files (author only) |
| `POST` | `/posts/{id}/like` | `TimeLikeController@toggle` | Toggle like/unlike on a post |
| `GET` | `/posts/{id}/comments`| `TimeCommentController@index` | Get threaded comments for a post |
| `POST` | `/posts/{id}/comments`| `TimeCommentController@store` | Add root comment or nested reply |
| `PUT` | `/comments/{id}` | `TimeCommentController@update` | Edit a comment (author only) |
| `DELETE`| `/comments/{id}` | `TimeCommentController@destroy`| Delete a comment (author only) |
| `POST` | `/posts/{id}/bookmark`| `PostBookmarkController@toggle`| Toggle saving/bookmarking a post |
| `GET` | `/bookmarks` | `PostBookmarkController@index` | View user's saved posts |
| `POST` | `/posts/{id}/share` | `TimeCapsuleController@share` | Track share and increment counter |
| `GET` | `/hashtags/{name}` | `TimeCapsuleController@byHashtag`| Filter posts by hashtag |
| `POST` | `/api/users/{id}/follow`| `FollowController@toggle` | Follow / unfollow a user |
| `GET` | `/api/users/search` | `FollowController@search` | Search users for `@mentions` |
| `GET` | `/api/notifications` | `NotificationController@index` | List notifications |
| `GET` | `/api/notifications/unread-count` | `NotificationController@unreadCount` | Unread notifications badge count |

---

## 5. Verification & Integrity

- **Backend Tests**: 37 unit and feature tests covering post creation, multi-image storage, visibility authorization, likes duplicate prevention, threaded comments, bookmarks, and cascade deletion.
- **Frontend Build**: Compiled cleanly with Vite and TypeScript (`npx vite build` with 0 errors).
- **Data Safety**: Implemented via incremental Laravel migrations without data loss (`migrate:fresh` and `db:wipe` were never run).

