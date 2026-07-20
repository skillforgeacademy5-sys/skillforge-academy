const crypto = require("crypto");
const supabase = require("../config/supabase");

/**
 * Generate a cryptographically secure one-time access token
 * and persist it linked to the given purchase.
 */
async function generateAccessToken(purchaseId) {
  const token = crypto.randomBytes(32).toString("hex"); // 64-char hex string

  const { error } = await supabase
    .from("access_tokens")
    .insert([{ token, purchase_id: purchaseId, used: false }]);

  if (error) throw error;
  return token;
}

/**
 * Validate a token, confirm the linked payment, mark it used,
 * and record the Telegram chat ID.
 *
 * Returns { valid: true, purchase } on success.
 * Returns { valid: false, reason } on failure — reason is one of:
 *   'invalid'               — token does not exist
 *   'used'                  — token was already redeemed
 *   'payment_not_confirmed' — linked purchase is not in 'paid' status
 */
async function validateAndConsumeToken(token, telegramChatId) {
  const { data: record, error: fetchError } = await supabase
    .from("access_tokens")
    .select("*, purchases(*)")
    .eq("token", token)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!record) return { valid: false, reason: "invalid" };
  if (record.used) return { valid: false, reason: "used" };

  const purchase = record.purchases;
  if (!purchase || purchase.payment_status !== "paid") {
    return { valid: false, reason: "payment_not_confirmed" };
  }

  // Mark token as used
  const { error: tokenUpdateError } = await supabase
    .from("access_tokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      telegram_chat_id: telegramChatId,
    })
    .eq("id", record.id);

  if (tokenUpdateError) throw tokenUpdateError;

  // Save the student's Telegram chat ID in their purchase record
  const { error: purchaseUpdateError } = await supabase
    .from("purchases")
    .update({ telegram_chat_id: telegramChatId })
    .eq("id", purchase.id);

  if (purchaseUpdateError) throw purchaseUpdateError;

  return { valid: true, purchase };
}

module.exports = { generateAccessToken, validateAndConsumeToken };
