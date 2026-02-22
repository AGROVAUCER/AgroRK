import { NextFunction, Request, Response } from "express";

export const orgScope = (req: Request, _res: Response, next: NextFunction) => {
  const orgId = req.user?.orgId || (req.headers["x-org-id"] as string) || "default-org";
  req.orgId = orgId;
  next();
};
