import { authMiddleware } from "./middleware/auth_middleware";
import { middlewares } from "./middleware/middlewares";

export default middlewares([authMiddleware]);
