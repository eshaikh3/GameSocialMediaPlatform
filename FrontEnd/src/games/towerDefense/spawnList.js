import { SPAWN_INTERVAL } from './config'

var groups = []

// type		enemy type
// interval	time between each enemy spawns
// count	number of enemies of current type to spawn
groups[0] = {
    type: 'enemies',
    wave: 1,
    interval: SPAWN_INTERVAL,
    count: 10,
}

groups[1] = {
    type: 'tanks',
    wave: 2,
    interval: SPAWN_INTERVAL,
    count: 20,
}

groups[2] = {
    type: 'runners',
    wave: 3,
    interval: SPAWN_INTERVAL,
    count: 30,
}

groups[3] = {
    type: 'tanks',
    wave: 3,
    interval: SPAWN_INTERVAL,
    count: 30,
}

groups[4] = {
    type: 'enemies',
    wave: 4,
    interval: SPAWN_INTERVAL / 1.8,
    count: 40,
}

groups[5] = {
    type: 'tanks',
    wave: 4,
    interval: SPAWN_INTERVAL / 1.8,
    count: 60,
}

groups[6] = {
    type: 'runners',
    wave: 4,
    interval: SPAWN_INTERVAL / 1.8,
    count: 100,
}

export { groups }
