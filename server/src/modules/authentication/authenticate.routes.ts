import { FastifyInstance } from "fastify";
import { env } from "../../lib/env.ts";
import { authService } from "./authenticate.services.ts";
export default async function authRoute(fastify: FastifyInstance) {
  const service = authService(fastify)
  fastify.route({
    method: "GET",
    url: "/session",
    schema: {
      querystring: {},
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
            },
          },
        },
        401: {
          type: "object",
          properties: {
            server_failure: { type: "string" },
            ok: { type: "boolean" },
          },
        },
      },
    },
    preValidation: [fastify.authenticate],
    handler: async function (request, reply) {
      if (env.NODE_ENV === "development") {
        console.log("Session Fetching");
      }

      const user = request.user as { id: string; email: string };

      const account = await service.getSession(user.id)

      if (!account) {
        return reply.status(401).send({
          server_failure: "Session Invalid: Account no longer exists.",
          ok: false,
        });
      }

      const newToken = fastify.jwt.sign(
        { id: account.id, email: account.email },
        { expiresIn: "12h" }
      );

      reply.setCookie("token", newToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12,
      });

      reply.send({
        success: "Session Verified",
        ok: true,
        data: account,
      });
    },
  });

  // Login Route
  fastify.route({
    method: "POST",
    url: "/login",
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
              },
            },
            token: { type: "string" },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
            type: { type: "string" },
            ok: { type: "boolean" },
          },
        },
        500: {
          type: "object",
          properties: {
            server_failure: { type: "string" },
            ok: { type: "boolean" },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const formData = request.body as { email: string; password: string };

      if (env.NODE_ENV === "development") {
        console.log("User Logged In");
        console.log("FormData: ", formData);
      }

      if (!formData || !formData.email || !formData.password) {
        return reply.status(401).send({
          error: "Failed Logging In!",
          type: "Missing Credentials",
          ok: false,
        });
      } else if (!formData.email.includes("@")) {
        return reply.status(401).send({
          error: "Failed Logging In!",
          type: "Invalid Email",
          ok: false,
        });
      } else if (formData.password.length < 8 || formData.password.length > 15)
        return reply.status(401).send({
          error: "Failed Logging In!",
          type: "Invalid Password Length",
          ok: false,
        });

      try {
        const account_response = await service.getEmail(formData.email)

        if (!account_response)
          return reply.status(401).send({
            error: "Login Failure: Unauthorized!",
            type: "Email Not Found",
            ok: false,
          });

        const account_password = account_response.password;

        const isMatch = await fastify.bcrypt.compare(
          formData.password,
          account_password
        );

        if (!isMatch)
          return reply.status(401).send({
            error: "Login Failure: Unauthorized!",
            type: "Incorrect Password",
            ok: false,
          });

        const data = {
          id: account_response.id,
          email: account_response.email,
        };

        const token = fastify.jwt.sign(
          { id: account_response.id, email: account_response.email },
          { expiresIn: "12h" }
        );

        reply
          .setCookie("token", token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 12,
            secure: env.NODE_ENV === "production",
          })
          .status(200)
          .send({
            success: "Successful Login",
            ok: true,
            data: data,
            token: token,
          });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });

  // Logout user
  fastify.route({
    method: "POST",
    url: "/logout",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
          },
        },
        500: {
          type: "object",
          properties: {
            server_failure: { type: "string" },
            ok: { type: "boolean" },
          },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async function (request, reply) {
      try {
        reply
          .clearCookie("token")
          .status(200)
          .send({ success: "User Logged Out Successfully", ok: true });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });
}
