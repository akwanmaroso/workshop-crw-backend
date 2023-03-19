import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Donation from "App/Models/Donation";

export default class DonationsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const user_id = auth.user?.id;
    const { campaign_id, total } = request.body();

    try {
      const donation = await Donation.create({ user_id, campaign_id, total });
      return donation;
    } catch (err) {
      console.log(err);
      response.internalServerError({ message: err });
    }
  }
}
