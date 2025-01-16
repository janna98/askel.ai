import {singleton} from "~/utils/singleton.server";
import {PrismaClient} from "@prisma/client"

export const db = singleton("db", () => new PrismaClient());

