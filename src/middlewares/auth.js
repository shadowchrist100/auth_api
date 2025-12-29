/**
 * *Middleware auth minimal pour tester req.user
 * Assigne un utilisateur fictif à req.user
 * Remplace ce mock par le vrai middleware plus tard
 */
export function auth(req, res, next) {
	//mock temporaire:on fixe l'ID de l'utilisateur à 1
	req.user = { id: 1 ,
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date()};
	next();
}