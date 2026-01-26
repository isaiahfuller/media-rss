export interface GlobalList {
  service: string;
  list: {
    type: 'TV' | 'Movie' | 'Music';
    id?: number;
    url?: string;
    title: string;
    image?: string;
    artist?: string;
    album?: string;
    timestamp?: Date;
  }[];
}
