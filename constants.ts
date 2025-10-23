export const AVAILABLE_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash'];

export const DESIGN_PATTERNS = [
  'Repository Pattern',
  'Service Container (DI)',
  'DTOs (Data Transfer Objects)',
  'API Resources',
  'Middleware',
  'Factory Pattern',
  'Strategy Pattern',
  'Observer Pattern',
];

export const CORE_COMPOSER_PACKAGES = [
    'monolog/monolog',
    'vlucas/phpdotenv',
    'ramsey/uuid',
    'league/flysystem',
    'phpunit/phpunit',
];

export const FRAMEWORK_PRESETS = {
  'Laravel': {
    composerPackages: ['laravel/sanctum', 'spatie/laravel-query-builder', 'pestphp/pest-plugin-laravel', 'spatie/laravel-permission', 'laravel/horizon'],
    keyCommands: ['composer install', 'php artisan serve', 'php artisan migrate --seed', './vendor/bin/pest', 'php artisan horizon'],
    databaseLayer: 'Eloquent ORM',
    authMethod: 'Laravel Sanctum',
    psrStandards: ['PSR-12', 'PSR-4'],
    designPatterns: ['Repository Pattern', 'Service Container (DI)', 'API Resources', 'DTOs'],
  },
  'Symfony': {
    composerPackages: ['symfony/orm-pack', 'symfony/maker-bundle', 'symfony/security-bundle', 'lexik/jwt-authentication-bundle', 'api-platform/core'],
    keyCommands: ['composer install', 'symfony server:start', 'php bin/console doctrine:migrations:migrate', './bin/phpunit'],
    databaseLayer: 'Doctrine',
    authMethod: 'JWT (JSON Web Tokens)',
    psrStandards: ['PSR-12', 'PSR-4', 'PSR-7', 'PSR-11'],
    designPatterns: ['Service Container (DI)', 'Repository Pattern', 'DTOs', 'Middleware'],
  },
  'Custom / Vanilla PHP': {
    composerPackages: ['vlucas/phpdotenv', 'monolog/monolog', 'league/route', 'php-di/php-di', 'illuminate/database'],
    keyCommands: ['composer install', 'php -S localhost:8000 -t public', 'vendor/bin/phinx migrate', 'vendor/bin/phpunit'],
    databaseLayer: 'Plain PDO',
    authMethod: 'JWT (JSON Web Tokens)',
    psrStandards: ['PSR-12', 'PSR-4', 'PSR-7', 'PSR-15'],
    designPatterns: ['Service Container (DI)', 'Middleware', 'Factory Pattern'],
  }
};
