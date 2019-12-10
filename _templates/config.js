require("isomorphic-fetch");
const parseHydraDocumentation = require("@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation").default;
const parseSwaggerDocumentation = require("@api-platform/api-doc-parser/lib/swagger/parseSwaggerDocumentation").default;
const parseOpenApi3Documentation = require("@api-platform/api-doc-parser/lib/openapi3/parseOpenApi3Documentation").default;
// entrypoint, resource, hydraPrefix, format

class Config {
  getParser (entrypoint, format = "hydra") {
    switch (this.format) {
      case "swagger":
        return parseSwaggerDocumentation(entrypoint);
      case "openapi3":
        return parseOpenApi3Documentation(entrypoint);
      default:
        return parseHydraDocumentation(entrypoint, {});
    }
  }

  getResourceConfiguration = (entrypoint, resource, format = "hydra", hydraPrefix = "hydra:") => {
    const entrypointWithSlash = entrypoint.endsWith("/")
      ? entrypoint
      : entrypoint + "/";

    const resourceToGenerate = resource.toLowerCase();

    return this.getParser(entrypointWithSlash).then(ret => {
      return ret.api.resources
        .filter(({ deprecated }) => !deprecated)
        .filter(resource => {
          const nameLc = resource.name.toLowerCase();
          const titleLc = resource.title.toLowerCase();

          return (
            null === resourceToGenerate ||
            nameLc === resourceToGenerate ||
            titleLc === resourceToGenerate
          );
        })
        .map(resource => {
          const filterDeprecated = list =>
            list.filter(({ deprecated }) => !deprecated);

          resource.fields = filterDeprecated(resource.fields);
          resource.readableFields = filterDeprecated(resource.readableFields);
          resource.writableFields = filterDeprecated(resource.writableFields);
          resource.formFields = this.buildFields(resource.writableFields);

          return resource;
        });
    })
    .catch(e => {
      console.log(e);
    });
  }

  getHtmlInputTypeFromField(field) {
    switch (field.id) {
      case "http://schema.org/email":
        return { type: "email" };

      case "http://schema.org/url":
        return { type: "url" };
    }

    switch (field.range) {
      case "http://www.w3.org/2001/XMLSchema#integer":
        return { type: "number", number: true };

      case "http://www.w3.org/2001/XMLSchema#decimal":
        return { type: "number", step: "0.1", number: true };

      case "http://www.w3.org/2001/XMLSchema#boolean":
        return { type: "checkbox" };

      case "http://www.w3.org/2001/XMLSchema#date":
        return { type: "date" };

      case "http://www.w3.org/2001/XMLSchema#time":
        return { type: "time" };

      case "http://www.w3.org/2001/XMLSchema#dateTime":
        return { type: "dateTime" };

      default:
        return { type: "text" };
    }
  }

  getType(field) {
    if (field.reference) {
      if (field.maxCardinality !== 1) {
        return "string[]";
      }

      return "string";
    }

    switch (field.range) {
      case "http://www.w3.org/2001/XMLSchema#integer":
      case "http://www.w3.org/2001/XMLSchema#decimal":
        return "number";
      case "http://www.w3.org/2001/XMLSchema#boolean":
        return "boolean";
      case "http://www.w3.org/2001/XMLSchema#date":
      case "http://www.w3.org/2001/XMLSchema#dateTime":
      case "http://www.w3.org/2001/XMLSchema#time":
        return "Date";
      case "http://www.w3.org/2001/XMLSchema#string":
        return "string";
    }

    return "any";
  }

  buildFields(fields) {
    return fields.map(field => ({
      ...field,
      ...this.getHtmlInputTypeFromField(field),
      description: field.description.replace(/"/g, "'") // fix for Form placeholder description
    }));
  }
}

module.exports = new Config();
