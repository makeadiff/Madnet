import { appsOutline, appsSharp, bookOutline, bookSharp, cashOutline, cashSharp, calendarOutline, calendarSharp, 
    personOutline, personSharp, peopleOutline, peopleSharp, businessOutline, businessSharp } from 'ionicons/icons';
import { SITE_URL } from './Constants';

export const volunteerPages = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        iosIcon: appsOutline,
        mdIcon: appsSharp
    },
    {
        title: 'My Classes',
        url: '/classes',
        iosIcon: bookOutline,
        mdIcon: bookSharp
    },
    {
        title: 'Donations',
        url: SITE_URL + 'donut',
        iosIcon: cashOutline,
        mdIcon: cashSharp
    },
    {
        title: 'Events',
        url: '/events',
        iosIcon: calendarOutline,
        mdIcon: calendarSharp
    },
    {
        title: 'Profile',
        url: '/profile',
        iosIcon: personOutline,
        mdIcon: personSharp
    }
];

export const fellowPages = [
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

