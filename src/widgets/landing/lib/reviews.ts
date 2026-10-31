export type Review = { userId: string; name: string; bio: string; avatar: string; text: string; wide: boolean }

const AVATARS = 'https://cdn-prod.nexustimer.com/avatars'

export const REVIEWS: Review[] = [
  {
    userId: '6a02625e464411316ad03944',
    name: 'Cube king',
    bio: 'Im a 2x2 cube king.',
    avatar: `${AVATARS}/6a02625e464411316ad03944?v=1792411374183`,
    text: 'Oh my god. I was doing cstimer and cubedesk. This is the holy grail. I don’t like cubedesk cause it needs money for all the fun stuff. You? Everything free. Best app ever. Thanks, you. We needed you',
    wide: true
  },
  {
    userId: '68e7ee8911076d897bef1767',
    name: 'Salmoncubes',
    bio: 'I slowsolve',
    avatar: `${AVATARS}/68e7ee8911076d897bef1767?v=1792411309613`,
    text: 'best timer ive used',
    wide: false
  },
  {
    userId: '6a6b297ce3d9cdae84da0326',
    name: 'Cuberonics',
    bio: 'Sub 10',
    avatar: `${AVATARS}/6a6b297ce3d9cdae84da0326?v=1787551873286`,
    text: 'Such wow. Very amaze',
    wide: false
  },
  {
    userId: '6a4a6df08fadc5a48f48333f',
    name: 'raptorclaw',
    bio: 'I love speedcubing! #saveclock',
    avatar: `${AVATARS}/6a4a6df08fadc5a48f48333f?v=1783296669537`,
    text: 'I have been looking for a way to track my times on different cubes easily and Nexus Timer does it great. Best timer I ever used.',
    wide: true
  },
  {
    userId: '6a4e8017c66cb31555fee61f',
    name: 'Clover123',
    bio: '',
    avatar: `${AVATARS}/6a4e8017c66cb31555fee61f?v=1792411452458`,
    text: 'The Learning algorithms are the best!',
    wide: false
  },
  {
    userId: '6a9df22807374c111181af48',
    name: 'David',
    bio: 'sub 25',
    avatar: `${AVATARS}/6a9df22807374c111181af48?v=1788791134121`,
    text: 'so far this is one of the best timer websites i have ever tried',
    wide: true
  }
]
