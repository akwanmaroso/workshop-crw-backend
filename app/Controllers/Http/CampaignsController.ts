import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Campaign from "App/Models/Campaign";

export default class CampaignsController {
  public async index({}: HttpContextContract) {
    const result = await Campaign.query().preload("donations");
    const campaigns = result.map((campaign) => {
      const current_donation = campaign.donations.reduce(
        (prev, curr) => prev + curr.total,
        0
      );

      return {
        ...campaign.$original,
        current_donation,
        is_completed: current_donation >= campaign.target,
      };
    });
    return campaigns;
  }

  public async view({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const campaign = await Campaign.query()
      .where("id", id)
      .preload("donations")
      .first();
    if (!campaign) {
      response.notFound({ message: "campaign not found" });
      return;
    }

    const current_donation = campaign.donations.reduce(
      (prev, curr) => prev + curr.total,
      0
    );

    return {
      ...campaign.$original,
      current_donation,
      is_completed: current_donation >= campaign.target,
    };
  }

  public async create({ request, response, auth }: HttpContextContract) {
    const user_id = auth.user?.id;

    const schemaValidator = schema.create({
      title: schema.string(),
      content: schema.string(),
      target: schema.number(),
      target_date: schema.string(),
    });

    const { title, content, target, target_date } = await request.validate({
      schema: schemaValidator,
    });

    try {
      const campaign = await Campaign.create({
        user_id,
        title,
        content,
        target,
        target_date,
      });
      return campaign;
    } catch (err) {
      console.log(err);
      response.internalServerError({ message: err });
    }
  }
}
