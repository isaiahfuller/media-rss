export default function mapFormat(format: string) {
  switch (format) {
    case 'TV':
    case 'TV_SHORT':
    case 'TV_SPECIAL':
    case 'MUSIC':
      return 'tv';
    case 'MOVIE':
    case 'OVA':
    case 'ONA':
    case 'SPECIAL':
      return 'movie';
    case 'SCROBBLE':
      return 'music';
    case 'MANGA':
    case 'NOVEL':
    case 'LIGHT_NOVEL':
    case 'ONE_SHOT':
    case 'DOUJINSHI':
    case 'MANHWA':
    case 'MANHUA':
    case 'PRINT':
      return 'print';
    default:
      return 'unknown';
  }
}
