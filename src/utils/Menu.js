import { apps, appsSharp, library, wallet, calendar, 
    personCircle, personSharp, people, peopleSharp, business } from 'ionicons/icons';

import { SITE_URL } from './Constants';

export const volunteer_pages = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        iosIcon: apps,
        mdIcon: appsSharp
    },
    {
        title: 'My Classes',
        url: '/classes',
        iosIcon: library,
        mdIcon: library
    },
    {
        title: 'Donations',
        url: SITE_URL + 'donut',
        iosIcon: wallet,
        mdIcon: wallet
    },
    {
        title: 'Events',
        url: '/events',
        iosIcon: calendar,
        mdIcon: calendar
    },
    // {
    //     title: 'PROFILE',
    //     url: '/profile',
    //     iosIcon: personCircle,
    //     mdIcon: personSharp
    // }
];

export const fellow_pages = [
    {
        title: 'Volunteers',
        url: '/users',
        iosIcon: people,        
        mdIcon: people
    },
    {
        title: 'Shelters',
        url: '/shelters',
        iosIcon: business,
        mdIcon: business
    }
];

