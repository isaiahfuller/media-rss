export default function mapStatus(status: string) {
    switch (status) {
        case 'CURRENT':
        case 'WATCHING':
        case 'WATCHED EPISODES':
        case 'WATCHED EPISODE':
            return 'watching';
        case 'READING':
        case 'READ CHAPTER':
        case 'READ CHAPTERS':
        case 'READ VOLUME':
        case 'READ VOLUMES':
            return 'reading';
        case 'PLANNING':
        case 'PLAN_TO_WATCH':
        case 'PLAN_TO_READ':
        case 'PLANS TO READ':
        case 'PLANS TO WATCH':
            return 'planning';
        case 'COMPLETED':
        case 'FINISHED':
            return 'completed';
        case 'DROPPED':
            return 'dropped';
        case 'ON_HOLD':
            return 'on_hold';
        default:
            return 'unknown';
    }
}