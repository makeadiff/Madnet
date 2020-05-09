import { apps, appsSharp, library, wallet, calendar, personSharp, personOutline, people, linkOutline,linkSharp,
        businessOutline, schoolOutline, schoolSharp, businessSharp } from 'ionicons/icons';

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
    {
        title: 'Resources',
        url: '/links',
        iosIcon: linkOutline,
        mdIcon: linkSharp
    },
    {
        title: 'Profile',
        url: '/profile',
        iosIcon: personOutline,
        mdIcon: personSharp
    }
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
        iosIcon: businessOutline,
        mdIcon: businessSharp
    },
    {
        title: 'Students',
        url: '/students',
        iosIcon : schoolOutline,
        mdIcon: schoolSharp
    }
];
