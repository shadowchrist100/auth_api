import cron from 'node-cron';
import prisma from '#lib/prisma';

export class CronService {
    static init() {
        // Nettoyage automatique des tokens tous les jours à minuit
        cron.schedule('0 0 * * *', async () => {
            console.log('Nettoyage automatique des tokens...');
            
            const now = new Date();

            try {
                // Nettoyage des Access Tokens (Blacklist)
                const deletedAccess = await prisma.blacklistedAccessToken.deleteMany({
                    where: { expiresAt: { lt: now } }
                });

                // Nettoyage des Refresh Tokens (Expirés ou révoqués depuis plus de 24h)
                const deletedRefresh = await prisma.refreshToken.deleteMany({
                    where: {
                        OR: [
                            { expiresAt: { lt: now } },
                            { revokedAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } }
                        ]
                    }
                });

                console.log(`✅ Nettoyage terminé : ${deletedAccess.count} Access et ${deletedRefresh.count} Refresh supprimés.`);
            } catch (error) {
                console.error(' Erreur lors du nettoyage cron :', error);
            }
        });
    }
}