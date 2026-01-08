import { ProfileService } from "#services/profile.service";
import { UserDto } from "#dto/user.dto";
export class ProfileController {
	// GET /me
	static async getMe(req, res) {
			const userId = req.user.id;
			const user = await ProfileService.getMe(userId);
			res.json({
				success: true,
				user: UserDto.transform(user),
			});
	}
	// PUT /me
	static async updateMe(req, res) {
			const userId = req.user.id;
			const updatedUser = await ProfileService.updateMe(userId, req.body);
			res.json({
				success: true,
				user: UserDto.transform(updatedUser),
			});
		}
	
	// DELETE /me
	static async deleteMe(req, res) {
		try {
			const userId = req.user.id;
			await ProfileService.deleteMe(userId);
			res.json({
				success: true,
				message: "Compte désactivé avec succès",
			});
		} catch (error) {
			res.status(error.status || 500).json({
				success: false,
				error: error.message,
			});
		}
	}
}