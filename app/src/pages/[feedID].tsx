import Link from 'next/link';
import { EpisodeResults, APIWrapper } from './episode'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function FeedID() {
  const [data, setData] = useState<EpisodeResults | null>(null);
  const [isLoading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const api = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
      if (typeof router.query.feedID === 'string') {
        const episodes = await api.episodesByFeedID(router.query.feedID);
        
        setData(episodes);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [router.query.feedID]);
  
  if (isLoading) return <p>loading...</p>
  if (!data) return <p>No profile data</p>

  if (router.query.feedID) {
    return (
      <>
        {data.items.map((item, index) => 
          <p key={index}>{item.title}</p>
        )}
      </>
    );
  }
}

{/*
type PodcastEpisodes = {
  feeds: [
    {
      id: string;
    }
  ]
}

export const getServerSideProps = (async(context) => {
  const apiWrapper = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
  const podcastChannel = 
  const feedsID = search
  const episodes = await apiWrapper.episodesByFeedID('alex hormozi');
  return { props: { episodes } }
}) satisfies GetServerSideProps<{
  repo: PodcastEpisodes
}>

export default function PodcastID({
  episodes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return episodes.feeds.id
}
*/}