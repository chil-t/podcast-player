import Link from 'next/link';
import { EpisodeResults, APIWrapper } from '../episode'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function FeedID() {
  const [data, setData] = useState<EpisodeResults | null>(null);
  const [isLoading, setLoading] = useState(true)
  const router = useRouter();
  const feedID = router.query.feedID;

  useEffect(() => {
    async function fetchData() {
      const api = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
      if (typeof feedID === 'string') {
        const episodes = await api.episodesByFeedID(feedID);
        
        setData(episodes);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [feedID]);
  
  if (isLoading) return <p>loading...</p>
  if (!data) return <p>No profile data</p>

  if (feedID) {
    {data.items.map((item, index) => {
    const episodeID = item.id;
    return (
      <>
          <p key={index}>
            <Link href={`/feed/${feedID}/episode/${episodeID}`} key={index}>
              {item.title}
            </Link>
          </p>
      </>
    );
  })}}
}