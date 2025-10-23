import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ProjectSpec, DebugInfo, GenerationResult, HistoryItem } from './types';
import { generateProjectPlan } from './services/geminiService';
import { FRAMEWORK_PRESETS, AVAILABLE_MODELS, DESIGN_PATTERNS } from './constants';
import { useProjectSpecHistory } from './hooks/useProjectSpecHistory';
import Header from './components/Header';
import FormField from './components/FormField';
import RepeatableField from './components/RepeatableField';
import OutputDisplay from './components/OutputDisplay';
import DebugWindow from './components/DebugWindow';
import HistoryPanel from './components/HistoryPanel';
import { SparklesIcon } from './components/icons';

const LOCAL_STORAGE_KEY = 'ai-php-project-spec';

const initialSpec: ProjectSpec = {
  projectName: 'Modern Laravel API with Redis',
  projectType: 'API',
  goal: 'To create a robust and scalable API backend for a SaaS product, focusing on performance and maintainability.',
  coreFeatures: ['User Authentication (JWT/Sanctum)', 'Team & Subscription Management', 'CRUD endpoints for Products', 'Background Job Processing'],
  
  phpVersion: '8.3',
  framework: 'Laravel',
  webServer: ['Nginx'],
  database: 'PostgreSQL',
  frontendStack: ['Vue.js with Inertia.js'],

  composerPackages: [
    'laravel/sanctum', 'spatie/laravel-query-builder', 'pestphp/pest-plugin-laravel', 'spatie/laravel-permission', 'laravel/horizon'
  ],
  psrStandards: ['PSR-12', 'PSR-4', 'PSR-7'],

  databaseLayer: 'Eloquent ORM',
  useMigrations: true,
  authMethod: 'Laravel Sanctum',
  designPatterns: ['Repository Pattern', 'Service Container (DI)', 'API Resources', 'DTOs'],
  
  cachingLayer: 'Redis',
  queueSystem: 'Redis (Horizon)',
  monologChannels: ['daily', 'slack'],
  useApiRateLimiting: true,
  isApiFirst: true,

  keyCommands: [
    'composer install', 'php artisan serve', 'php artisan migrate --seed', './vendor/bin/pest', 'php artisan horizon'
  ],
  
  model: 'gemini-2.5-pro',
  temperature: 0.1,
  topP: 0.95,
  enableThinking: true,
};

const loadSpecFromLocalStorage = (): ProjectSpec => {
  try {
    const savedSpec = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSpec) {
      const parsedSpec = JSON.parse(savedSpec);
      // Merge with initialSpec to ensure new fields are present
      return { ...initialSpec, ...parsedSpec };
    }
  } catch (error) {
    console.error("Failed to load or parse spec from localStorage", error);
  }
  return initialSpec;
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-xl font-semibold text-indigo-300 border-b border-gray-600 pb-2 mt-6 mb-4">{title}</h3>
);


function App() {
  const [spec, setSpec] = useState<ProjectSpec>(loadSpecFromLocalStorage);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebugWindow, setShowDebugWindow] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);

  const { history, addToHistory, removeFromHistory, clearHistory } = useProjectSpecHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(spec));
  }, [spec]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isNumber = (e.target as HTMLInputElement).type === 'range';
    
    setSpec((prev) => ({ 
      ...prev, 
      [name]: isNumber ? parseFloat(value) : value 
    }));
  };
  
  const handleArrayChange = (name: keyof ProjectSpec, values: string[]) => {
    setSpec(prev => ({...prev, [name]: values}))
  }

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSpec(prev => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setSpec(prev => {
      const currentValues = (prev[name as keyof ProjectSpec] as string[]) || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFramework = e.target.value;
    const preset = FRAMEWORK_PRESETS[newFramework as keyof typeof FRAMEWORK_PRESETS];
    
    setSpec(prev => ({
        ...prev,
        framework: newFramework,
        ...(preset && {
            composerPackages: Array.from(new Set([...prev.composerPackages, ...preset.composerPackages])),
            keyCommands: preset.keyCommands,
            databaseLayer: preset.databaseLayer,
            authMethod: preset.authMethod,
            psrStandards: Array.from(new Set([...prev.psrStandards, ...preset.psrStandards])),
            designPatterns: Array.from(new Set([...prev.designPatterns, ...preset.designPatterns])),
        })
    }));
  };

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    setDebugInfo(null);
    try {
      const result: GenerationResult = await generateProjectPlan(spec);
      setGeneratedPlan(result.plan);
      setDebugInfo({
        prompt: result.prompt,
        config: result.config,
        rawResponse: result.plan,
      });
      addToHistory(spec, result.plan);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to generate plan. Please ensure your API key is configured correctly and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [spec, addToHistory]);
  
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.projectName.replace(/\s+/g, '_')}_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedSpec = JSON.parse(event.target?.result as string);
          // Simple validation
          if (importedSpec.projectName && importedSpec.framework) {
             setSpec(prev => ({ ...prev, ...importedSpec }));
          } else {
            alert('Invalid spec file format.');
          }
        } catch (error) {
          alert('Failed to parse the spec file.');
          console.error("Import error:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const loadHistoryItem = (item: HistoryItem) => {
    setSpec(item.spec);
    setGeneratedPlan(item.plan);
    setDebugInfo(null);
    setShowHistoryPanel(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header 
        onToggleHistory={() => setShowHistoryPanel(p => !p)}
        onImport={handleImportClick}
        onExport={handleExport}
      />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />

      <HistoryPanel 
        isOpen={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        history={history}
        onLoad={loadHistoryItem}
        onDelete={removeFromHistory}
        onClear={clearHistory}
      />
      
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-6">
        {/* Input Form Column */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-100px)] p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-400 border-b-2 border-indigo-500 pb-2">PHP Project Configuration</h2>
            
            <SectionHeader title="Core Details" />
            <FormField label="Project Name" description="What is the name of your project?">
              <input type="text" name="projectName" value={spec.projectName} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </FormField>

            <FormField label="Project Type / Preset" description="Select a preset to guide the AI.">
              <select name="projectType" value={spec.projectType} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option>API</option><option>Marketplace</option><option>CMS-based Website</option><option>Internal Tool</option><option>Library</option><option>Custom</option>
              </select>
            </FormField>

            <FormField label="Main Goal" description="Briefly describe the primary objective of this project.">
              <textarea name="goal" value={spec.goal} onChange={handleInputChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </FormField>

            <RepeatableField label="Core Features" description="List the main functionalities." values={spec.coreFeatures} onChange={(values) => handleArrayChange('coreFeatures', values)} />
            
            <SectionHeader title="Technology Stack" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="PHP Version" description="Select the target PHP version.">
                <select name="phpVersion" value={spec.phpVersion} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option>8.3</option><option>8.2</option><option>8.1</option><option>8.0</option></select>
              </FormField>
              <FormField label="Framework" description="Choose a PHP framework (autofills suggestions).">
                <select name="framework" value={spec.framework} onChange={handleFrameworkChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option>Laravel</option><option>Symfony</option><option>CodeIgniter</option><option>Custom / Vanilla PHP</option></select>
              </FormField>
              <FormField label="Database" description="Select the primary database.">
                <select name="database" value={spec.database} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option>PostgreSQL</option><option>MySQL</option><option>MariaDB</option><option>SQLite</option></select>
              </FormField>
               <FormField label="Web Server(s)" description="Check all that apply.">
                <div className="flex flex-wrap gap-4 mt-2">
                  {['Nginx', 'Apache', 'LiteSpeed'].map(server => ( <label key={server} className="flex items-center gap-2"> <input type="checkbox" name="webServer" value={server} checked={spec.webServer.includes(server)} onChange={handleCheckboxArrayChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>{server}</label>))}
                </div>
              </FormField>
            </div>
            <RepeatableField label="Frontend Stack" description="List any frontend libraries or frameworks." values={spec.frontendStack} onChange={(values) => handleArrayChange('frontendStack', values)} />

            <SectionHeader title="Advanced Architecture" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField label="Caching Layer" description="Select a caching solution.">
                    <select name="cachingLayer" value={spec.cachingLayer} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option>Redis</option><option>Memcached</option><option>File</option><option>None</option>
                    </select>
                </FormField>
                <FormField label="Queue System" description="Backend for background jobs.">
                    <select name="queueSystem" value={spec.queueSystem} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option>Redis (Horizon)</option><option>RabbitMQ</option><option>Database</option><option>Sync (None)</option>
                    </select>
                </FormField>
             </div>
             <RepeatableField label="Monolog Channels" description="Specify logging channels." values={spec.monologChannels} onChange={(values) => handleArrayChange('monologChannels', values)} />
            <FormField label="Architectural Flags" description="Enable common architectural patterns.">
              <div className="flex flex-col gap-2 mt-2">
                 <label className="flex items-center gap-2"><input type="checkbox" name="useApiRateLimiting" checked={spec.useApiRateLimiting} onChange={handleBooleanChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>Enable API Rate Limiting</label>
                 <label className="flex items-center gap-2"><input type="checkbox" name="isApiFirst" checked={spec.isApiFirst} onChange={handleBooleanChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>API-First Approach (e.g., for SPAs/mobile)</label>
                 <label className="flex items-center gap-2"><input type="checkbox" name="useMigrations" checked={spec.useMigrations} onChange={handleBooleanChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>Use Database Migrations</label>
              </div>
            </FormField>

            <SectionHeader title="PHP & Design Patterns" />
             <FormField label="PSR Standards" description="Select PSRs to comply with.">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {['PSR-12', 'PSR-4', 'PSR-7', 'PSR-11', 'PSR-15', 'PSR-3'].map(psr => (<label key={psr} className="flex items-center gap-2"><input type="checkbox" name="psrStandards" value={psr} checked={spec.psrStandards.includes(psr)} onChange={handleCheckboxArrayChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>{psr}</label>))}
              </div>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField label="DB Layer / ORM" description="How will you interact with the DB?">
                <select name="databaseLayer" value={spec.databaseLayer} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option>Eloquent ORM</option><option>Doctrine</option><option>Plain PDO</option><option>RedBeanPHP</option></select>
              </FormField>
              <FormField label="Authentication" description="Choose an authentication method.">
                <select name="authMethod" value={spec.authMethod} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option>Laravel Sanctum</option><option>JWT (JSON Web Tokens)</option><option>Session-based</option><option>None</option></select>
              </FormField>
            </div>
             <FormField label="Design Patterns" description="Select common design patterns to include.">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {DESIGN_PATTERNS.map(pattern => ( <label key={pattern} className="flex items-center gap-2"><input type="checkbox" name="designPatterns" value={pattern} checked={spec.designPatterns.includes(pattern)} onChange={handleCheckboxArrayChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>{pattern}</label>))}
                </div>
            </FormField>

            <SectionHeader title="Dependencies & Tooling" />
            <RepeatableField label="Composer Packages" description="Add key dependencies." values={spec.composerPackages} onChange={(values) => handleArrayChange('composerPackages', values)} />
            <RepeatableField label="Key Commands" description="List common project commands." values={spec.keyCommands} onChange={(values) => handleArrayChange('keyCommands', values)} />

             <SectionHeader title="AI & Generation Settings" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="AI Model" description="Select the Gemini model.">
                    <select name="model" value={spec.model} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        {AVAILABLE_MODELS.map(model => (<option key={model} value={model}>{model}</option>))}
                    </select>
                </FormField>
                 <FormField label="Enable Thinking" description="Allow model more time for complex tasks.">
                    <label className="flex items-center gap-2 mt-2"><input type="checkbox" name="enableThinking" checked={spec.enableThinking} onChange={handleBooleanChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"/>Use Thinking Budget</label>
                </FormField>
            </div>
            <FormField label={`Temperature: ${spec.temperature.toFixed(2)}`} description="Controls randomness. Lower is more deterministic.">
                <input type="range" name="temperature" min="0" max="1" step="0.01" value={spec.temperature} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
            </FormField>
             <FormField label={`Top-P: ${spec.topP.toFixed(2)}`} description="Nucleus sampling. Controls diversity.">
                <input type="range" name="topP" min="0.01" max="1" step="0.01" value={spec.topP} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
            </FormField>
          </div>
        </div>

        {/* Output Column */}
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col max-h-[calc(100vh-100px)]">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-indigo-400">Generated Plan</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDebugWindow(!showDebugWindow)}
                className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Toggle AI Inspector"
              >
                {showDebugWindow ? 'Hide Debug' : 'Show Debug'}
              </button>
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate PHP Plan
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto relative">
             <OutputDisplay plan={generatedPlan} isLoading={isLoading} error={error} />
          </div>
          {showDebugWindow && debugInfo && <DebugWindow debugInfo={debugInfo} />}
        </div>
      </main>
    </div>
  );
}

export default App;
