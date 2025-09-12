import { Router } from "express";
import { authParser } from "../../middlewares/authChecker";
import {
  getCarDetails,
  getFlightDetails,
  getHotelDetails,
} from "./booking.controller";

import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.use(authParser);

router.post("/flight/unified-details", asyncHandler(getFlightDetails));
router.post("/hotel/unified-details", asyncHandler(getHotelDetails));
// router.post("/car/unified-details", asyncHandler(getCarDetails));

export { router as bookingRouter };
