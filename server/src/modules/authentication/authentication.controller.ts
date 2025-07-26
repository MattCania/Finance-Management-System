import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { env } from "../../lib/env";

export function authControllers(fastify: FastifyInstance) {
  return ( 
  getSession: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    if (env.NODE_ENV === "development") {
      console.log("Session Fetching");
    }

    const user = request.user as { id: string; email: string };

    const account = await fastify.prisma.account.findFirst({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
      },
    });

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
  }
)
}
