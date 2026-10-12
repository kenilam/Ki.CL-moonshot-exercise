import type { TFunction } from 'i18next';

import type { DiagramSpec } from 'design/components';

const W = 160;
const H = 60;
const SERVICES = 380;
const OUTSIDE = 600;

/** What the browser reaches through Ki.CL, and what the moonshot server calls. */
const services = (t: TFunction<'moonshot'>): DiagramSpec => ({
  title: t('diagram.services.title'),
  description: t('diagram.services.description'),
  width: 780,
  height: 330,
  nodes: [
    {
      title: t('diagram.services.node', { context: 'browser' }),
      lines: [t('diagram.services.line', { context: 'browser' })],
      x: 10,
      y: 135,
      w: 130,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'server' }),
      lines: [t('diagram.services.line', { context: 'server' })],
      x: 190,
      y: 135,
      w: 140,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'design' }),
      lines: ['/design'],
      x: SERVICES,
      y: 20,
      w: W,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'back' }),
      lines: [t('diagram.services.line', { context: 'back' })],
      x: SERVICES,
      y: 135,
      w: W,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'moonshot' }),
      lines: ['/moonshot/api'],
      x: SERVICES,
      y: 250,
      w: W,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'model' }),
      lines: [t('diagram.services.line', { context: 'model' })],
      x: OUTSIDE,
      y: 175,
      w: 170,
      h: H,
    },
    {
      title: t('diagram.services.node', { context: 'store' }),
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
});

export { services };
