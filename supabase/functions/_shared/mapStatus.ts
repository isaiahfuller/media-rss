export default function mapStatus(status: string) {
    switch (status) {
        case 'CURRENT':
        case 'WATCHING':
            return 'watching';
        case 'READING':
            return 'reading';
        case 'PLANNING':
        case 'PLAN_TO_WATCH':
        case 'PLAN_TO_READ':
            return 'planning';
        case 'COMPLETED':
            return 'completed';
        case 'DROPPED':
            return 'dropped';
        case 'ON_HOLD':
            return 'on_hold';
        default:
            return 'unknown';
    }
}