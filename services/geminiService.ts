import { GoogleGenAI } from "@google/genai";
import { ProjectSpec, GenerationResult } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Please configure it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateProjectPlan(spec: ProjectSpec): Promise<GenerationResult> {
  const prompt = `
    Act as a world-class senior PHP architect and tech lead. Your task is to generate a comprehensive, professional, and actionable project plan for a modern PHP application based on the detailed specifications below. The output must be in well-formatted Markdown, with PHP code blocks correctly formatted and Mermaid.js syntax for diagrams.

    # Project Specification

    - **Project Name:** ${spec.projectName}
    - **Project Type:** ${spec.projectType}
    - **Main Goal:** ${spec.goal}

    ## Core Features
    ${spec.coreFeatures.map(f => `- ${f}`).join('\n')}

    ## Technology Stack
    - **PHP Version:** ${spec.phpVersion}
    - **Framework:** ${spec.framework}
    - **Web Server(s):** ${spec.webServer.join(', ')}
    - **Database:** ${spec.database}
    - **Frontend Stack:** ${spec.frontendStack.length > 0 ? spec.frontendStack.map(f => `- ${f}`).join('\n      ') : 'Not specified'}

    ## Architecture & Standards
    - **Authentication Method:** ${spec.authMethod}
    - **Database Layer / ORM:** ${spec.databaseLayer}
    - **Caching Layer:** ${spec.cachingLayer}
    - **Queue System:** ${spec.queueSystem}
    - **Key Architectural Choices:**
      - Use Database Migrations: ${spec.useMigrations ? 'Yes' : 'No'}
      - API-First Approach: ${spec.isApiFirst ? 'Yes' : 'No'}
      - Use API Rate Limiting: ${spec.useApiRateLimiting ? 'Yes' : 'No'}
    - **Adhered PSR Standards:** ${spec.psrStandards.join(', ')}
    - **Intended Design Patterns:**
      ${spec.designPatterns.length > 0 ? spec.designPatterns.map(p => `- ${p}`).join('\n      ') : 'Not specified'}

    ## Dependencies & Tooling
    - **Key Composer Packages:**
      ${spec.composerPackages.length > 0 ? spec.composerPackages.map(p => `- ${p}`).join('\n      ') : 'Not specified'}
    - **Monolog Logging Channels:** ${spec.monologChannels.join(', ')}
    - **Key Commands:**
      ${spec.keyCommands.map(c => `- \`${c}\``).join('\n      ')}

    # Your Task: Generate a Detailed Project Plan

    Based on the specification above, create a complete plan with the following sections:

    1.  **Project Overview:** A professional summary of the project's purpose, scope, and key technologies.
    2.  **System Architecture Diagram (Mermaid.js):** Create a Mermaid.js diagram (using a \`graph TD\` or \`C4Context\` block) illustrating the high-level architecture. It should show user interaction, the web server, the PHP application (framework), database, caching layer, and queue system.
    3.  **Architectural Approach:** Justify the chosen architecture. Explain how the framework, database, cache, and queue system work together to meet the project's goals. Discuss the benefits of the API-first approach if selected.
    4.  **Recommended Folder Structure (PSR-4 Compliant):** Provide a clear, tree-like folder structure appropriate for the chosen framework. Explain the purpose of key directories (\`app/Http/Controllers\`, \`app/Services\`, \`app/Data\`, \`config\`, etc.).
    5.  **\`composer.json\` File:** Generate a complete, ready-to-use \`composer.json\` file. It must include the specified project name, description, chosen PHP version, all listed Composer packages, and a correctly configured PSR-4 autoload section for the \`App\\\` namespace.
    6.  **Design Pattern Implementation (PHP Examples):** Explain how 2-3 of the most critical specified design patterns should be implemented. Provide brief, framework-aware PHP code examples. For instance, if using Laravel and the Repository Pattern, show a \`ProductRepositoryInterface\` and a \`EloquentProductRepository\` implementation. If DTOs are selected, show a simple \`ProductDto\`.
    7.  **Core Feature Implementation Snippets (PHP):** Provide high-quality, framework-aware starter code for one of the core features. For example, a route definition (\`routes/api.php\`), a controller method, a service class, and a form request for validation.
    8.  **Database & Tooling Setup:**
        *   **Migration Example:** If migrations are enabled, provide a "create_products_table" migration using the framework's syntax.
        *   **Cache & Queue Config:** Provide guidance and example snippets for configuring the selected caching layer and queue system in the chosen framework (e.g., \`.env\` variables for Redis, supervisor config for queues).
        *   **Logging Setup:** Show how to configure Monolog for the specified channels (e.g., a custom channel in Laravel's \`config/logging.php\`).
    9.  **Server Configuration:** Provide essential configuration snippets for the selected web servers (e.g., Apache \`.htaccess\` rewrite rules for the public directory, an Nginx server block with the correct \`try_files\` directive for a front controller).
    10. **Development Roadmap / First Steps:** Outline a logical, step-by-step plan for developers to start the project, from environment setup to implementing the first feature.

    Ensure the entire response is a single, clean Markdown document ready for a developer to use.
  `;
  
  // Fix: Refactored to create config object once to avoid duplication.
  const config = {
    temperature: spec.temperature,
    topP: spec.topP,
    ...(spec.enableThinking && { thinkingConfig: { thinkingBudget: 8192 } }),
  };

  try {
    const response = await ai.models.generateContent({
      model: spec.model,
      contents: prompt,
      config,
    });
    
    return {
      plan: response.text,
      prompt: prompt,
      config: {
        model: spec.model,
        ...config,
      },
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}