# Shopify-Challenge-IMDB
Shopify Challenge - using OMDB api to create web app for film nominations

Deployed via Netlify: https://shopify-challenge-timmlui.netlify.app

Author's Notes:
  I took the inspiration from oscar.go.com/nominees, seeming their theme and design fit for this scenario with
  IMDB film nominations. Worked on it over the span of 4 days (Dated Sept 7, 2020). Even if I do not considered,
  I would love any sort of feedback as I'm gaining experience over React hooks and web design, much appreciated.

  Thanks,
  Timothy Lui

Consume the following endpoint:
http://www.omdbapi.com/?apikey=[yourkey]&

If run locally, create .env.local file with REACT_APP_OMDB_API_KEY=[apikey]

Mockup: https://wireframepro.mockflow.com/editor.jsp?editor=on&bgcolor=white&perm=Create&ptitle=OMDB-shopify-challenge-2&category=bootstrap4&projectid=Md07fd85b0e7992c5bd4998c09b9ec2dc1599344688592&publicid=d5a8b18382174b4badb8cc396361e56e#/page/fdf65f47dc9d4852a592d171183ff0e8

Using React 16:

- Search OMDB and display the results (movies only)
- Add a movie from the search results to our nomination list
- View the list of films already nominated
- Remove a nominee from the nomination list

Technical Requirements:

- Search results should come from OMDB's API (free API key: http://www.omdbapi.com/apikey.aspx).
- Each search result should list at least its title, year of release and a button to nominate that film.
- Updates to the search terms should update the result list
- Movies in search results can be added and removed from the nomination list.
- If a search result has already been nominated, disable its nominate button.
- Display a banner when the user has 5 nominations.

Extras:

- Animations for loading, hover

To-Do: (didnt have enough time)

- New border design when film is nominated
- Nominations to be sticky 
- Back to top button
- Lazy loading / Split search results into multiple page counts
- Responsive design (desktop, tablet, mobile)
- Cache nominations list
- Search bar animations
- Create shareable link
