export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Sayang Mau Makan Apa API",
    version: "1.0",
  },
  paths: {
    "/food/recommend": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lat: { type: "number" },
                  lon: { type: "number" },
                  category: { type: "string" },
                  radius: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },
}
