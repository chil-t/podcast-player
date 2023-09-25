import Link from 'next/Link'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import Image from 'next/image';
export { APIWrapper };

type Episode = {
    episode: any;
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

export type EpisodeResults = {
    items: [
        {
            id: string;
            title: string;
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

function sha1(text: string): string {
  const shasum = crypto.createHash('sha1');
  shasum.update(text);
  
  return shasum.digest('hex');
}

class APIWrapper {
    private API_KEY: string;
    private API_SECRET: string;
    private API_BASE_URL = 'https://api.podcastindex.org/api/1.0';

    constructor(apiKey: string, apiSecret: string) {
        this.API_KEY = apiKey;
        this.API_SECRET = apiSecret;
    }

    // podcast index-specific helpers
    private makeAuthHeaders(): ExtendedAxiosHeaders {
        const authDate = String(Math.floor(Date.now() / 1000));
        const authorziation = sha1(this.API_KEY + this.API_SECRET + authDate);

        return {
            // https://podcastindex-org.github.io/docs-api/#auth
            'User-Agent': 'PodcastPlayer/1.0',
            'X-Auth-Date': authDate,
            'X-Auth-Key': this.API_KEY,
            'Authorization': authorziation,
        };
    }

    // generic HTTP request helper(s)
    private async get<T = any>(url: string, options: AxiosRequestConfig): Promise<T> { 
        const response = await axios.get(url, options);
        return response.data;
    }

    public async searchPodcasts(searchText: string): Promise<SearchResults> {
        const URL = `${this.API_BASE_URL}/search/byterm`;
        const headers: ExtendedAxiosHeaders = this.makeAuthHeaders();
        const query = {
            q: searchText,
        };
    
        return this.get(`${URL}?${new URLSearchParams(query)}`, { headers });
    }

    public async episodesByFeedID(feedID: string): Promise<EpisodeResults> {
        const URL = `${this.API_BASE_URL}/episodes/byfeedid`;
        const headers: ExtendedAxiosHeaders = this.makeAuthHeaders();
        const query = {
            id: feedID,
        };

        return this.get(`${URL}?${new URLSearchParams(query)}`, { headers });
    }

    public async specificEpisodeByID(episodeID: string): Promise<Episode> {
        const URL = `${this.API_BASE_URL}/episodes/byid`;
        const headers: ExtendedAxiosHeaders = this.makeAuthHeaders();
        const query = {
            id: episodeID,
        };

        return this.get(`${URL}?${new URLSearchParams(query)}`, { headers });
    }

    public async getEpisode(author: string): Promise<Episode>{
        const searchResults = await this.searchPodcasts(author);
        const id = searchResults.feeds[0].id;
        const episodesResults = await this.episodesByFeedID(id);
        const episodeID = episodesResults.items[0].id.toString();
        const specificEpisode = await this.specificEpisodeByID(episodeID);
    
        return {
            episode: specificEpisode.episode,
            title: specificEpisode.episode.title,
            author: searchResults.feeds[0].author,
            audioSrc: specificEpisode.episode.enclosureUrl,
            image: specificEpisode.episode.image,
            description: specificEpisode.episode.description,
        };
    }
}

//function searchEpisodesByPerson(searchText: string): Promise<any> {
    //const URL = `${API_BASE_URL}/search/byperson`;
    //const headers: ExtendedAxiosHeaders = makeAuthHeaders();
    //const query = {
        //id: searchText,
        //pretty: String(true)
    //};

    //return get(`${URL}?${new URLSearchParams(query)}`, { headers });
//}

export async function getServerSideProps() {
    // API-specific authentication logic
    const apiWrapper = new APIWrapper('XRQBQ9FUEPQN2E7DQ6N5', 'qfYMb2hsc3e6ekrJe7UPbGJyWCpkyTwBJ$YDxTsV')
    const specificEpisode = await apiWrapper.getEpisode('alex hormozi');

    return {
        props: {
            specificEpisode,
        },
    };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
 
export default function Episode({ specificEpisode }: { specificEpisode: Episode }) {
    return (
        <>
            <Link href="/">Home</Link>
            <br />
            <Image src={specificEpisode.image} alt="Image" width={200} height={200} />
            <audio controls>
                <source src={specificEpisode.audioSrc} type="audio/mpeg" />
            </audio>
            <h1>{specificEpisode.title}</h1>
            <h3>Author:</h3>
            <p>{specificEpisode.author}</p>
            <h3>Description:</h3>
            <p>
                {specificEpisode.description
                .split('<p>')
                .join('')
                .split("</p>")
                .join('')
                }
            </p>
        </>
    );
}
