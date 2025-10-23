# AI Project Spec Generator for PHP

This is an interactive, web-based tool designed to help developers and architects quickly generate comprehensive project specifications for modern PHP applications. Using the power of Google's Gemini AI, it takes a detailed set of configuration options and produces a professional, actionable plan that includes architecture diagrams, folder structures, a `composer.json` file, code examples, and server configurations.

![Screenshot of the AI Project Spec Generator](./screenshot.png) *(Note: Add a screenshot of the app here)*

## ✨ Key Features

-   **Interactive Configuration:** A detailed form to specify every aspect of your project, from PHP version and framework to caching layers, queue systems, and design patterns.
-   **Intelligent Autofill:** Select a framework like Laravel or Symfony, and the tool automatically suggests relevant Composer packages, common commands, and architectural patterns.
-   **Advanced AI Prompting:** The prompt sent to the Gemini model is engineered to act like a senior PHP architect, resulting in high-quality, relevant, and detailed outputs.
-   **Comprehensive Plans:** The generated output includes:
    -   System Architecture Diagrams (Mermaid.js syntax).
    -   A complete, ready-to-use `composer.json` file.
    -   PSR-4 compliant folder structures.
    -   Framework-aware code snippets and examples.
    -   Server configuration for Nginx and Apache.
    -   A step-by-step development roadmap.
-   **Drag-and-Drop Lists:** Easily reorder features, packages, and commands.
-   **AI Model Control:** Switch between different Gemini models and fine-tune generation parameters like temperature and Top-P.
-   **Persistent State:** Your entire form configuration is saved in your browser's local storage, so you can pick up right where you left off.
-   **History Management:** Automatically saves every generated plan. View, load, or delete past plans from a convenient history panel.
-   **Import/Export:** Save your project configurations as JSON files to share with your team or use as templates.

## 🚀 Getting Started

This project is a client-side application that runs entirely in the browser. It uses CDN-hosted dependencies, so there is no build step required.

### Prerequisites

-   A modern web browser.
-   A local web server to serve the `index.html` file. You can use extensions like VS Code's "Live Server" or a simple Python/PHP server.
-   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-project-spec-generator.git
    cd ai-project-spec-generator
    ```

2.  **Create the environment file:**
    Copy the example environment file to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```

3.  **Add your API Key:**
    Open the newly created `.env` file in your text editor and paste your Google Gemini API key.
    ```
    API_KEY="YOUR_API_KEY_HERE"
    ```
    **Important:** The application loads this key into the browser environment. Do not deploy this in a public setting where your key could be exposed. This setup is intended for local development and personal use.

4.  **Run a local server:**
    Serve the project's root directory. For example, using Python 3:
    ```bash
    python -m http.server
    ```
    Or using a tool like `serve`:
    ```bash
    npx serve .
    ```

5.  **Open the application:**
    Navigate to the URL provided by your local server (e.g., `http://localhost:8000`) in your web browser. The application should now be running.

## 💡 How to Use

1.  **Configure:** Fill out the form on the left with your project's details. Use the presets and autofill features to speed up the process.
2.  **Generate:** Adjust the AI settings if desired, then click the "Generate PHP Plan" button.
3.  **Review:** The generated plan will appear on the right. You can copy it, view the debug information, or make adjustments to your configuration and regenerate.
4.  **Manage:** Use the "History" panel to revisit past plans. Use "Import" and "Export" to save and load your configurations.

## 🛠️ Tech Stack

-   **Frontend:** React 19, TypeScript, Tailwind CSS
-   **AI:** Google Gemini API via `@google/genai`
-   **Dependencies:** Served via CDN for simplicity (no build step needed).

---

This project is a powerful tool for kickstarting new PHP applications with best practices in mind from the very beginning. Enjoy!
