import Fastify from "fastify";
const fastify = Fastify({
    logger: true
});
console.log("wazaaa");
fastify.get('/', () => {
    return { hello: 'world' };
});
try {
    const response = await fastify.listen({ port: 3001 });
    console.log("Connected to Port 3001", response);
}
catch (error) {
    fastify.log.error(error);
    console.error(error);
    process.exit(1);
}
//# sourceMappingURL=server.js.map