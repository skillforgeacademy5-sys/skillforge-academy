require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// ======================================
// Environment Variables
// ======================================

const requiredEnvs = [
    "SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
            "PAYSTACK_SECRET_KEY",
                "BREVO_API_KEY"
                ];

const missing = requiredEnvs.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error("Missing Environment Variables:", missing.join(", "));
    process.exit(1);
}

// ======================================
// Supabase
// ======================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
// ================================
// Brevo
// ================================

const brevo = require("@getbrevo/brevo");

const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log("✅ Brevo initialized successfully");
// ======================================
// SkillForge Settings
// ======================================

const SETTINGS = {
    dashboard: "https://skillforgeacademy5-sys.github.io/skillforge-academy/dashboard.html",
    success: "https://skillforgeacademy5-sys.github.io/skillforge-academy/success.html",
    academyName: "SkillForge Digital Academy",
    supportEmail: "skillforgeacademy5@gmail.com",
    supportPhone: "+234xxxxxxxxxx"
};

// ======================================
// Home Route
// ======================================

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "SkillForge Backend Running Successfully 🚀"
    });
});

// ======================================
// Helper Function
// ======================================

async function savePurchase(payment) {
    const purchase = {
        email: payment.customer.email,
        course_id: payment.metadata.courseId,
        course_name: payment.metadata.courseName,
        amount: payment.amount / 100,
        reference: payment.reference,
        payment_status: "paid",
        purchase_date: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from("purchases")
        .insert([purchase])
        .select();

    if (error) {
        throw error;
    }

    return data[0];
}

// ======================================
// Initialize Payment
// ======================================

app.post("/initialize-payment", async (req, res) => {

    try {

        const {
            email,
            amount,
            courseName: courseNameFromBody,
            course,
            courseId,
            telegramLink
        } = req.body;

        const courseName = courseNameFromBody || course;

        if (!email || !amount || !courseName || !courseId) {

            return res.status(400).json({
                success: false,
                message: "Missing required payment details."
            });

        }

        const response = await axios.post(

            "https://api.paystack.co/transaction/initialize",

            {
                email,
                amount: Number(amount) * 100,
                metadata: {
                    courseId,
                    courseName,
                    telegramLink
                },
                callback_url: SETTINGS.success
            },

            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }

        );

        return res.json({
            success: true,
            authorization_url: response.data.data.authorization_url,
            reference: response.data.data.reference
        });

    } catch (error) {

        console.error(
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to initialize payment."
        });

    }

});

// ======================================
// Verify Payment
// ======================================

app.post("/verify-payment", async (req, res) => {

    try {

        const { reference } = req.body;

        if (!reference) {

            return res.status(400).json({
                success: false,
                message: "Payment reference is required."
            });

        }

        // Verify with Paystack
        const response = await axios.get(

            `https://api.paystack.co/transaction/verify/${reference}`,

            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

        );

        const payment = response.data.data;

        if (payment.status !== "success") {

            return res.json({
                success: false,
                message: "Payment not successful."
            });

        }

        // Prevent duplicate purchases
        const { data: existingPurchase } = await supabase
            .from("purchases")
            .select("id")
            .eq("reference", payment.reference)
            .maybeSingle();

        if (existingPurchase) {

            return res.json({
                success: true,
                message: "Purchase already verified.",
                redirect: SETTINGS.dashboard
            });

        }

        // Save purchase
        const purchase = await savePurchase(payment);

        return res.json({
            success: true,
            message: "Payment verified successfully.",
            purchase,
            redirect: SETTINGS.dashboard
        });

    } catch (error) {

        console.error(
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to verify payment."
        });

    }

});

// ======================================
// Purchased Courses
// ======================================

app.get("/purchases/:email", async (req, res) => {

    try {

        const { email } = req.params;

        const { data, error } = await supabase
            .from("purchases")
            .select("*")
            .eq("email", email)
            .order("purchase_date", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.json({
            success: true,
            purchases: data
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to load purchases."
        });

    }

});

// ======================================
// Get Purchased Courses
// ======================================

app.get("/dashboard/:email", async (req, res) => {

    try {

        const { email } = req.params;

        const { data, error } = await supabase
            .from("purchases")
            .select("*")
            .eq("email", email)
            .order("purchase_date", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.json({
            success: true,
            courses: data
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard."
        });

    }

});

// ======================================
// Start Server
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 SkillForge API running on port ${PORT}`);

});