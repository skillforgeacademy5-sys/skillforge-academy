const supabase = require("../config/supabase");

/**
 * Persist a verified Paystack payment as a purchase record.
 * full_name is read from payment.metadata.fullName, with a
 * fallback to Paystack's customer first/last name fields.
 * Returns the inserted purchase row.
 */
async function savePurchase(payment) {
  const customerName =
    `${payment.customer.first_name || ""} ${payment.customer.last_name || ""}`.trim();

  const purchase = {
    email: payment.customer.email,
    full_name: payment.metadata.fullName || customerName || null,
    course_id: payment.metadata.courseId,
    course_name: payment.metadata.courseName,
    amount: payment.amount / 100,
    reference: payment.reference,
    payment_status: "paid",
    purchase_date: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("purchases")
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = savePurchase;
