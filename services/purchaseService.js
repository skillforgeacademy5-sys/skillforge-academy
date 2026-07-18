const supabase = require("../config/supabase");

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

                                                                                                if (error) throw error;

                                                                                                    return data[0];

                                                                                                    }

                                                                                                    module.exports = savePurchase;