export async function sendSms(phone: string) {
  await new Promise(r => setTimeout(r, 500));
  return true;
}
export async function verifySms(phone: string, code: string) {
  await new Promise(r => setTimeout(r, 500));
  return code !== '000000';
}
export async function sendEmail(email: string) {
  await new Promise(r => setTimeout(r, 500));
  return true;
}