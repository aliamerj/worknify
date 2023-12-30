import { authMiddleware } from "./middleware/auth_middleware";
import { middlewares } from "./middleware/middlewares";
import { profileMiddleware } from "./middleware/profile_middleware";

export default middlewares([authMiddleware, profileMiddleware]);
