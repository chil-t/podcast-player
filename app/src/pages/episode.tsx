import Link from 'next/Link'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import Image from 'next/image';

type Episode = {
    title: string;
    author: string;
    audioSrc: string;
    image: string;
    description: string;
};

type SearchResults = {
    feeds: [
        {
            id: string;
            author: string;
        }
    ];
};

type EpisodeResults = {
    items: [
        {
            id: string;
        }
    ];
};

type SpecificEpisode = {
    episode: {
        enclosureUrl: string;
        image: string;
        feedTitle: string;
        title: string;
        description: string;
    };
};
interface AuthHeaders {
    'User-Agent': string;
    'X-Auth-Date': string;
    'X-Auth-Key': string;
    'Authorization': string;
}

type AxiosHeaderValue = string | number | boolean;
interface ExtendedAxiosHeaders extends AuthHeaders {
    [header: string]: AxiosHeaderValue;
}

// generic HTTP request helper(s)
async function get<T = any>(url: string, options: AxiosRequestConfig): Promise<T> {
  const response = await axios.get(url, options);
  return response.data;
}

function sha1(text: string): string {
  const shasum = crypto.createHash('sha1');
  shasum.update(text);
  
  return shasum.digest('hex');
}


// podcast index-specific helpers
function makeAuthHeaders(): ExtendedAxiosHeaders {
  // API-specific authentication logic
  const API_KEY = 'XRQBQ9FUEPQN2E7DQ6N5';
  const API_SECRET = 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV';

  const authDate = String(Math.floor(Date.now() / 1000));
  const authorization = sha1(API_KEY + API_SECRET + authDate);

  return {
    // https://podcastindex-org.github.io/docs-api/#auth
    'User-Agent': 'PodcastPlayer/1.0',
    'X-Auth-Date': authDate,
    'X-Auth-Key': API_KEY,
    'Authorization': authorization
  };
}

const API_BASE_URL = 'https://api.podcastindex.org/api/1.0';

function searchPodcasts(searchText: string): Promise<SearchResults> {
    const URL = `${API_BASE_URL}/search/byterm`;
    const headers: ExtendedAxiosHeaders = makeAuthHeaders();
    const query = {
        q: searchText,
        max: '1'
    };

    return get(`${URL}?${new URLSearchParams(query)}`, { headers });
}

function searchEpisodesByPerson(searchText: string): Promise<any> {
    const URL = `${API_BASE_URL}/search/byperson`;
    const headers: ExtendedAxiosHeaders = makeAuthHeaders();
    const query = {
        id: searchText,
        pretty: String(true)
    };

    return get(`${URL}?${new URLSearchParams(query)}`, { headers });
}

function episodesByFeedID(feedID: string): Promise<EpisodeResults> {
    const URL = `${API_BASE_URL}/episodes/byfeedid`;
    const headers: ExtendedAxiosHeaders = makeAuthHeaders();
    const query = {
        id: feedID,
        max: '3'
    };

    return get(`${URL}?${new URLSearchParams(query)}`, { headers });
}

function singleEpisodeByID(episodeID: string): Promise<Episode> {
    const URL = `${API_BASE_URL}/episodes/byid`;
    const headers: ExtendedAxiosHeaders = makeAuthHeaders();
    const query = {
        id: episodeID
    };

    return get(`${URL}?${new URLSearchParams(query)}`, { headers });
}

export const getServerSideProps: GetServerSideProps<{
    specificEpisode: Episode;
    searchResults: SearchResults;
}> = async () => {
    const searchResults = await searchPodcasts('alex hormozi');
    const id = searchResults.feeds[0].id;
    const episodesResults = await episodesByFeedID(id);
    const episodeID = await episodesResults.items[0].id.toString();
    const specificEpisode = await singleEpisodeByID(episodeID);

    return {
        props: {
            specificEpisode,
            searchResults,
        },
    };
}
 
export default function Episode(props) {
    return (
        <>
            <Link href="/">Home</Link>
            <br />
            <audio controls>
                <source src={props.specificEpisode.episode.enclosureUrl} type="audio/mpeg"></source>
            </audio>
            <Image
                src={props.specificEpisode.episode.image}
                alt="Image"
                width={200}
                height={200}
            />
            <h1>
                {props.specificEpisode.episode.feedTitle}
            </h1>
            <h1>
                {props.specificEpisode.episode.title}
            </h1>
            <h3>
                Author:
            </h3>
            <p>
                {props.searchResults.feeds[0].author}
            </p>
            <h3>
                Description: 
            </h3>
            <p>
                {props.specificEpisode.episode.description
                .split('<p>')
                .join('')
                .split("</p>")
                .join('')
                }
            </p>

        </>
    );
}
