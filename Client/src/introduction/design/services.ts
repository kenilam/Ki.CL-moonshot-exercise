import type { DiagramSpec } from 'design/components';

const W = 160;
const H = 60;
const SERVICES = 380;
const OUTSIDE = 600;

/** What the browser reaches through Ki.CL, and what the moonshot server calls. */
const services: DiagramSpec = {
  title: 'Services',
  description:
    'The browser loads the moonshot remote through Ki.CL’s server, or through the dev proxy when it runs alone. That server forwards /design to the design system, /api to Ki.CL-back and /moonshot to the moonshot server. The moonshot server checks the session with Ki.CL-back, asks Claude for the edits and stores reviews in MongoDB.',
  width: 780,
  height: 330,
  nodes: [
    {
      title: 'Browser',
      lines: ['moonshot remote'],
      x: 10,
      y: 135,
      w: 130,
      h: H,
    },
    {
      title: 'Ki.CL server',
      lines: ['or the dev proxy'],
      x: 190,
      y: 135,
      w: 140,
      h: H,
    },
    {
      title: 'Design system',
      lines: ['/design'],
      x: SERVICES,
      y: 20,
      w: W,
      h: H,
    },
    {
      title: 'Ki.CL-back',
      lines: ['/api · sessions'],
      x: SERVICES,
      y: 135,
      w: W,
      h: H,
    },
    {
      title: 'Moonshot server',
      lines: ['/moonshot/api'],
      x: SERVICES,
      y: 250,
      w: W,
      h: H,
    },
    {
      title: 'Claude Opus 5.5',
      lines: ['edits as structured output'],
      x: OUTSIDE,
      y: 175,
      w: 170,
      h: H,
    },
    {
      title: 'MongoDB',
      lines: ['moonshot-reviews'],
      shape: 'cylinder',
      x: OUTSIDE,
      y: 260,
      w: 170,
      h: H,
    },
  ],
  edges: [
    {
      points: [
        [140, 165],
        [190, 165],
      ],
    },
    {
      points: [
        [330, 150],
        [355, 150],
        [355, 50],
        [SERVICES, 50],
      ],
    },
    {
      points: [
        [330, 165],
        [SERVICES, 165],
      ],
    },
    {
      points: [
        [330, 180],
        [355, 180],
        [355, 280],
        [SERVICES, 280],
      ],
    },
    {
      dashed: true,
      label: 'kicl_Me',
      lx: 470,
      ly: 225,
      points: [
        [460, 250],
        [460, 195],
      ],
    },
    {
      points: [
        [540, 270],
        [570, 270],
        [570, 205],
        [OUTSIDE, 205],
      ],
    },
    {
      points: [
        [540, 290],
        [OUTSIDE, 290],
      ],
    },
  ],
};

export { services };
