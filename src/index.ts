import dotenv from "dotenv";
dotenv.config()

import router from "./app";

router.listen(process.env.PORT);
