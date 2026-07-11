require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// Home Route
// ==============================

app.get("/", (req, res) => {
    res.send("✅ SkillForge Backend is running...");
});

// ==============================
// Initialize Payment
// ==============================

app.post("/initialize-payment", async (req, res) => {

    try {

        const { email, amount, course, courseId } = req.body;

        if (!email || !amount) {
            return res.status(400).json({
                success: false,
                message: "Email and amount are required."
            });
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: Number(amount) * 100,

                metadata: {
                    course,
                    courseId
                },

                callback_url:
                    "https://skillforgeacademy5-sys.github.io/skillforge-academy/success.html"

            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            success: true,
            authorization_url: response.data.data.authorization_url,
            access_code: response.data.data.access_code,
            reference: response.data.data.reference
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Could not initialize payment."
        });

    }

});
// ==============================
// Verify Payment
// ==============================

app.post("/verify-payment", async (req, res) => {

    try {

        const { reference } = req.body;

        if (!reference) {
            return res.status(400).json({
                status: false,
                message: "Reference is required."
            });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        if (response.data.data.status === "success") {

            return res.json({
                status: true,
                payment: response.data.data
            });

        }

        res.json({
            status: false
        });

    } catch (error) {

        console.error("PAYSTACK VERIFY ERROR");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({
            status: false
        });

    }

});

// ==============================
// Save Student
// ==============================

app.post("/save-student", (req, res) => {

    const { email, course, reference } = req.body;

    db.run(
        `INSERT INTO students
        (email, course, reference, payment_status)
        VALUES (?, ?, ?, ?)`,
        [
            email,
            course,
            reference,
            "paid"
        ],
        function (err) {

            if (err) {

                console.log(err.message);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }

            res.json({
                success: true,
                studentId: this.lastID
            });

        }
    );

});

// ==============================
// View Students
// ==============================

app.get("/students", (req, res) => {

    db.all(
        "SELECT * FROM students ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});