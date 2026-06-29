import { documentRouter } from "~/server/api/routers/document";
import { postRouter } from "~/server/api/routers/post";
import { projectRouter } from "~/server/api/routers/project";
import { projectAccessRequestRouter } from "~/server/api/routers/projectAccessRequest";
import { projectActivityRouter } from "~/server/api/routers/projectActivity";
import { projectFileRouter } from "~/server/api/routers/projectFile";
import { taskNotificationRouter } from "~/server/api/routers/taskNotification";
import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  document: documentRouter,
  post: postRouter,
  project: projectRouter,
  projectAccessRequest: projectAccessRequestRouter,
  projectActivity: projectActivityRouter,
  projectFile: projectFileRouter,
  taskNotification: taskNotificationRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
