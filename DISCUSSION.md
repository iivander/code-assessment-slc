## 🗂️ Project Structure & Organization

The [Next.js documentation](https://nextjs.org/docs/app/getting-started/project-structure) offers a few different ways to structure a project. Personally, I prefer the approach where the `app` directory is used **solely for routing**. It keeps the architecture clean and easy to reason about.

Pages default to **server components**, which aligns with how Next.js is designed. When I need interactivity or client-side logic, I create **client components** and organize them under a dedicated `components` folder. This separation of concerns makes the codebase more maintainable and intuitive to navigate.

---

## 🔄 Follow-Up Work

### 🔍 Search / Filters / Pagination Enhancement

Handling hundreds of thousands of records in a client-side grid isn’t scalable. Right now, we’re loading everything into the browser, which doesn’t work for large datasets. This works fine for small datasets, but it quickly breaks down as volume increases.

With large datasets:
- Initial load times increase, leading to a poor user experience.
- Memory usage spikes, especially on lower-end devices.
- Searches and filters become slower, since they’re processed in the browser.
- Users have to scroll through massive lists with no control over pagination or data visibility.

To address the issues above, We should shift that logic from client-side-render to the server-side-render:
- Implement **server-side pagination** so that only a subset of records is fetched and displayed
- Support **query params** (e.g. page, size, sort, filters -- /api/advocates?city=Dallas&speciality=Pediatric&page=3&limit=50)
- Return only the data needed for the current view

On the frontend, we can improve the user experience by introducing an **advanced search modal**:
- Add sort-ascending/descending and filters icons to column headers
- Clicking them opens a modal with column-specific filters
- Once submitted, the filters are sent to the server
- Results are returned and displayed in the grid

Another alternative would be to add an **Advanced Filters Button** to open modal to do the same thing as above.

This would offer a cleaner, scalable, and more powerful experience for the user.

---

### ⚙️ Backend Optimizations

To support efficient filtering and searching:
- Use **proper indexing** in the database
- Add **caching strategies** where needed
- Write **optimized queries** to keep response times fast

This ensures the UI always gets the right data—quickly and reliably.

---

### ❗ Error Handling

Currently, API errors are just logged to the console. We should improve this by showing a **user-friendly alert** when something goes wrong.

DaisyUI offers a clean solution for this:  
🔗 [Alert Component](https://daisyui.com/components/alert/)

Displaying helpful feedback makes the app feel more polished and reliable.

---

### 📱 Mobile Responsiveness

The current UI is desktop-first and doesn’t yet adapt well to smaller screens. Improving **mobile responsiveness** would make the app more usable on phones and tablets.

Future enhancements could include:
- Responsive table layouts (e.g. horizontal scroll or collapsible rows)
- Condensed filter/search UI for mobile
- Fixed bottom bar with essential actions on smaller viewports

This ensures the app remains functional and accessible, regardless of screen size.

---

### 📊 Table Improvements: Column Resizing & Visibility

To enhance usability, we should allow users to **resize table columns** by dragging their edges. This would help when viewing long text values like names, degrees, or specialties.

Another useful feature would be the ability to **hide or show specific columns**. Users could toggle visibility through a settings menu, making it easier to customize the table based on their needs.

These enhancements would make the table more **flexible, user-friendly, and adaptable** for different screen sizes and workflows.


---

### 🎬 Row Animations with Framer Motion

To enhance the user experience, I added row animations using Framer Motion. This allows table rows to animate in/out when data changes, making UI updates feel more fluid.

Current Animation Approach (Client-Side)

Right now, animations trigger when:
•	A search term is entered, and rows are filtered in/out (client-side search)

Since the data is already available in memory, Framer Motion works well for this.

Challenges with Server-Side Search/Filters

If we pivot to server-side search and filtering, row animations become considerably harder because:
•	The entire table re-renders when new data is fetched
•	Animating rows requires tracking which rows were added/removed
•	Motion-based updates become less predictable due to async API responses

That said, it is still possible to animate server-fetched data. A potential approach is to:
1.	Track previous state and compare it to the new state
2.	Animate row changes by using unique keys and exit/enter animations
3.	Introduce loading placeholders (like skeleton UI) for smoother transitions

For now, animations work seamlessly with client-side filtering, but if we move to server-side search, we may need a more complex animation strategy.

---

## 📝 Discussion on Current UX Decisions

### 🧩 "Specialties" Cell UX

Displaying a list of specialties in a table cell came with a few challenges. Initially, I tried showing all of them inline, but that quickly got out of hand visually—especially for advocates with a long list. It broke the table layout and created inconsistency in row height.

After exploring a few options, here were the main contenders:

**Option 1: Show all specialties as separate lines (❌)**
- Too tall for dense data tables
- Visually overwhelming for rows with many items

**Option 2: Comma-separated list (❌)**
- More compact, but harder to scan quickly
- No visual separation between specialties
- Not mobile-friendly

**Option 3: Badges with truncation + tooltip (✅)**
- Shows the first few specialties as badges (up to 3)
- Remaining ones are collapsed into a `+X more` badge with a tooltip
- Keeps the layout clean while still giving access to the full data

**Option 4: Truncated Text with Ellipsis & Hover Tooltip (❌)**
- Clean and compact
- Hover interaction doesn't work well on Mobile
- User might not realize there's more info

**Option 5: Expandable Popover or Modal (❌)**
- Clicking on the cell to open a modal with a full list of specialties
- Requires additional click
- Overkill for short lists

I ended up choosing Option #3. This option struck a good balance between readability and space optimization. The use of badges also makes specialties easy to visually parse, and tooltips provide full context without cluttering the UI.

---