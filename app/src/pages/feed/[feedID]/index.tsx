import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setLoading, storeFeedID, setAuthor } from '../../../store/feedSlice';
import { RootState } from '../../../store/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { APIWrapper } from '../../episode';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { feedID: string, episodeID: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { feedID, episodeID } = params;

  const api = new APIWrapper(
    'XRQBQ9FUEPQN2E7DQ6N5',
    'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV'
  );
  const specificEpisode = await api.specificEpisodeByID(episodeID);  
  
  return {
    title: specificEpisode.title,
    openGraph: {
      images: [specificEpisode.image],
      description: specificEpisode.description,
    },
  }
}

export default function FeedID() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.feed.data);
  const isLoading = useSelector((state: RootState) => state.feed.isLoading);
  const episodeFeedID = useSelector((state: RootState) => state.feed.feedID);
  const author = useSelector((state: RootState) => state.feed.author);
  const router = useRouter();
  const feedID = router.query.feedID;

  useEffect(() => {
    async function fetchData() {
      const api = new APIWrapper(
        'XRQBQ9FUEPQN2E7DQ6N5',
        'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV'
      );
      if (typeof feedID === 'string') {
        const episodes = await api.episodesByFeedID(feedID);
        const episodeID = await episodes.items[0].id;
        // [0] needs to be based on chosen episode
        const specificEpisode = await api.specificEpisodeByID(episodeID);
        //const specificEpisode = await episodes.items[0].id;
        dispatch(setData(episodes));
        dispatch(setLoading(false));
        //console.log(dispatch(storeFeedID(specificEpisode)));
        // console.log(dispatch(storeFeedID(episodeID)));
        // console.log(dispatch(storeFeedID(episodes.items[0].id)));
        console.log(dispatch(storeFeedID(specificEpisode.episode.feedTitle)));
      }
    }

    fetchData();
  }, [feedID, dispatch]);

  if (isLoading) return <p>loading...</p>;
  if (!data) return <p>No profile data</p>;

  if (feedID) {
    return (
      <div>
        {data.items.map((item, index) => {
          return (
            <p key={index}>
              <Link href={`/feed/${feedID}/episode/${item.id}`}>
                {item.title}
              </Link>
            </p>
          );
        })}
      </div>
    );
  }
}