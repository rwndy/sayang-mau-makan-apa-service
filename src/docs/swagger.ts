export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Sayang Mau Makan Apa API",
    version: "1.0.0",
    description:
      "AI-powered food recommendation service with two modes: General and Near Me",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API Version 1",
    },
  ],
  paths: {
    "/food/recommend": {
      post: {
        summary: "Get food recommendations",
        description:
          "Generate food recommendations in two modes:\n\n" +
          "1. **General Mode**: Generate 10 food recommendations based on category only\n" +
          "2. **Near Me Mode**: Generate 10 location-based food recommendations using nearby restaurants from OpenStreetMap",
        tags: ["Food"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category"],
                properties: {
                  category: {
                    type: "string",
                    description:
                      "Food category or preference (e.g., 'pedas', 'manis', 'healthy')",
                    example: "pedas",
                  },
                  mode: {
                    type: "string",
                    enum: ["nearMe"],
                    description:
                      "Set to 'nearMe' for location-based recommendations. Omit for general mode.",
                  },
                  lat: {
                    type: "number",
                    description: "Latitude (required when mode is 'nearMe')",
                    minimum: -90,
                    maximum: 90,
                    example: -6.2,
                  },
                  lon: {
                    type: "number",
                    description: "Longitude (required when mode is 'nearMe')",
                    minimum: -180,
                    maximum: 180,
                    example: 106.8,
                  },
                  radius: {
                    type: "number",
                    description:
                      "Search radius in meters (only for nearMe mode)",
                    minimum: 500,
                    maximum: 10000,
                    default: 3000,
                    example: 2000,
                  },
                },
              },
              examples: {
                general: {
                  summary: "General Mode",
                  description: "Get 10 food recommendations without location",
                  value: {
                    category: "pedas",
                  },
                },
                nearMe: {
                  summary: "Near Me Mode",
                  description: "Get 10 location-based food recommendations",
                  value: {
                    category: "pedas",
                    mode: "nearMe",
                    lat: -6.2,
                    lon: 106.8,
                    radius: 2000,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful response with food recommendations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "object",
                      properties: {
                        recommendations: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              food: {
                                type: "string",
                                description: "Recommended food/dish name",
                                example: "Ayam Geprek",
                              },
                              place: {
                                type: "string",
                                description:
                                  "Restaurant name (nearMe mode) or place type (general mode)",
                                example: "Warung Makan Sederhana",
                              },
                              reason: {
                                type: "string",
                                description: "Brief reason for recommendation",
                                example:
                                  "Spicy grilled chicken that matches your preference",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "Validation Error",
                    },
                    errors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          field: {
                            type: "string",
                            example: "mode",
                          },
                          message: {
                            type: "string",
                            example:
                              "lat and lon are required when mode is 'nearMe'",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "No restaurants found (nearMe mode only)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "No restaurants found in this area",
                    },
                  },
                },
              },
            },
          },
          502: {
            description: "AI service error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "AI service temporarily unavailable",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/food/histories": {
      get: {
        summary: "Get recommendation history",
        description: "Retrieve all past food recommendations",
        tags: ["Food"],
        responses: {
          200: {
            description: "Successful response with history",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                          },
                          category: {
                            type: "string",
                            example: "pedas",
                          },
                          lat: {
                            type: "number",
                            nullable: true,
                            example: -6.2,
                          },
                          lon: {
                            type: "number",
                            nullable: true,
                            example: 106.8,
                          },
                          result: {
                            type: "object",
                            description: "The recommendation result",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-18T10:30:00Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Food",
      description: "Food recommendation endpoints",
    },
  ],
}
