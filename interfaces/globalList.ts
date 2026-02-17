export interface GlobalList {
  service: string;
  list: {
    type: 'tv' | 'movie' | 'music' | 'print';
    id?: number;
    url?: string;
    title: string;
    image?: string;
    artist?: string;
    album?: string;
    timestamp: number;
    status?: string;
  }[];
}
