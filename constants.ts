import { FacePosition, Wisdom } from './types';

export const WISDOM_DATA: Wisdom[] = [
  {
    id: 1,
    face: FacePosition.Front,
    title: 'IDE Synergy',
    summary: 'Code for your tools.',
    detail: 'If your IDE can autocomplete it, Static Analysis can understand it. Avoid string-based dependency injection or magic factories where return types are hidden from your tools.',
    codeSnippet: `// Bad: inferred as mixed/object
$db = $app->get('DB_Connection');

// Good: Explicit return type
function getDb(): DB_Connection { ... }`,
    color: 'bg-blue-600',
    iconName: 'Code',
  },
  {
    id: 2,
    face: FacePosition.Back,
    title: 'Ban Magic',
    summary: 'Explicit is better than implicit.',
    detail: 'Magic methods like __get() and __call() are quick to write but impossible to analyze reliably. Explicit methods ensure type safety, refactoring support, and readable code.',
    codeSnippet: `// Hard to analyze
public function __get($name) { ... }

// Better: Explicit API
public function getBillDates(): array { ... }`,
    color: 'bg-rose-600',
    iconName: 'Wand2',
  },
  {
    id: 3,
    face: FacePosition.Right,
    title: 'Value Objects',
    summary: 'Upgrade arrays to objects.',
    detail: 'Complex array shapes are fragile. Value Objects provide runtime type safety, immutability, and a dedicated home for domain logic. They are the robust, refactorable alternative to associative arrays.',
    codeSnippet: `// Weak: Array Shape
// ['id' => 1, 'email' => 'me@ex.com']

// Strong: Value Object
final readonly class UserVO {
  public function __construct(
    public int $id,
    public string $email,
  ) {}
}`,
    color: 'bg-emerald-600',
    iconName: 'BoxSelect',
  },
  {
    id: 4,
    face: FacePosition.Left,
    title: 'Generic Contracts',
    summary: 'Replace magic with templates.',
    detail: 'Old Active Record patterns relied on fragile @method tags. The timeless fix is explicit inheritance: use @template in abstract base classes to automatically infer child types.',
    codeSnippet: `/** @template T of Model */
abstract class Builder {
  /** @return T|null */
  public function first() { ... }
}

// User is automatically inferred
$user = User::query()->first();`,
    color: 'bg-purple-600',
    iconName: 'Type',
  },
  {
    id: 5,
    face: FacePosition.Top,
    title: 'Refactorable Code',
    summary: 'Avoid string typing.',
    detail: 'Strings are invisible to static analysis. Never use strings for class or property names. Use `::class` and meta-methods like `m()` to reference properties safely, ensuring rename refactoring works.',
    codeSnippet: `// Bad
gen($obj, 'User', 'date');

// Good
gen($obj, User::class, $obj->m()->date);`,
    color: 'bg-amber-600',
    iconName: 'ShieldAlert',
  },
  {
    id: 6,
    face: FacePosition.Bottom,
    title: 'Automated Defense',
    summary: 'Trust CI, not discipline.',
    detail: 'Code quality relies on automated gates. Use Git Hooks (CaptainHook) and CI pipelines to mechanically prevent bad patterns (like global variables) from entering your codebase.',
    codeSnippet: `// captainhook.json
{
  "pre-commit": {
    "enabled": true,
    "actions": [
      { "action": "php vendor/bin/phpcs" }
    ]
  }
}`,
    color: 'bg-cyan-600',
    iconName: 'Bot',
  },
];

export const CUBE_SIZE = 200; // px