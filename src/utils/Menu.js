import { appsOutline, appsSharp, bookOutline, bookSharp, cashOutline, cashSharp, calendarOutline, calendarSharp, 
    personOutline, personSharp, peopleOutline, peopleSharp, businessOutline, businessSharp } from 'ionicons/icons';
import { SITE_URL } from './Constants';

export const volunteer_pages = [
    {
        title: 'DASHBOARD',
        url: '/dashboard',
        iosIcon: appsOutline,
        mdIcon: appsSharp
    },
    {
        title: 'MY CLASSES',
        url: '/classes',
        iosIcon: bookOutline,
        mdIcon: bookSharp
    },
    {
        title: 'DONATIONS',
        url: SITE_URL + 'donut',
        iosIcon: cashOutline,
        mdIcon: cashSharp
    },
    {
        title: 'EVENTS',
        url: '/events/invitations',
        iosIcon: calendarOutline,
        mdIcon: calendarSharp
    },
    {
        title: 'PROFILE',
        url: '/profile',
        iosIcon: personOutline,
        mdIcon: personSharp
    }
];

export const fellow_pages = [
    {
        title: 'Volunteers',
        url: '/volunteers',
        iosIcon: peopleOutline,
        mdIcon: peopleSharp
    },
    {
        title: 'Shelters',
        url: '/shelters',
        iosIcon: businessOutline,
        mdIcon: businessSharp
    }
];

