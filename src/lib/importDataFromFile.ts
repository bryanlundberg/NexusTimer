import { Cube } from '@/interfaces/Cube';
import { ChangeEvent } from 'react';
import genId from './genId';
import { Solve } from '@/interfaces/Solve';
import { parse } from 'papaparse';
import { z } from 'zod/v4';
import { clearCubes, saveBatchCubes } from '@/db/dbOperations';
import _ from 'lodash';

const nxTimerSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    solves: z.object({
      session: z.array(
        z.object({
          id: z.string(),
          startTime: z.number(),
          endTime: z.number(),
          scramble: z.string(),
          bookmark: z.boolean(),
          time: z.number(),
          dnf: z.boolean().optional(),
          plus2: z.boolean(),
          rating: z.number(),
          cubeId: z.string(),
          comment: z.string().optional()
        })
      ),
      all: z.array(
        z.object({
          id: z.string(),
          startTime: z.number(),
          endTime: z.number(),
          scramble: z.string(),
          bookmark: z.boolean(),
          time: z.number(),
          dnf: z.boolean(),
          plus2: z.boolean(),
          rating: z.number(),
          cubeId: z.string(),
          comment: z.string().optional()
        })
      )
    }),
    createdAt: z.number(),
    favorite: z.boolean()
  })
);

const csTimerSchema = z.object({
  properties: z.looseObject({
    sessionN: z.number()
  }),
})

const cubeDeskSchema = z.object({
  sessions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      created_at: z.string(),
      order: z.number()
    })
  ),
  solves: z.array(
    z.object({
      scramble: z.string(),
      started_at: z.number(),
      ended_at: z.number(),
      time: z.number(),
      raw_time: z.number(),
      cube_type: z.string(),
      id: z.string(),
      dnf: z.boolean(),
      plus_two: z.boolean(),
      session_id: z.string(),
      from_timer: z.boolean(),
      inspection_time: z.number().optional(),
      is_smart_cube: z.boolean().optional(),
      smart_put_down_time: z.number().optional()
    })
  )
});

export default async function importDataFromFile(
  event: ChangeEvent<HTMLInputElement>
) {
  try {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return false;
    const fileContent = await selectedFile.text();

    let cubes;

    try {
      cubes = importNexusTimerData(fileContent);
    } catch {
      try {
        cubes = importCsTimerData(fileContent);
      } catch {
        try {
          cubes = importCubeDeskData(fileContent);
        } catch {
          cubes = importTwistyTimerData(fileContent);
        }
      }
    }

    console.log(cubes)

    cubes = uniqueData(cubes);
    await clearCubes();
    await saveBatchCubes(cubes);

    return true
  } catch (error) {
    console.error('Error reading file:', error);
    return false;
  }
}

const importNexusTimerData = (fileContent: string) => {
  const parsedData = JSON.parse(fileContent);
  const result = nxTimerSchema.safeParse(parsedData);
  if (!result.success) {
    throw new Error(`Invalid Nexus Timer data: ${result.error.message}`);
  }
  return parsedData as Cube[];
}

const importCsTimerData = (fileContent: string) => {
  const parsedData = JSON.parse(fileContent);
  const result = csTimerSchema.safeParse(parsedData);
  if (!result.success) {
    throw new Error(`Invalid csTimer data: ${result.error.message}`);
  }

  const resultData = Object.values(parsedData).slice(0, -1) // Exclude the last property which is "properties"

  return resultData.map((session: any, index) => {
    const newCube: Cube = {
      id: genId(),
      name: 'CSTimer Session ' + (index + 1),
      category: '3x3', // Not specified in CSTimer backup - Require manual fix by user later...
      solves: {
        session: [],
        all: [],
      },
      createdAt: Date.now(),
      favorite: false,
    };

    session.forEach((solve: any) => {
      const newSolve: Solve = {
        id: genId(),
        startTime: solve[3] - solve[0][1],
        endTime: solve[3],
        scramble: solve[1],
        bookmark: false,
        time: solve[0][1] + (solve[0][0] === 2000 ? 2000 : 0),
        dnf: solve[0][0] === -1,
        plus2: solve[0][0] === 2000,
        rating: Math.floor(Math.random() * 20) + solve[1].length,
        cubeId: newCube.id,
        comment: '',
      };
      newCube.solves.session.push(newSolve);
    });

    return newCube;
  })
}

function importCubeDeskData(fileContent: string) {
  const parsedData = JSON.parse(fileContent);
  console.log(parsedData)
  const result = cubeDeskSchema.safeParse(parsedData);
  if (!result.success) {
    throw new Error(`Invalid CubeDesk data: ${result.error.message}`);
  }

  const newCubeList: Cube[] = [];

  result.data.sessions.forEach((session) => {
    const newCube: Cube = {
      id: session.id,
      name: 'CubeDesk ' + session.name,
      category: '3x3', // Category not specified in Cubedesk backup -> Manual fix later by user...
      solves: {
        session: [],
        all: [],
      },
      createdAt: Date.parse(session.created_at),
      favorite: false,
    };

    result.data.solves.forEach((solve) => {
      if (solve.session_id === session.id) {
        const newSolve: Solve = {
          id: solve.id,
          startTime: solve.started_at,
          endTime: solve.ended_at,
          scramble: solve.scramble,
          bookmark: false,
          time: solve.time * 1000,
          dnf: solve.dnf,
          plus2: solve.plus_two,
          rating: Math.floor(Math.random() * 20) + solve.scramble.length,
          cubeId: session.id,
          comment: '',
        };
        newCube.solves.session.push(newSolve);
      }
    });
    newCubeList.push(newCube);
  });

  return newCubeList;
}

function importTwistyTimerData(fileContent: string) {
  const parsedData = parse(fileContent, { dynamicTyping: true }).data.slice(1);

  const newCubeList: Cube[] = [];

  // Twisty Timer backup: Row structure
  // Puzzle: 222, Category: Normal, Time: 0, Date: 1657657016937, Scramble: R2 F2, Penalty: 0, Comment:

  // Penalty:
  // [1] - +2
  // [0] - Nothing
  // [2] - DNF

  parsedData.forEach((row: any) => {
    const [puzzle, category, time, date, scramble, penalty, comment] = row;

    if (time === 0 || puzzle === null) return;

    // Find or create the cube
    let cube = newCubeList.find(
      (c) => c.name === `${puzzle}-${category}`
    );

    if (!cube) {
      cube = {
        id: genId(),
        name: `${puzzle}-${category}`,
        category: '3x3',
        solves: { session: [], all: [] },
        createdAt: date,
        favorite: false,
      };
      newCubeList.push(cube);
    }

    const newSolve: Solve = {
      id: genId(),
      startTime: date - time,
      endTime: date,
      scramble,
      bookmark: false,
      time,
      dnf: penalty === 2,
      plus2: penalty === 1,
      rating: scramble ? Math.floor(Math.random() * 20) + scramble.length : 10,
      cubeId: cube.id,
      comment: comment || '',
    };
    cube.solves.session.push(newSolve);
  });

  return newCubeList;
}

function uniqueData(cubes: Cube[]) {
  return _.uniqBy(cubes, 'id').map((cube) => ({
    ...cube,
    solves: {
      session: _.uniqBy(cube.solves.session, 'id'),
      all: _.uniqBy(cube.solves.all, 'id'),
    },
  }));
}
