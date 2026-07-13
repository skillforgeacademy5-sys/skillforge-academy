require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// =======================================
// Supabase
// =======================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =======================================
// Home Route
// =======================================

app.get("/", (req, res) => {
    res.send("✅ SkillForge Backend is running...");
});

// =======================================
// Initialize Paystack Payment
// =======================================

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
            message: "Payment initialization failed."
        });

    }

});

// =======================================
// Verify Payment
// =======================================

app.post("/verify-payment", async (req, res) => {

    try {

        const { reference } = req.body;

        if (!reference) {

            return res.status(400).json({
                success: false,
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

        if (response.data.data.status !== "success") {

            return res.json({
                success: false
            });

        }

        const payment = response.data.data;

        // =======================================
        // Save student into Supabase
        // =======================================

        const { error } = await supabase
            .from("students")
            .insert([
                {
                    email: payment.customer.email,
                    course: payment.metadata.course,
                    reference: payment.reference,
                    payment_status: "paid"
                }
            ]);

        if (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            payment
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Verification failed."
        });

    }

});

// =======================================
// View Students
// =======================================

app.get("/students", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {

            return res.status(500).json({
                success: false,
                error: error.message
            });

        }

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =======================================
// Start Server
// =======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});