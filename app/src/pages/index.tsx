import Link from 'next/link';
import { useState } from 'react';
import { APIWrapper } from './episode';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast Player',
  description: 'Listen to any recently uploaded podcast episode.',
}

interface SearchState {
  searchTerm: string;
}

export default function Page() {

type SearchResultsState = {
  feeds: [
    {
      id: string;
      author: string;
    }
  ]
}
  const [searchState, setSearchState] = useState<SearchState>({ searchTerm: "Search Term" });
  const [results, setResults] = useState<SearchResultsState | null>(null);
  
  return (
    <>
      {/* <Link href="/about">About</Link> */}
      <br />
      <input type="search"
       id="search-podcast" 
       name="q"
       placeholder="Search Podcast" 
       onChange={(event) => {
         setSearchState({ searchTerm: event.target.value });
       }}
       onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            const api = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
            const searchResults = await api.searchPodcasts(searchState.searchTerm);
            setResults(searchResults);
          } 
       }}
      />

      {results && results.feeds && results.feeds.length > 0 ? (
        <ul>
          {results.feeds.map((feed) => (
            <li key={feed.id}>
              <Link href={`/feed/${feed.id}`}>{feed.author}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </>
  );
}
