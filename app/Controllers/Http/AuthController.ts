import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.body();
    console.log(email, password);

    try {
      const token = auth.use("api").attempt(email, password, {
        expiresIn: "3 days",
      });
      return token;
    } catch (err) {
      console.log(err);
      response.unauthorized({ message: "invalid credentials" });
    }
  }

  public async register({ request, response }: HttpContextContract) {
    const { fullname, email, password } = request.body();

    try {
      const user = await User.create({ fullname, email, password });
      return user;
    } catch (err) {
      if (err.code == 23505) {
        response.unauthorized({ message: "email already register" });
        return;
      }

      response.unauthorized({ message: "invalid credentials" });
    }
  }
}
