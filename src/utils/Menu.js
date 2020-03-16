import { archiveOutline, archiveSharp, heartOutline, heartSharp, mailOutline, mailSharp, 
    paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp } from 'ionicons/icons';
import { SITE_URL } from './Constants';

export const volunteerPages = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        iosIcon: mailOutline,
        mdIcon: mailSharp
    },
    {
        title: 'My Classes',
        url: '/classes',
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp
    },
    {
        title: 'Donations',
        url: SITE_URL + 'donut',
        iosIcon: heartOutline,
        mdIcon: heartSharp
    },
    {
        title: 'Events',
        url: '/events',
        iosIcon: archiveOutline,
        mdIcon: archiveSharp
    },
    {
        title: 'Profile',
        url: '/profile',
        iosIcon: trashOutline,
        mdIcon: trashSharp
    }
];

export const fellowPages = [
    {
        title: 'Volunteers',
        url: '/volunteers',
        iosIcon: mailOutline,
        mdIcon: mailSharp
    },
    {
        title: 'Shelters',
        url: '/shelters',
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp
    },
    {
        title: 'Deposit',
        url: '/donations/deposits',
        iosIcon: heartOutline,
        mdIcon: heartSharp
    },
    {
        title: 'Create Events',
        url: '/events/new',
        iosIcon: archiveOutline,
        mdIcon: archiveSharp
    }
];

