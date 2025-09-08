import { Hono } from 'hono';
import { humanizerRouter } from './humanizer';
import { detectorRouter } from './detector';
import { summariserRouter } from './summariser';
import { paraphraserRouter } from './paraphraser';
import { healthRouter } from './health';
import { usageRouter } from './usage';

export const toolsRouter = new Hono()
  .route('/', humanizerRouter)
  .route('/', detectorRouter)
  .route('/', summariserRouter)
  .route('/', paraphraserRouter)
  .route('/', healthRouter)
  .route('/', usageRouter);