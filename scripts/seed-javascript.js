require('dotenv').config();
const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'docpress',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// Comprehensive JavaScript topics with full content
const jsTopicsData = [
  // Topic 1: Introduction to JavaScript
  {
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript, its history, and why it's essential for web development",
    concepts: [
      {
        title: "What is JavaScript?",
        content: `<h1>What is JavaScript?</h1>
<p>JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Dynamic typing</strong> - Variables can hold values of any type</li>
  <li><strong>First-class functions</strong> - Functions are treated as first-class citizens</li>
  <li><strong>Prototype-based</strong> - Object-oriented programming using prototypes</li>
  <li><strong>Multi-paradigm</strong> - Supports procedural, object-oriented, and functional programming</li>
</ul>

<h2>Use Cases</h2>
<p>JavaScript is used for:</p>
<ul>
  <li>Front-end web development (React, Vue, Angular)</li>
  <li>Back-end development (Node.js)</li>
  <li>Mobile app development (React Native, Ionic)</li>
  <li>Desktop applications (Electron)</li>
  <li>Game development</li>
  <li>IoT and embedded systems</li>
</ul>

<h2>Example</h2>
<pre><code>// Your first JavaScript code
console.log("Hello, JavaScript!");

// Variables and data types
let message = "Welcome to JavaScript";
const year = 2025;
let isAwesome = true;

console.log(message, year, isAwesome);</code></pre>`
      },
      {
        title: "JavaScript History and Evolution",
        content: `<h1>JavaScript History and Evolution</h1>
<p>JavaScript was created by Brendan Eich in just 10 days in May 1995 while working at Netscape Communications. Originally called Mocha, then LiveScript, it was finally renamed JavaScript.</p>

<h2>Timeline</h2>
<ul>
  <li><strong>1995</strong> - JavaScript created by Brendan Eich</li>
  <li><strong>1997</strong> - ECMAScript 1 standardized</li>
  <li><strong>2009</strong> - ECMAScript 5 (ES5) - strict mode, JSON support</li>
  <li><strong>2015</strong> - ECMAScript 6 (ES6/ES2015) - major update with classes, modules, arrow functions</li>
  <li><strong>2016-Present</strong> - Yearly releases (ES2016, ES2017, etc.)</li>
</ul>

<h2>Modern JavaScript (ES6+)</h2>
<p>ES6 introduced revolutionary features that transformed JavaScript development:</p>
<pre><code>// Arrow functions
const greet = (name) => \`Hello, \${name}!\`;

// Destructuring
const { firstName, lastName } = person;

// Classes
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

// Modules
export default MyComponent;
import MyComponent from './MyComponent';</code></pre>`
      },
      {
        title: "Setting Up Your Environment",
        content: `<h1>Setting Up Your Environment</h1>
<p>To start writing JavaScript, you need a development environment. Here are the essential tools:</p>

<h2>1. Web Browser</h2>
<p>Modern browsers come with built-in JavaScript engines:</p>
<ul>
  <li>Chrome - V8 engine</li>
  <li>Firefox - SpiderMonkey</li>
  <li>Safari - JavaScriptCore</li>
  <li>Edge - V8 engine</li>
</ul>

<h2>2. Text Editor / IDE</h2>
<p>Popular choices for JavaScript development:</p>
<ul>
  <li><strong>Visual Studio Code</strong> - Free, feature-rich, most popular</li>
  <li><strong>WebStorm</strong> - Full-featured IDE by JetBrains</li>
  <li><strong>Sublime Text</strong> - Lightweight and fast</li>
  <li><strong>Atom</strong> - Hackable text editor</li>
</ul>

<h2>3. Node.js (Optional)</h2>
<p>For running JavaScript outside the browser:</p>
<pre><code>// Install Node.js from nodejs.org
// Then run JavaScript files:
node myScript.js

// Use REPL (Read-Eval-Print Loop):
node
> console.log("Hello from Node!")
Hello from Node!</code></pre>

<h2>Your First HTML + JavaScript File</h2>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;My First JavaScript&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Hello World!&lt;/h1&gt;

  &lt;script&gt;
    console.log("Check the browser console!");
    alert("Welcome to JavaScript!");
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`
      }
    ]
  },

  // Topic 2: Variables and Data Types
  {
    title: "Variables and Data Types",
    description: "Understanding JavaScript variables, data types, and type conversion",
    concepts: [
      {
        title: "Variables: var, let, and const",
        content: `<h1>Variables: var, let, and const</h1>
<p>JavaScript provides three ways to declare variables, each with different scoping rules and behaviors.</p>

<h2>var (Legacy)</h2>
<pre><code>var name = "John";
var age = 30;
var age = 25; // Redeclaration allowed
console.log(age); // 25

// Function scoped
function example() {
  var x = 10;
  if (true) {
    var x = 20; // Same variable!
    console.log(x); // 20
  }
  console.log(x); // 20
}</code></pre>

<h2>let (Modern, Block-scoped)</h2>
<pre><code>let name = "Jane";
// let name = "John"; // Error: Already declared

// Block scoped
function example() {
  let x = 10;
  if (true) {
    let x = 20; // Different variable
    console.log(x); // 20
  }
  console.log(x); // 10
}

// Use in loops
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
} // Prints: 0, 1, 2</code></pre>

<h2>const (Constant Reference)</h2>
<pre><code>const PI = 3.14159;
// PI = 3.14; // Error: Assignment to constant

// Object properties can be modified
const person = { name: "Alice" };
person.name = "Bob"; // OK
person.age = 30; // OK
// person = {}; // Error: Assignment to constant

// Array elements can be modified
const numbers = [1, 2, 3];
numbers.push(4); // OK
// numbers = []; // Error</code></pre>

<h2>Best Practices</h2>
<ul>
  <li>Use <code>const</code> by default</li>
  <li>Use <code>let</code> when you need to reassign</li>
  <li>Avoid <code>var</code> in modern JavaScript</li>
  <li>Use descriptive variable names</li>
  <li>Follow naming conventions (camelCase)</li>
</ul>`
      },
      {
        title: "Primitive Data Types",
        content: `<h1>Primitive Data Types</h1>
<p>JavaScript has 7 primitive data types that are immutable and stored by value.</p>

<h2>1. String</h2>
<pre><code>let single = 'Single quotes';
let double = "Double quotes";
let template = \`Template literal with \${single}\`;

// String methods
let text = "JavaScript";
console.log(text.length); // 10
console.log(text.toUpperCase()); // JAVASCRIPT
console.log(text.substring(0, 4)); // Java
console.log(text.includes("Script")); // true
console.log(text.split("")); // ['J','a','v','a','s','c','r','i','p','t']</code></pre>

<h2>2. Number</h2>
<pre><code>let integer = 42;
let float = 3.14;
let negative = -10;
let scientific = 2.5e6; // 2500000

// Special values
let infinity = Infinity;
let notANumber = NaN;

// Number methods
console.log(Number.isInteger(42)); // true
console.log(parseFloat("3.14")); // 3.14
console.log(parseInt("42px")); // 42
console.log((3.14159).toFixed(2)); // "3.14"

// Math operations
console.log(Math.round(3.7)); // 4
console.log(Math.max(1, 5, 3)); // 5
console.log(Math.random()); // Random between 0-1</code></pre>

<h2>3. Boolean</h2>
<pre><code>let isTrue = true;
let isFalse = false;

// Boolean conversions
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean("hello")); // true

// Truthy and Falsy values
// Falsy: false, 0, "", null, undefined, NaN
// Everything else is truthy</code></pre>

<h2>4. Undefined</h2>
<pre><code>let x;
console.log(x); // undefined
console.log(typeof x); // "undefined"

function noReturn() {
  // No return statement
}
console.log(noReturn()); // undefined</code></pre>

<h2>5. Null</h2>
<pre><code>let empty = null;
console.log(empty); // null
console.log(typeof empty); // "object" (historical bug)

// null vs undefined
console.log(null == undefined); // true (loose equality)
console.log(null === undefined); // false (strict equality)</code></pre>

<h2>6. Symbol (ES6)</h2>
<pre><code>let sym1 = Symbol("description");
let sym2 = Symbol("description");
console.log(sym1 === sym2); // false (unique)

// Use case: unique object keys
const id = Symbol("id");
const user = {
  [id]: 12345,
  name: "John"
};</code></pre>

<h2>7. BigInt (ES2020)</h2>
<pre><code>let big = 9007199254740991n;
let alsoBig = BigInt(9007199254740991);
console.log(big + 1n); // 9007199254740992n

// Cannot mix BigInt with Number
// console.log(big + 1); // Error!</code></pre>`
      },
      {
        title: "Type Conversion and Coercion",
        content: `<h1>Type Conversion and Coercion</h1>

<h2>Explicit Type Conversion</h2>
<pre><code>// To String
String(123); // "123"
String(true); // "true"
(123).toString(); // "123"

// To Number
Number("123"); // 123
Number("12.5"); // 12.5
Number("hello"); // NaN
parseInt("42px"); // 42
parseFloat("3.14"); // 3.14
+"123"; // 123 (unary plus)

// To Boolean
Boolean(1); // true
Boolean(0); // false
Boolean(""); // false
Boolean("hello"); // true
!!"hello"; // true (double negation)</code></pre>

<h2>Implicit Type Coercion</h2>
<pre><code>// String coercion
"5" + 3; // "53"
"Hello" + " " + "World"; // "Hello World"

// Number coercion
"5" - 3; // 2
"5" * "2"; // 10
"10" / 2; // 5
+"42"; // 42

// Boolean coercion
if ("hello") { } // truthy
if (0) { } // falsy

// Comparison coercion
"5" == 5; // true (loose equality)
"5" === 5; // false (strict equality)
null == undefined; // true
null === undefined; // false</code></pre>

<h2>Common Pitfalls</h2>
<pre><code>// Addition vs Concatenation
console.log(1 + 2 + "3"); // "33"
console.log("1" + 2 + 3); // "123"

// NaN propagation
console.log(0 / 0); // NaN
console.log(NaN + 5); // NaN
console.log(NaN === NaN); // false
console.log(isNaN(NaN)); // true

// Falsy values
console.log(0 == false); // true
console.log("" == false); // true
console.log(null == false); // false
console.log(undefined == false); // false</code></pre>

<h2>typeof Operator</h2>
<pre><code>console.log(typeof "hello"); // "string"
console.log(typeof 42); // "number"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (bug!)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function(){}); // "function"
console.log(typeof Symbol()); // "symbol"
console.log(typeof 10n); // "bigint"</code></pre>`
      }
    ]
  },

  // Topic 3: Operators
  {
    title: "Operators and Expressions",
    description: "Arithmetic, comparison, logical, and other JavaScript operators",
    concepts: [
      {
        title: "Arithmetic Operators",
        content: `<h1>Arithmetic Operators</h1>

<h2>Basic Arithmetic</h2>
<pre><code>let a = 10, b = 3;

console.log(a + b);  // 13 (Addition)
console.log(a - b);  // 7  (Subtraction)
console.log(a * b);  // 30 (Multiplication)
console.log(a / b);  // 3.333... (Division)
console.log(a % b);  // 1  (Modulus/Remainder)
console.log(a ** b); // 1000 (Exponentiation - ES2016)

// Integer division
console.log(Math.floor(10 / 3)); // 3</code></pre>

<h2>Increment and Decrement</h2>
<pre><code>let x = 5;

// Post-increment (returns old value, then increments)
console.log(x++); // 5
console.log(x);   // 6

// Pre-increment (increments, then returns new value)
console.log(++x); // 7

// Post-decrement
console.log(x--); // 7
console.log(x);   // 6

// Pre-decrement
console.log(--x); // 5</code></pre>

<h2>Assignment Operators</h2>
<pre><code>let num = 10;

num += 5;  // num = num + 5  -> 15
num -= 3;  // num = num - 3  -> 12
num *= 2;  // num = num * 2  -> 24
num /= 4;  // num = num / 4  -> 6
num %= 4;  // num = num % 4  -> 2
num **= 3; // num = num ** 3 -> 8

// Logical assignment (ES2021)
let value = null;
value ??= 10; // Assign if null or undefined
value ||= 20; // Assign if falsy
value &&= 30; // Assign if truthy</code></pre>

<h2>String Operations</h2>
<pre><code>// Concatenation
let first = "Hello";
let last = "World";
console.log(first + " " + last); // "Hello World"

// Template literals (preferred)
console.log(\`\${first} \${last}\`); // "Hello World"

// Number coercion with strings
console.log("5" + 3);  // "53" (string)
console.log("5" - 3);  // 2 (number)
console.log("5" * "2"); // 10 (number)
console.log("10" / 2); // 5 (number)</code></pre>

<h2>Operator Precedence</h2>
<pre><code>// Multiplication before addition
console.log(2 + 3 * 4); // 14 (not 20)

// Use parentheses for clarity
console.log((2 + 3) * 4); // 20

// Precedence order (high to low):
// 1. Grouping: ()
// 2. Exponentiation: **
// 3. Multiplication, Division, Modulus: *, /, %
// 4. Addition, Subtraction: +, -
// 5. Comparison: <, >, <=, >=
// 6. Equality: ==, !=, ===, !==
// 7. Logical AND: &&
// 8. Logical OR: ||
// 9. Assignment: =, +=, -=, etc.</code></pre>`
      },
      {
        title: "Comparison Operators",
        content: `<h1>Comparison Operators</h1>

<h2>Equality Operators</h2>
<pre><code>// Loose Equality (==) - with type coercion
console.log(5 == "5");   // true
console.log(1 == true);  // true
console.log(0 == false); // true
console.log(null == undefined); // true
console.log("" == 0); // true

// Strict Equality (===) - no type coercion
console.log(5 === "5");  // false
console.log(5 === 5);    // true
console.log(1 === true); // false
console.log(null === undefined); // false

// Best Practice: Always use === and !==</code></pre>

<h2>Inequality Operators</h2>
<pre><code>// Loose inequality
console.log(5 != "5");   // false
console.log(5 != 6);     // true

// Strict inequality
console.log(5 !== "5");  // true
console.log(5 !== 5);    // false</code></pre>

<h2>Relational Operators</h2>
<pre><code>console.log(10 > 5);     // true
console.log(10 >= 10);   // true
console.log(5 < 10);     // true
console.log(5 <= 4);     // false

// String comparison (lexicographical)
console.log("apple" < "banana"); // true
console.log("Z" < "a"); // true (uppercase before lowercase)

// Comparing different types
console.log("10" > 5); // true (string converted to number)
console.log("apple" > 5); // false (NaN comparison)</code></pre>

<h2>Special Comparisons</h2>
<pre><code>// NaN comparisons
console.log(NaN == NaN);  // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true
console.log(isNaN(NaN)); // true

// Object comparisons (by reference)
const obj1 = { value: 1 };
const obj2 = { value: 1 };
const obj3 = obj1;

console.log(obj1 == obj2);  // false
console.log(obj1 === obj3); // true

// Array comparisons
console.log([1,2,3] == [1,2,3]); // false
console.log([1,2,3] === [1,2,3]); // false</code></pre>`
      },
      {
        title: "Logical Operators",
        content: `<h1>Logical Operators</h1>

<h2>Logical AND (&&)</h2>
<pre><code>console.log(true && true);   // true
console.log(true && false);  // false
console.log(false && true);  // false
console.log(false && false); // false

// Short-circuit evaluation
let x = 5;
(x > 0) && console.log("Positive"); // Executes
(x < 0) && console.log("Negative"); // Doesn't execute

// Return first falsy or last value
console.log(1 && 2 && 3); // 3
console.log(1 && 0 && 3); // 0
console.log(null && "hello"); // null</code></pre>

<h2>Logical OR (||)</h2>
<pre><code>console.log(true || false);  // true
console.log(false || true);  // true
console.log(false || false); // false

// Default values
let username = "";
let display = username || "Guest";
console.log(display); // "Guest"

// Return first truthy or last value
console.log(0 || 1 || 2); // 1
console.log(0 || false || null); // null
console.log("" || "hello"); // "hello"</code></pre>

<h2>Logical NOT (!)</h2>
<pre><code>console.log(!true);   // false
console.log(!false);  // true
console.log(!0);      // true
console.log(!"");     // true
console.log(!"hello"); // false

// Double negation (convert to boolean)
console.log(!!"hello"); // true
console.log(!!0); // false</code></pre>

<h2>Nullish Coalescing (??) - ES2020</h2>
<pre><code>// Returns right side if left is null or undefined
let value = null ?? "default";   // "default"
let zero = 0 ?? "default";       // 0 (not null/undefined)
let empty = "" ?? "default";     // "" (not null/undefined)
let undef = undefined ?? "default"; // "default"

// Difference from ||
console.log(0 || 10);  // 10 (0 is falsy)
console.log(0 ?? 10);  // 0 (0 is not null/undefined)

console.log("" || "default"); // "default"
console.log("" ?? "default"); // ""</code></pre>

<h2>Optional Chaining (?.) - ES2020</h2>
<pre><code>const user = {
  name: "John",
  address: {
    city: "NYC"
  }
};

// Safe property access
console.log(user?.name); // "John"
console.log(user?.phone); // undefined
console.log(user?.address?.city); // "NYC"
console.log(user?.address?.zipcode); // undefined

// Without optional chaining (would throw error)
// console.log(user.contacts.email); // Error!

// With optional chaining
console.log(user?.contacts?.email); // undefined

// Optional function calls
const obj = {
  method: () => "Hello"
};

console.log(obj.method?.()); // "Hello"
console.log(obj.missing?.()); // undefined</code></pre>

<h2>Combining Logical Operators</h2>
<pre><code>// Precedence: ! > && > ||
let a = true, b = false, c = true;

console.log(a || b && c); // true (same as a || (b && c))
console.log((a || b) && c); // true

// Complex conditions
const age = 25;
const hasLicense = true;
const hasInsurance = true;

const canDrive = age >= 18 && hasLicense && hasInsurance;
console.log(canDrive); // true</code></pre>`
      },
      {
        title: "Other Operators",
        content: `<h1>Other Operators</h1>

<h2>Ternary Operator (?:)</h2>
<pre><code>// Syntax: condition ? valueIfTrue : valueIfFalse
let age = 18;
let canVote = age >= 18 ? "Yes" : "No";
console.log(canVote); // "Yes"

// Nested ternary (use sparingly)
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" :
            score >= 60 ? "D" : "F";

// Ternary in JSX (React)
<div>
  {isLoggedIn ? <UserProfile /> : <LoginButton />}
</div></code></pre>

<h2>typeof Operator</h2>
<pre><code>console.log(typeof "hello"); // "string"
console.log(typeof 42); // "number"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (historical bug)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function(){}); // "function"

// Checking for undefined
if (typeof myVar === "undefined") {
  console.log("Variable is undefined");
}</code></pre>

<h2>instanceof Operator</h2>
<pre><code>// Check if object is instance of class/constructor
const arr = [1, 2, 3];
const date = new Date();

console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true
console.log(date instanceof Date); // true
console.log(date instanceof Array); // false

// Custom classes
class Person {}
const john = new Person();
console.log(john instanceof Person); // true</code></pre>

<h2>in Operator</h2>
<pre><code>// Check if property exists in object
const car = {
  brand: "Toyota",
  model: "Camry"
};

console.log("brand" in car); // true
console.log("color" in car); // false

// Works with arrays
const arr = ["a", "b", "c"];
console.log(0 in arr); // true (index exists)
console.log(5 in arr); // false</code></pre>

<h2>delete Operator</h2>
<pre><code>// Remove property from object
const person = {
  name: "John",
  age: 30,
  city: "NYC"
};

delete person.age;
console.log(person); // { name: "John", city: "NYC" }

// Cannot delete variables
let x = 10;
delete x; // false (doesn't work)</code></pre>

<h2>Comma Operator</h2>
<pre><code>// Evaluate multiple expressions, return last
let a = (1, 2, 3);
console.log(a); // 3

// In for loops
for (let i = 0, j = 10; i < 5; i++, j--) {
  console.log(i, j);
}</code></pre>

<h2>void Operator</h2>
<pre><code>// Evaluate expression and return undefined
console.log(void 0); // undefined
console.log(void (2 + 2)); // undefined

// Common use: prevent navigation
// <a href="javascript:void(0)">Click</a></code></pre>

<h2>Spread Operator (...)</h2>
<pre><code>// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
const numbers = [1, 5, 3, 9, 2];
console.log(Math.max(...numbers)); // 9</code></pre>`
      }
    ]
  }
];

async function seedJavaScript() {
  try {
    console.log('Connecting to databases...');
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docpress');
    console.log('MongoDB connected');

    // Get or create JavaScript subject
    const subjectId = uuidv4();
    const subjectRows = await sequelize.query(`
      INSERT INTO subjects (id, title, slug, description, "displayOrder", "isPublished", "authorId", "createdAt", "updatedAt")
      VALUES (
        :id, 'JavaScript', 'javascript',
        'Comprehensive JavaScript documentation covering basics to advanced concepts',
        1, true,
        (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
      RETURNING id
    `, {
      replacements: { id: subjectId }
    });

    const finalSubjectId = subjectRows[0][0].id;
    console.log('Subject created/updated:', finalSubjectId);

    const Content = mongoose.model('Content', new mongoose.Schema({
      conceptId: String,
      htmlContent: String,
      rawContent: String
    }));

    for (let i = 0; i < jsTopicsData.length; i++) {
      const topicData = jsTopicsData[i];
      const topicId = uuidv4();

      const topicRows = await sequelize.query(`
        INSERT INTO topics (id, title, slug, description, "subjectId", "displayOrder", "isPublished", "createdAt", "updatedAt")
        VALUES (:id, :title, :slug, :description, :subjectId, :displayOrder, true, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id
      `, {
        replacements: {
          id: topicId,
          title: topicData.title,
          slug: topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: topicData.description,
          subjectId: finalSubjectId,
          displayOrder: i + 1
        }
      });

      const finalTopicId = topicRows[0][0].id;
      console.log('Topic created:', topicData.title);

      for (let j = 0; j < topicData.concepts.length; j++) {
        const concept = topicData.concepts[j];
        const conceptId = uuidv4();

        const mongoContent = await Content.create({
          conceptId: conceptId,
          htmlContent: concept.content,
          rawContent: concept.content
        });

        await sequelize.query(`
          INSERT INTO concepts (
            id, title, slug, "topicId", "contentId",
            "displayOrder", "isPublished", "createdAt", "updatedAt", "lastRevisedOn"
          )
          VALUES (:id, :title, :slug, :topicId, :contentId, :displayOrder, true, NOW(), NOW(), NOW())
          ON CONFLICT (slug) DO NOTHING
        `, {
          replacements: {
            id: conceptId,
            title: concept.title,
            slug: concept.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            topicId: finalTopicId,
            contentId: mongoContent._id.toString(),
            displayOrder: j + 1
          }
        });

        console.log('  - Concept:', concept.title);
      }
    }

    console.log('\nSuccess! Created', jsTopicsData.length, 'topics with full content');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    await mongoose.connection.close();
    console.log('Connections closed');
  }
}

seedJavaScript();
