import { apps, link, person, wallet, calendar, business, school, people, schoolSharp, businessSharp } from 'ionicons/icons'

export const volunteer_pages = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        iosIcon: apps,
        mdIcon: apps
    },
    // {
    //     title: 'My Classes',
    //     url: '/classes',
    //     iosIcon: library,
    //     mdIcon: library
    // },
    {
        title: 'Donations',
        url: '/donations',
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
        iosIcon: link,
        mdIcon: link
    },
    {
        title: 'Profile',
        url: '/profile',
        iosIcon: person,
        mdIcon: person
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
        iosIcon: business,
        mdIcon: businessSharp
    },
    {
        title: 'Students',
        url: '/students',
        iosIcon : school,
        mdIcon: schoolSharp
    }
];
