require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.json({
            success: true,
                    message: "🚀 SkillForge API Running Successfully"
                        });
                        });

                        // Payment Routes
                        app.use("/", paymentRoutes);

                        // Start Server
                        const PORT = process.env.PORT || 3000;

                        app.listen(PORT, () => {
                            console.log(`🚀 SkillForge API running on port ${PORT}`);
                            });