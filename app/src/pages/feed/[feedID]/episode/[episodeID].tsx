import { SpecificEpisode, APIWrapper } from '../../../episode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Episode() {
  const router = useRouter();
  const { feedID, episodeID } = router.query;

  const [specificEpisode, setSpecificEpisode] = useState<SpecificEpisode | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      if (typeof episodeID === 'string') {
        const api = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
        const episodeData = await api.specificEpisodeByID(episodeID);
        setSpecificEpisode(episodeData);
        console.log(episodeData);
      }
      setLoading(false);
    }
    
    fetchData();
  }, [episodeID]);

  if (!specificEpisode) return null;

  return (
    <>
      <Link href="/">Home</Link>
      <br />
      <Image src={specificEpisode.episode.image} alt="Image" width={200} height={200} />
      <audio controls>
        <source src={specificEpisode.episode.enclosureUrl} type={specificEpisode.episode.enclosureType} />
      </audio>
      <h2>{specificEpisode.episode.title}</h2>
      <h4>Upload Date: <span style={{ fontWeight: 'normal' }}>
          {specificEpisode.episode.datePublishedPretty}
        </span>
      </h4>
      <h4>Description:</h4>
      <p>
      {specificEpisode.episode.description
        .split('<p>')
        .join('')
        .split("</p>")
        .join('')
       }
      </p>
    </>
  );
}