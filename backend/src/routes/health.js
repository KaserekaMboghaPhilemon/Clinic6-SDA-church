import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Clinic 6 SDA API is running",
  });
});

export default router;
