# podcast-player
Podcast Player (MVP)

# Features
- add podcast search via the Podcast Index API
- Search via text
- a page with a list of podcasts
- a page for each podcast that parses the podcast's data - (via Podcast Index API or RSS feed) and lists each episode
- support for listening to an episode via the native tag
- support for listening to an episode via the native tag

# Tech
- Podcast Index API
- Next.js + TypeScript (hosted via Vercel)
- React
- Redux for state management (lots of alternatives here, but redux is solid)

# Potential enhancements:
- Search via categories/genres (preset text queries?)
- CI automated tests
- SEO tags (requires server side rendering, eg: via Next.js)
