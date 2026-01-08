import { authenticator } from 'otplib';
import QRCode from 'qrcode';
//Génération et transformation du lien du code secret en qr code
export const generateTwoFactorSetup = async (userEmail) => {
  const secret = authenticator.generateSecret();
  
  const otpauth = authenticator.keyuri(userEmail, 'twofactorApp', secret);
  
  const qrCodeDataURL = await QRCode.toDataURL(otpauth);

  return { secret, qrCodeDataURL };
};
//vérification si le code a 6 chiffre entré par l'utilisater 
export const verifyTwoFactorToken = (token, secret) => {
  return authenticator.verify({
    token,  
    secret,
    window: 2   
  });
};