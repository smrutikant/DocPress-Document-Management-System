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

const seedData = [
  // Chemistry Subject
  {
    title: "Chemistry",
    slug: "chemistry",
    description: "Comprehensive guide to chemistry concepts including atomic structure, chemical reactions, and organic chemistry",
    topics: [
      {
        title: "Atomic Structure",
        description: "Understanding atoms, electrons, protons, neutrons, and atomic models",
        concepts: [
          {
            title: "Introduction to Atoms",
            content: `<h1>Introduction to Atoms</h1>
<p>An atom is the smallest unit of matter that retains the properties of an element. Atoms are composed of three main subatomic particles: protons, neutrons, and electrons.</p>

<h2>Structure of an Atom</h2>
<ul>
  <li><strong>Nucleus</strong>: The central core containing protons (positive charge) and neutrons (no charge)</li>
  <li><strong>Electron Cloud</strong>: The region surrounding the nucleus where electrons (negative charge) are found</li>
</ul>

<h2>Key Properties</h2>
<pre><code>Atomic Number (Z) = Number of Protons
Mass Number (A) = Protons + Neutrons
Charge = Protons - Electrons</code></pre>

<h2>Examples</h2>
<p>Carbon-12: 6 protons, 6 neutrons, 6 electrons</p>
<p>Oxygen-16: 8 protons, 8 neutrons, 8 electrons</p>`
          },
          {
            title: "Electron Configuration",
            content: `<h1>Electron Configuration</h1>
<p>Electron configuration describes the distribution of electrons in an atom's orbitals.</p>

<h2>Orbital Order</h2>
<pre><code>1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶ 6s² 4f¹⁴ 5d¹⁰ 6p⁶ 7s²</code></pre>

<h2>Examples</h2>
<ul>
  <li>Hydrogen (H): 1s¹</li>
  <li>Carbon (C): 1s² 2s² 2p²</li>
  <li>Oxygen (O): 1s² 2s² 2p⁴</li>
  <li>Sodium (Na): 1s² 2s² 2p⁶ 3s¹</li>
</ul>

<h2>Aufbau Principle</h2>
<p>Electrons fill orbitals starting from the lowest energy level to the highest.</p>`
          },
          {
            title: "Periodic Table Trends",
            content: `<h1>Periodic Table Trends</h1>
<p>The periodic table organizes elements based on their atomic structure and chemical properties.</p>

<h2>Major Trends</h2>
<ul>
  <li><strong>Atomic Radius</strong>: Decreases left to right, increases top to bottom</li>
  <li><strong>Ionization Energy</strong>: Increases left to right, decreases top to bottom</li>
  <li><strong>Electronegativity</strong>: Increases left to right, decreases top to bottom</li>
  <li><strong>Metallic Character</strong>: Decreases left to right, increases top to bottom</li>
</ul>

<h2>Groups and Periods</h2>
<p>Groups (columns) share similar chemical properties. Periods (rows) show gradual changes in properties.</p>`
          },
          {
            title: "Isotopes and Ions",
            content: `<h1>Isotopes and Ions</h1>

<h2>Isotopes</h2>
<p>Isotopes are atoms of the same element with different numbers of neutrons.</p>
<pre><code>Carbon-12: 6 protons, 6 neutrons
Carbon-13: 6 protons, 7 neutrons
Carbon-14: 6 protons, 8 neutrons</code></pre>

<h2>Ions</h2>
<p>Ions are atoms that have gained or lost electrons.</p>
<ul>
  <li><strong>Cations</strong>: Positively charged (lost electrons) - Na⁺, Ca²⁺</li>
  <li><strong>Anions</strong>: Negatively charged (gained electrons) - Cl⁻, O²⁻</li>
</ul>

<h2>Formation</h2>
<p>Metals tend to form cations, while nonmetals tend to form anions.</p>`
          },
          {
            title: "Quantum Numbers",
            content: `<h1>Quantum Numbers</h1>
<p>Quantum numbers describe the unique quantum state of an electron in an atom.</p>

<h2>Four Quantum Numbers</h2>
<ol>
  <li><strong>Principal (n)</strong>: Energy level (1, 2, 3, ...)</li>
  <li><strong>Angular Momentum (l)</strong>: Orbital shape (0 to n-1)
    <ul>
      <li>l = 0: s orbital</li>
      <li>l = 1: p orbital</li>
      <li>l = 2: d orbital</li>
      <li>l = 3: f orbital</li>
    </ul>
  </li>
  <li><strong>Magnetic (mₗ)</strong>: Orbital orientation (-l to +l)</li>
  <li><strong>Spin (mₛ)</strong>: Electron spin (+½ or -½)</li>
</ol>

<h2>Pauli Exclusion Principle</h2>
<p>No two electrons in an atom can have the same set of four quantum numbers.</p>`
          }
        ]
      },
      {
        title: "Chemical Bonding",
        description: "Understanding ionic, covalent, and metallic bonds",
        concepts: [
          {
            title: "Ionic Bonding",
            content: `<h1>Ionic Bonding</h1>
<p>Ionic bonds form through the transfer of electrons from one atom to another, creating oppositely charged ions.</p>

<h2>Formation</h2>
<pre><code>Na → Na⁺ + e⁻  (sodium loses electron)
Cl + e⁻ → Cl⁻   (chlorine gains electron)
Na⁺ + Cl⁻ → NaCl (ionic bond forms)</code></pre>

<h2>Properties of Ionic Compounds</h2>
<ul>
  <li>High melting and boiling points</li>
  <li>Conduct electricity when molten or dissolved</li>
  <li>Form crystalline structures</li>
  <li>Generally soluble in water</li>
  <li>Hard but brittle</li>
</ul>

<h2>Common Examples</h2>
<p>NaCl (table salt), MgO (magnesium oxide), CaCl₂ (calcium chloride)</p>`
          },
          {
            title: "Covalent Bonding",
            content: `<h1>Covalent Bonding</h1>
<p>Covalent bonds form when atoms share electrons to achieve stable electron configurations.</p>

<h2>Types of Covalent Bonds</h2>
<ul>
  <li><strong>Single Bond</strong>: Share 1 pair of electrons (H-H)</li>
  <li><strong>Double Bond</strong>: Share 2 pairs of electrons (O=O)</li>
  <li><strong>Triple Bond</strong>: Share 3 pairs of electrons (N≡N)</li>
</ul>

<h2>Polar vs Nonpolar</h2>
<pre><code>Nonpolar: H₂, O₂, N₂ (equal sharing)
Polar: H₂O, HCl (unequal sharing)</code></pre>

<h2>Properties</h2>
<ul>
  <li>Lower melting points than ionic compounds</li>
  <li>Poor electrical conductors</li>
  <li>Can be gases, liquids, or solids at room temperature</li>
</ul>`
          },
          {
            title: "Lewis Structures",
            content: `<h1>Lewis Structures</h1>
<p>Lewis structures are diagrams that show the bonding between atoms and lone pairs of electrons.</p>

<h2>Steps to Draw Lewis Structures</h2>
<ol>
  <li>Count total valence electrons</li>
  <li>Arrange atoms (least electronegative in center)</li>
  <li>Draw single bonds between atoms</li>
  <li>Complete octets of outer atoms</li>
  <li>Place remaining electrons on central atom</li>
  <li>Form multiple bonds if needed</li>
</ol>

<h2>Examples</h2>
<pre><code>H₂O:  H-O-H  (2 bonding pairs, 2 lone pairs on O)
CO₂:  O=C=O  (4 bonding pairs, 4 lone pairs on O atoms)
NH₃:  H-N-H  (3 bonding pairs, 1 lone pair on N)
      |
      H</code></pre>`
          },
          {
            title: "VSEPR Theory",
            content: `<h1>VSEPR Theory</h1>
<p>Valence Shell Electron Pair Repulsion theory predicts molecular geometry based on electron pair repulsion.</p>

<h2>Common Geometries</h2>
<ul>
  <li><strong>Linear</strong>: 2 electron groups (CO₂) - 180°</li>
  <li><strong>Trigonal Planar</strong>: 3 electron groups (BF₃) - 120°</li>
  <li><strong>Tetrahedral</strong>: 4 electron groups (CH₄) - 109.5°</li>
  <li><strong>Trigonal Pyramidal</strong>: 4 groups, 1 lone pair (NH₃)</li>
  <li><strong>Bent</strong>: 4 groups, 2 lone pairs (H₂O) - 104.5°</li>
  <li><strong>Trigonal Bipyramidal</strong>: 5 groups (PCl₅)</li>
  <li><strong>Octahedral</strong>: 6 groups (SF₆) - 90°</li>
</ul>

<h2>Key Rule</h2>
<p>Electron pairs arrange themselves to minimize repulsion.</p>`
          },
          {
            title: "Molecular Polarity",
            content: `<h1>Molecular Polarity</h1>
<p>Molecular polarity depends on bond polarity and molecular geometry.</p>

<h2>Determining Polarity</h2>
<ol>
  <li>Check bond polarity (electronegativity difference)</li>
  <li>Determine molecular geometry</li>
  <li>Check if dipoles cancel out</li>
</ol>

<h2>Examples</h2>
<pre><code>Polar Molecules:
- H₂O (bent shape, dipoles don't cancel)
- NH₃ (pyramidal, dipoles don't cancel)
- HCl (linear, one bond)

Nonpolar Molecules:
- CO₂ (linear, dipoles cancel)
- CH₄ (tetrahedral, symmetric)
- CCl₄ (tetrahedral, symmetric)</code></pre>

<h2>Importance</h2>
<p>Polarity affects solubility, boiling point, and intermolecular forces.</p>`
          },
          {
            title: "Intermolecular Forces",
            content: `<h1>Intermolecular Forces</h1>
<p>Forces of attraction between molecules that affect physical properties.</p>

<h2>Types (Weakest to Strongest)</h2>
<ol>
  <li><strong>London Dispersion Forces</strong>: Present in all molecules, temporary dipoles</li>
  <li><strong>Dipole-Dipole</strong>: Between polar molecules</li>
  <li><strong>Hydrogen Bonding</strong>: Special dipole-dipole with H-F, H-O, or H-N</li>
</ol>

<h2>Effect on Properties</h2>
<pre><code>Boiling Points:
CH₄ (-162°C) < NH₃ (-33°C) < H₂O (100°C)

Stronger IMF → Higher boiling point</code></pre>

<h2>Hydrogen Bonding</h2>
<p>Responsible for water's unique properties: high boiling point, ice floats, surface tension.</p>`
          }
        ]
      }
    ]
  },

  // Python Subject
  {
    title: "Python",
    slug: "python",
    description: "Complete Python programming guide from basics to advanced topics",
    topics: [
      {
        title: "Python Basics",
        description: "Introduction to Python syntax, data types, and control structures",
        concepts: [
          {
            title: "Getting Started with Python",
            content: `<h1>Getting Started with Python</h1>
<p>Python is a high-level, interpreted programming language known for its simplicity and readability.</p>

<h2>Installation</h2>
<pre><code># Check Python version
python --version
python3 --version

# Install Python from python.org
# Or use package manager:
# macOS: brew install python
# Ubuntu: sudo apt install python3</code></pre>

<h2>Your First Program</h2>
<pre><code>print("Hello, World!")
print("Welcome to Python programming")

# Variables
name = "Alice"
age = 25
is_student = True

print(f"My name is {name} and I am {age} years old")</code></pre>

<h2>Python Features</h2>
<ul>
  <li>Easy to learn and read</li>
  <li>Extensive standard library</li>
  <li>Cross-platform</li>
  <li>Supports multiple paradigms</li>
  <li>Large community and ecosystem</li>
</ul>`
          },
          {
            title: "Data Types and Variables",
            content: `<h1>Data Types and Variables</h1>

<h2>Basic Data Types</h2>
<pre><code># Numbers
integer = 42
floating = 3.14
complex_num = 3 + 4j

# Strings
single = 'Hello'
double = "World"
multi = """This is a
multi-line string"""

# Boolean
is_active = True
is_valid = False

# None
empty = None</code></pre>

<h2>Type Checking and Conversion</h2>
<pre><code>x = 42
print(type(x))  # <class 'int'>

# Type conversion
str_num = str(42)        # "42"
int_str = int("42")      # 42
float_int = float(42)    # 42.0
bool_val = bool(1)       # True</code></pre>

<h2>Variable Naming Rules</h2>
<ul>
  <li>Start with letter or underscore</li>
  <li>Can contain letters, numbers, underscores</li>
  <li>Case-sensitive</li>
  <li>Use snake_case for variables</li>
</ul>`
          },
          {
            title: "Strings and String Methods",
            content: `<h1>Strings and String Methods</h1>

<h2>String Operations</h2>
<pre><code>text = "Python Programming"

# Indexing and slicing
print(text[0])      # 'P'
print(text[-1])     # 'g'
print(text[0:6])    # 'Python'
print(text[::-1])   # Reverse string

# String methods
print(text.upper())           # 'PYTHON PROGRAMMING'
print(text.lower())           # 'python programming'
print(text.replace('Python', 'Java'))
print(text.split())           # ['Python', 'Programming']
print(text.startswith('Py'))  # True
print(text.find('gram'))      # 11</code></pre>

<h2>String Formatting</h2>
<pre><code>name = "Alice"
age = 25

# f-strings (Python 3.6+)
print(f"My name is {name} and I'm {age}")

# format method
print("My name is {} and I'm {}".format(name, age))

# Old style
print("My name is %s and I'm %d" % (name, age))</code></pre>

<h2>Common Operations</h2>
<pre><code>s = "  hello  "
print(s.strip())       # Remove whitespace
print(s.count('l'))    # Count occurrences
print('ll' in s)       # Check substring
print(len(s))          # Length</code></pre>`
          },
          {
            title: "Lists and List Operations",
            content: `<h1>Lists and List Operations</h1>
<p>Lists are ordered, mutable collections that can hold items of different types.</p>

<h2>Creating and Accessing Lists</h2>
<pre><code># Creating lists
numbers = [1, 2, 3, 4, 5]
mixed = [1, "two", 3.0, True]
nested = [[1, 2], [3, 4], [5, 6]]

# Accessing elements
print(numbers[0])    # 1
print(numbers[-1])   # 5
print(numbers[1:4])  # [2, 3, 4]</code></pre>

<h2>List Methods</h2>
<pre><code>fruits = ['apple', 'banana', 'cherry']

# Adding elements
fruits.append('date')           # Add to end
fruits.insert(1, 'blueberry')   # Insert at index
fruits.extend(['fig', 'grape']) # Add multiple

# Removing elements
fruits.remove('banana')  # Remove by value
popped = fruits.pop()    # Remove and return last
del fruits[0]            # Delete by index
fruits.clear()           # Remove all

# Other operations
numbers = [3, 1, 4, 1, 5, 9]
numbers.sort()           # Sort in place
numbers.reverse()        # Reverse in place
count = numbers.count(1) # Count occurrences
index = numbers.index(4) # Find index</code></pre>

<h2>List Comprehensions</h2>
<pre><code># Create list with comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]</code></pre>`
          },
          {
            title: "Dictionaries and Sets",
            content: `<h1>Dictionaries and Sets</h1>

<h2>Dictionaries</h2>
<pre><code># Creating dictionaries
person = {
    'name': 'Alice',
    'age': 25,
    'city': 'NYC'
}

# Accessing values
print(person['name'])        # 'Alice'
print(person.get('email', 'N/A'))  # Get with default

# Modifying
person['age'] = 26           # Update
person['email'] = 'a@b.com'  # Add new key

# Dictionary methods
keys = person.keys()
values = person.values()
items = person.items()

# Iteration
for key, value in person.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}</code></pre>

<h2>Sets</h2>
<pre><code># Creating sets
fruits = {'apple', 'banana', 'cherry'}
numbers = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}

# Set operations
fruits.add('date')
fruits.remove('banana')
fruits.discard('grape')  # No error if not exists

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)  # Union: {1, 2, 3, 4, 5, 6}
print(a & b)  # Intersection: {3, 4}
print(a - b)  # Difference: {1, 2}
print(a ^ b)  # Symmetric difference: {1, 2, 5, 6}</code></pre>`
          },
          {
            title: "Control Flow",
            content: `<h1>Control Flow</h1>

<h2>If-Elif-Else</h2>
<pre><code>age = 18

if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")

# Ternary operator
status = "Adult" if age >= 18 else "Minor"

# Multiple conditions
if age >= 18 and age < 65:
    print("Working age")

if name == "Alice" or name == "Bob":
    print("Valid user")</code></pre>

<h2>For Loops</h2>
<pre><code># Iterate over sequence
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(fruit)

# Range
for i in range(5):          # 0 to 4
    print(i)

for i in range(2, 10, 2):   # 2, 4, 6, 8
    print(i)

# Enumerate (index and value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# Iterate dictionary
person = {'name': 'Alice', 'age': 25}
for key, value in person.items():
    print(f"{key} = {value}")</code></pre>

<h2>While Loops</h2>
<pre><code>count = 0
while count < 5:
    print(count)
    count += 1

# Break and continue
for i in range(10):
    if i == 3:
        continue  # Skip this iteration
    if i == 7:
        break     # Exit loop
    print(i)</code></pre>`
          },
          {
            title: "Functions",
            content: `<h1>Functions</h1>

<h2>Defining Functions</h2>
<pre><code>def greet(name):
    """This is a docstring"""
    return f"Hello, {name}!"

# Call function
message = greet("Alice")
print(message)

# Default parameters
def power(base, exponent=2):
    return base ** exponent

print(power(3))      # 9 (uses default)
print(power(3, 3))   # 27

# Multiple return values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

min_val, max_val, total = get_stats([1, 2, 3, 4, 5])</code></pre>

<h2>Advanced Function Features</h2>
<pre><code># *args for variable arguments
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4))  # 10

# **kwargs for keyword arguments
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")

# Lambda functions
square = lambda x: x ** 2
print(square(5))  # 25

# Map, filter, reduce
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))</code></pre>

<h2>Scope</h2>
<pre><code>x = 10  # Global variable

def func():
    x = 5  # Local variable
    print(x)

func()     # 5
print(x)   # 10

# Using global
def modify_global():
    global x
    x = 20

modify_global()
print(x)   # 20</code></pre>`
          }
        ]
      },
      {
        title: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, and OOP principles in Python",
        concepts: [
          {
            title: "Classes and Objects",
            content: `<h1>Classes and Objects</h1>

<h2>Defining Classes</h2>
<pre><code>class Person:
    # Class variable
    species = "Homo sapiens"

    # Constructor
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age

    # Instance method
    def greet(self):
        return f"Hello, I'm {self.name}"

    # String representation
    def __str__(self):
        return f"Person(name={self.name}, age={self.age})"

# Creating objects
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

print(person1.greet())  # Hello, I'm Alice
print(person1)          # Person(name=Alice, age=25)
print(Person.species)   # Homo sapiens</code></pre>

<h2>Encapsulation</h2>
<pre><code>class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private attribute

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False

    def get_balance(self):
        return self.__balance

account = BankAccount(1000)
account.deposit(500)
print(account.get_balance())  # 1500
# print(account.__balance)    # AttributeError</code></pre>`
          },
          {
            title: "Inheritance",
            content: `<h1>Inheritance</h1>

<h2>Basic Inheritance</h2>
<pre><code>class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass

    def info(self):
        return f"This is {self.name}"

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Woof!
print(dog.info())   # This is Buddy
print(cat.speak())  # Meow!</code></pre>

<h2>Super() and Method Overriding</h2>
<pre><code>class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

    def info(self):
        return f"{self.brand} {self.model}"

class Car(Vehicle):
    def __init__(self, brand, model, doors):
        super().__init__(brand, model)
        self.doors = doors

    def info(self):
        base_info = super().info()
        return f"{base_info} with {self.doors} doors"

car = Car("Toyota", "Camry", 4)
print(car.info())  # Toyota Camry with 4 doors</code></pre>

<h2>Multiple Inheritance</h2>
<pre><code>class Flyer:
    def fly(self):
        return "Flying..."

class Swimmer:
    def swim(self):
        return "Swimming..."

class Duck(Flyer, Swimmer):
    def quack(self):
        return "Quack!"

duck = Duck()
print(duck.fly())    # Flying...
print(duck.swim())   # Swimming...
print(duck.quack())  # Quack!</code></pre>`
          },
          {
            title: "Polymorphism",
            content: `<h1>Polymorphism</h1>

<h2>Method Overriding</h2>
<pre><code>class Shape:
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * self.radius ** 2

# Polymorphism in action
shapes = [Rectangle(5, 4), Circle(3), Rectangle(2, 3)]

for shape in shapes:
    print(f"Area: {shape.area()}")</code></pre>

<h2>Duck Typing</h2>
<pre><code># "If it walks like a duck and quacks like a duck..."
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class Duck:
    def speak(self):
        return "Quack!"

def animal_sound(animal):
    return animal.speak()

animals = [Dog(), Cat(), Duck()]
for animal in animals:
    print(animal_sound(animal))</code></pre>`
          },
          {
            title: "Special Methods (Magic Methods)",
            content: `<h1>Special Methods (Magic Methods)</h1>

<h2>Common Magic Methods</h2>
<pre><code>class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return 2

    def __getitem__(self, index):
        return [self.x, self.y][index]

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)     # Vector(4, 6)
print(v1 * 3)      # Vector(3, 6)
print(v1 == v2)    # False
print(len(v1))     # 2
print(v1[0])       # 1</code></pre>

<h2>Comparison Methods</h2>
<pre><code>class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __lt__(self, other):
        return self.age < other.age

    def __le__(self, other):
        return self.age <= other.age

    def __gt__(self, other):
        return self.age > other.age

    def __ge__(self, other):
        return self.age >= other.age

p1 = Person("Alice", 25)
p2 = Person("Bob", 30)

print(p1 < p2)   # True
print(p1 >= p2)  # False</code></pre>`
          },
          {
            title: "Class Methods and Static Methods",
            content: `<h1>Class Methods and Static Methods</h1>

<h2>Class Methods</h2>
<pre><code>class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string):
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)

    @classmethod
    def today(cls):
        import datetime
        now = datetime.date.today()
        return cls(now.year, now.month, now.day)

    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

# Using class methods
date1 = Date(2025, 12, 8)
date2 = Date.from_string("2025-12-25")
date3 = Date.today()

print(date1)  # 2025-12-08
print(date2)  # 2025-12-25</code></pre>

<h2>Static Methods</h2>
<pre><code>class MathUtils:
    @staticmethod
    def add(x, y):
        return x + y

    @staticmethod
    def multiply(x, y):
        return x * y

    @staticmethod
    def is_even(n):
        return n % 2 == 0

# No need to create instance
print(MathUtils.add(5, 3))        # 8
print(MathUtils.is_even(4))       # True</code></pre>

<h2>Property Decorators</h2>
<pre><code>class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self._celsius = (value - 32) * 5/9

temp = Temperature(25)
print(temp.celsius)      # 25
print(temp.fahrenheit)   # 77.0
temp.fahrenheit = 86
print(temp.celsius)      # 30.0</code></pre>`
          },
          {
            title: "Abstract Classes and Interfaces",
            content: `<h1>Abstract Classes and Interfaces</h1>

<h2>Abstract Base Classes</h2>
<pre><code>from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass

    @abstractmethod
    def move(self):
        pass

    def eat(self):
        return "Eating..."

class Dog(Animal):
    def speak(self):
        return "Woof!"

    def move(self):
        return "Running on four legs"

# animal = Animal()  # TypeError: Can't instantiate abstract class
dog = Dog()
print(dog.speak())  # Woof!
print(dog.move())   # Running on four legs
print(dog.eat())    # Eating...</code></pre>

<h2>Interface Pattern</h2>
<pre><code>from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass

    @abstractmethod
    def refund(self, transaction_id):
        pass

class StripeProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing $amount via Stripe"

    def refund(self, transaction_id):
        return f"Refunding transaction {transaction_id}"

class PayPalProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing $amount via PayPal"

    def refund(self, transaction_id):
        return f"Refunding transaction {transaction_id}"

def checkout(processor: PaymentProcessor, amount):
    return processor.process_payment(amount)

stripe = StripeProcessor()
paypal = PayPalProcessor()

print(checkout(stripe, 100))  # Processing $100 via Stripe
print(checkout(paypal, 50))   # Processing $50 via PayPal</code></pre>`
          }
        ]
      }
    ]
  },

  // PHP Subject
  {
    title: "PHP",
    slug: "php",
    description: "Complete PHP web development guide covering syntax, databases, and modern PHP practices",
    topics: [
      {
        title: "PHP Fundamentals",
        description: "Core PHP syntax, variables, functions, and basic concepts",
        concepts: [
          {
            title: "Introduction to PHP",
            content: `<h1>Introduction to PHP</h1>
<p>PHP (Hypertext Preprocessor) is a popular server-side scripting language designed for web development.</p>

<h2>Basic Syntax</h2>
<pre><code>&lt;?php
echo "Hello, World!";
print "Welcome to PHP";

// Variables
$name = "Alice";
$age = 25;
$price = 19.99;
$isActive = true;

echo "My name is $name";
echo "My name is " . $name;  // Concatenation
?&gt;</code></pre>

<h2>Embedding PHP in HTML</h2>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;PHP Example&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;&lt;?php echo "Welcome"; ?&gt;&lt;/h1&gt;
    &lt;p&gt;Today is &lt;?= date('Y-m-d') ?&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<h2>PHP Features</h2>
<ul>
  <li>Server-side scripting</li>
  <li>Database integration</li>
  <li>Cross-platform</li>
  <li>Open source</li>
  <li>Large ecosystem</li>
</ul>`
          },
          {
            title: "Variables and Data Types",
            content: `<h1>Variables and Data Types</h1>

<h2>Variable Declaration</h2>
<pre><code>&lt;?php
// PHP is loosely typed
$name = "John";          // String
$age = 30;               // Integer
$height = 5.9;           // Float
$isActive = true;        // Boolean
$nothing = null;         // Null
$colors = ["red", "blue"]; // Array

// Variable variables
$var = "hello";
$$var = "world";
echo $hello;  // world
?&gt;</code></pre>

<h2>Data Types</h2>
<pre><code>&lt;?php
// String
$text = "Hello World";
$multiline = &lt;&lt;&lt;EOT
This is a
multi-line string
EOT;

// Array
$indexed = [1, 2, 3];
$associative = ["name" =&gt; "Alice", "age" =&gt; 25];

// Type checking
echo gettype($age);        // integer
echo var_dump($colors);    // Detailed info
echo is_string($name);     // true

// Type casting
$num = (int)"42";
$str = (string)42;
$bool = (bool)1;
?&gt;</code></pre>

<h2>Constants</h2>
<pre><code>&lt;?php
define("PI", 3.14159);
define("SITE_NAME", "My Website");

echo PI;
echo SITE_NAME;

// const keyword (PHP 5.3+)
const TAX_RATE = 0.08;
?&gt;</code></pre>`
          },
          {
            title: "Operators and Control Structures",
            content: `<h1>Operators and Control Structures</h1>

<h2>Operators</h2>
<pre><code>&lt;?php
// Arithmetic
$sum = 10 + 5;
$diff = 10 - 5;
$product = 10 * 5;
$quotient = 10 / 5;
$remainder = 10 % 3;
$power = 10 ** 2;

// Comparison
$equal = (5 == "5");      // true (loose)
$identical = (5 === "5"); // false (strict)
$notEqual = (5 != 6);
$notIdentical = (5 !== "5");

// Logical
$and = true && false;
$or = true || false;
$not = !true;

// String
$concat = "Hello" . " " . "World";
$name = "Alice";
$greeting = "Hello, $name";

// Null coalescing (PHP 7+)
$username = $_GET['user'] ?? 'Guest';

// Spaceship operator (PHP 7+)
echo 1 &lt;=&gt; 2;  // -1
echo 2 &lt;=&gt; 2;  // 0
echo 3 &lt;=&gt; 2;  // 1
?&gt;</code></pre>

<h2>Control Structures</h2>
<pre><code>&lt;?php
// If-else
$age = 18;
if ($age &lt; 13) {
    echo "Child";
} elseif ($age &lt; 20) {
    echo "Teenager";
} else {
    echo "Adult";
}

// Ternary
$status = ($age &gt;= 18) ? "Adult" : "Minor";

// Switch
$day = "Monday";
switch ($day) {
    case "Monday":
    case "Tuesday":
        echo "Weekday";
        break;
    case "Saturday":
    case "Sunday":
        echo "Weekend";
        break;
    default:
        echo "Unknown";
}

// Match expression (PHP 8+)
$result = match($day) {
    "Monday", "Tuesday" =&gt; "Weekday",
    "Saturday", "Sunday" =&gt; "Weekend",
    default =&gt; "Unknown"
};
?&gt;</code></pre>`
          },
          {
            title: "Arrays in PHP",
            content: `<h1>Arrays in PHP</h1>

<h2>Creating Arrays</h2>
<pre><code>&lt;?php
// Indexed array
$fruits = ["apple", "banana", "cherry"];
$numbers = array(1, 2, 3, 4, 5);

// Associative array
$person = [
    "name" =&gt; "Alice",
    "age" =&gt; 25,
    "city" =&gt; "NYC"
];

// Multi-dimensional array
$users = [
    ["name" =&gt; "Alice", "age" =&gt; 25],
    ["name" =&gt; "Bob", "age" =&gt; 30]
];
?&gt;</code></pre>

<h2>Array Operations</h2>
<pre><code>&lt;?php
$fruits = ["apple", "banana"];

// Adding elements
$fruits[] = "cherry";           // Add to end
array_push($fruits, "date");    // Add to end
array_unshift($fruits, "apricot"); // Add to beginning

// Removing elements
$last = array_pop($fruits);     // Remove from end
$first = array_shift($fruits);  // Remove from beginning
unset($fruits[1]);              // Remove by index

// Array functions
echo count($fruits);            // Length
echo in_array("apple", $fruits); // Check existence
$keys = array_keys($person);
$values = array_values($person);

// Sorting
sort($fruits);                  // Sort values
rsort($fruits);                 // Reverse sort
asort($person);                 // Sort associative (keep keys)
ksort($person);                 // Sort by keys

// Array manipulation
$sliced = array_slice($fruits, 1, 2);
$merged = array_merge($fruits, ["fig", "grape"]);
$unique = array_unique([1, 2, 2, 3]);
$reversed = array_reverse($fruits);
?&gt;</code></pre>

<h2>Array Iteration</h2>
<pre><code>&lt;?php
// foreach with indexed array
foreach ($fruits as $fruit) {
    echo $fruit . "&lt;br&gt;";
}

// foreach with associative array
foreach ($person as $key =&gt; $value) {
    echo "$key: $value&lt;br&gt;";
}

// Array map, filter, reduce
$squared = array_map(fn($x) =&gt; $x ** 2, [1, 2, 3]);
$evens = array_filter([1, 2, 3, 4], fn($x) =&gt; $x % 2 == 0);
$sum = array_reduce([1, 2, 3], fn($carry, $item) =&gt; $carry + $item, 0);
?&gt;</code></pre>`
          },
          {
            title: "Functions in PHP",
            content: `<h1>Functions in PHP</h1>

<h2>Defining Functions</h2>
<pre><code>&lt;?php
// Basic function
function greet($name) {
    return "Hello, $name!";
}

echo greet("Alice");

// Default parameters
function power($base, $exponent = 2) {
    return $base ** $exponent;
}

echo power(3);      // 9
echo power(3, 3);   // 27

// Type declarations (PHP 7+)
function add(int $a, int $b): int {
    return $a + $b;
}

// Multiple return values
function getStats(array $numbers): array {
    return [
        'min' =&gt; min($numbers),
        'max' =&gt; max($numbers),
        'sum' =&gt; array_sum($numbers)
    ];
}

['min' =&gt; $min, 'max' =&gt; $max] = getStats([1, 2, 3]);
?&gt;</code></pre>

<h2>Advanced Function Features</h2>
<pre><code>&lt;?php
// Variable functions
$func = "greet";
echo $func("Bob");  // Calls greet("Bob")

// Anonymous functions
$square = function($x) {
    return $x * $x;
};
echo $square(5);  // 25

// Arrow functions (PHP 7.4+)
$double = fn($x) =&gt; $x * 2;
echo $double(10);  // 20

// Variable arguments
function sum(...$numbers) {
    return array_sum($numbers);
}

echo sum(1, 2, 3, 4);  // 10

// Closures
function multiplier($factor) {
    return fn($x) =&gt; $x * $factor;
}

$times3 = multiplier(3);
echo $times3(5);  // 15
?&gt;</code></pre>`
          },
          {
            title: "String Functions and Manipulation",
            content: `<h1>String Functions and Manipulation</h1>

<h2>Common String Functions</h2>
<pre><code>&lt;?php
$text = "Hello World";

// Length and case
echo strlen($text);          // 11
echo strtoupper($text);      // HELLO WORLD
echo strtolower($text);      // hello world
echo ucfirst("hello");       // Hello
echo ucwords("hello world"); // Hello World

// Search and replace
echo strpos($text, "World");     // 6
echo str_replace("World", "PHP", $text);
echo substr($text, 0, 5);        // Hello

// Trim whitespace
$spaced = "  hello  ";
echo trim($spaced);        // "hello"
echo ltrim($spaced);       // "hello  "
echo rtrim($spaced);       // "  hello"

// Split and join
$parts = explode(" ", $text);    // ["Hello", "World"]
$joined = implode("-", $parts);  // "Hello-World"

// String comparison
echo strcmp("abc", "abd");       // -1
echo strcasecmp("ABC", "abc");   // 0 (case-insensitive)
?&gt;</code></pre>

<h2>String Formatting</h2>
<pre><code>&lt;?php
// sprintf formatting
$formatted = sprintf("Name: %s, Age: %d", "Alice", 25);
echo $formatted;

// printf (outputs directly)
printf("Price: $%.2f", 19.99);

// Number formatting
echo number_format(1234567.89, 2);  // 1,234,567.89

// String padding
echo str_pad("5", 3, "0", STR_PAD_LEFT);  // "005"
echo str_repeat("*", 5);                   // "*****"
?&gt;</code></pre>

<h2>Regular Expressions</h2>
<pre><code>&lt;?php
$email = "user@example.com";
$pattern = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";

// Match
if (preg_match($pattern, $email)) {
    echo "Valid email";
}

// Replace
$text = "Hello 123 World 456";
$cleaned = preg_replace("/\d+/", "", $text);  // "Hello  World "

// Split
$parts = preg_split("/\s+/", "Hello   World");

// Match all
preg_match_all("/\d+/", $text, $matches);
print_r($matches[0]);  // ["123", "456"]
?&gt;</code></pre>`
          }
        ]
      },
      {
        title: "PHP and Databases",
        description: "Working with MySQL databases using PDO and MySQLi",
        concepts: [
          {
            title: "Database Connection with PDO",
            content: `<h1>Database Connection with PDO</h1>

<h2>Connecting to Database</h2>
<pre><code>&lt;?php
// PDO connection
try {
    $dsn = "mysql:host=localhost;dbname=mydb;charset=utf8mb4";
    $username = "root";
    $password = "";

    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE =&gt; PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES =&gt; false
    ]);

    echo "Connected successfully";
} catch (PDOException $e) {
    die("Connection failed: " . $e-&gt;getMessage());
}
?&gt;</code></pre>

<h2>Basic Queries</h2>
<pre><code>&lt;?php
// Simple SELECT
$stmt = $pdo-&gt;query("SELECT * FROM users");
$users = $stmt-&gt;fetchAll();

foreach ($users as $user) {
    echo $user['name'] . "&lt;br&gt;";
}

// Fetch single row
$stmt = $pdo-&gt;query("SELECT * FROM users WHERE id = 1");
$user = $stmt-&gt;fetch();

// Fetch column
$stmt = $pdo-&gt;query("SELECT name FROM users");
$names = $stmt-&gt;fetchAll(PDO::FETCH_COLUMN);
?&gt;</code></pre>

<h2>Prepared Statements</h2>
<pre><code>&lt;?php
// Prepared statement with named parameters
$stmt = $pdo-&gt;prepare("SELECT * FROM users WHERE email = :email");
$stmt-&gt;execute(['email' =&gt; $email]);
$user = $stmt-&gt;fetch();

// Prepared statement with positional parameters
$stmt = $pdo-&gt;prepare("SELECT * FROM users WHERE id = ?");
$stmt-&gt;execute([$id]);
$user = $stmt-&gt;fetch();

// Multiple parameters
$stmt = $pdo-&gt;prepare("
    SELECT * FROM users
    WHERE age &gt; :min_age AND city = :city
");
$stmt-&gt;execute([
    'min_age' =&gt; 18,
    'city' =&gt; 'NYC'
]);
$users = $stmt-&gt;fetchAll();
?&gt;</code></pre>`
          },
          {
            title: "INSERT, UPDATE, DELETE Operations",
            content: `<h1>INSERT, UPDATE, DELETE Operations</h1>

<h2>INSERT Data</h2>
<pre><code>&lt;?php
// Single insert
$stmt = $pdo-&gt;prepare("
    INSERT INTO users (name, email, age)
    VALUES (:name, :email, :age)
");

$stmt-&gt;execute([
    'name' =&gt; 'Alice',
    'email' =&gt; 'alice@example.com',
    'age' =&gt; 25
]);

echo "User created with ID: " . $pdo-&gt;lastInsertId();

// Multiple insert
$users = [
    ['Bob', 'bob@example.com', 30],
    ['Charlie', 'charlie@example.com', 28]
];

$stmt = $pdo-&gt;prepare("
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
");

foreach ($users as $user) {
    $stmt-&gt;execute($user);
}
?&gt;</code></pre>

<h2>UPDATE Data</h2>
<pre><code>&lt;?php
// Update single record
$stmt = $pdo-&gt;prepare("
    UPDATE users
    SET email = :email, age = :age
    WHERE id = :id
");

$stmt-&gt;execute([
    'email' =&gt; 'newemail@example.com',
    'age' =&gt; 26,
    'id' =&gt; 1
]);

echo "Rows affected: " . $stmt-&gt;rowCount();

// Update multiple records
$stmt = $pdo-&gt;prepare("
    UPDATE users
    SET is_active = 1
    WHERE last_login &gt; ?
");

$stmt-&gt;execute([date('Y-m-d', strtotime('-30 days'))]);
?&gt;</code></pre>

<h2>DELETE Data</h2>
<pre><code>&lt;?php
// Delete single record
$stmt = $pdo-&gt;prepare("DELETE FROM users WHERE id = ?");
$stmt-&gt;execute([$id]);

echo "Rows deleted: " . $stmt-&gt;rowCount();

// Delete with conditions
$stmt = $pdo-&gt;prepare("
    DELETE FROM users
    WHERE is_active = 0
    AND created_at &lt; ?
");

$stmt-&gt;execute([date('Y-m-d', strtotime('-1 year'))]);
?&gt;</code></pre>`
          },
          {
            title: "Transactions",
            content: `<h1>Transactions</h1>

<h2>Basic Transaction</h2>
<pre><code>&lt;?php
try {
    // Start transaction
    $pdo-&gt;beginTransaction();

    // Multiple operations
    $pdo-&gt;exec("INSERT INTO orders (user_id, total) VALUES (1, 100)");
    $orderId = $pdo-&gt;lastInsertId();

    $pdo-&gt;exec("
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES ($orderId, 5, 2)
    ");

    $pdo-&gt;exec("
        UPDATE products
        SET stock = stock - 2
        WHERE id = 5
    ");

    // Commit transaction
    $pdo-&gt;commit();
    echo "Order placed successfully";

} catch (Exception $e) {
    // Rollback on error
    $pdo-&gt;rollBack();
    echo "Transaction failed: " . $e-&gt;getMessage();
}
?&gt;</code></pre>

<h2>Transaction with Prepared Statements</h2>
<pre><code>&lt;?php
try {
    $pdo-&gt;beginTransaction();

    // Transfer money between accounts
    $stmt1 = $pdo-&gt;prepare("
        UPDATE accounts
        SET balance = balance - ?
        WHERE id = ?
    ");
    $stmt1-&gt;execute([100, $fromAccount]);

    $stmt2 = $pdo-&gt;prepare("
        UPDATE accounts
        SET balance = balance + ?
        WHERE id = ?
    ");
    $stmt2-&gt;execute([100, $toAccount]);

    // Log transaction
    $stmt3 = $pdo-&gt;prepare("
        INSERT INTO transactions (from_id, to_id, amount)
        VALUES (?, ?, ?)
    ");
    $stmt3-&gt;execute([$fromAccount, $toAccount, 100]);

    $pdo-&gt;commit();

} catch (Exception $e) {
    $pdo-&gt;rollBack();
    throw $e;
}
?&gt;</code></pre>`
          },
          {
            title: "Error Handling",
            content: `<h1>Error Handling</h1>

<h2>PDO Error Modes</h2>
<pre><code>&lt;?php
// Set error mode to exceptions
$pdo-&gt;setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Try-catch for error handling
try {
    $stmt = $pdo-&gt;prepare("SELECT * FROM invalid_table");
    $stmt-&gt;execute();
} catch (PDOException $e) {
    error_log("Database error: " . $e-&gt;getMessage());
    echo "An error occurred. Please try again later.";
}
?&gt;</code></pre>

<h2>Custom Error Handler</h2>
<pre><code>&lt;?php
class Database {
    private $pdo;

    public function query($sql, $params = []) {
        try {
            $stmt = $this-&gt;pdo-&gt;prepare($sql);
            $stmt-&gt;execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this-&gt;logError($e);
            throw new Exception("Database query failed");
        }
    }

    private function logError($e) {
        error_log(date('Y-m-d H:i:s') . " - " . $e-&gt;getMessage());
    }
}
?&gt;</code></pre>`
          },
          {
            title: "Advanced Queries",
            content: `<h1>Advanced Queries</h1>

<h2>JOINs</h2>
<pre><code>&lt;?php
// INNER JOIN
$stmt = $pdo-&gt;query("
    SELECT users.name, orders.total, orders.created_at
    FROM users
    INNER JOIN orders ON users.id = orders.user_id
    WHERE users.is_active = 1
");
$results = $stmt-&gt;fetchAll();

// LEFT JOIN with parameters
$stmt = $pdo-&gt;prepare("
    SELECT
        users.name,
        COUNT(orders.id) as order_count,
        COALESCE(SUM(orders.total), 0) as total_spent
    FROM users
    LEFT JOIN orders ON users.id = orders.user_id
    WHERE users.created_at &gt; ?
    GROUP BY users.id
    HAVING order_count &gt; 0
    ORDER BY total_spent DESC
");
$stmt-&gt;execute([date('Y-m-d', strtotime('-1 year'))]);
?&gt;</code></pre>

<h2>Subqueries and Complex Queries</h2>
<pre><code>&lt;?php
// Subquery in WHERE clause
$stmt = $pdo-&gt;query("
    SELECT * FROM products
    WHERE price &gt; (
        SELECT AVG(price) FROM products
    )
");

// Subquery in FROM clause
$stmt = $pdo-&gt;query("
    SELECT category, AVG(price) as avg_price
    FROM (
        SELECT category, price
        FROM products
        WHERE is_active = 1
    ) as active_products
    GROUP BY category
");

// Common Table Expression (CTE)
$stmt = $pdo-&gt;query("
    WITH monthly_sales AS (
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') as month,
            SUM(total) as total_sales
        FROM orders
        GROUP BY month
    )
    SELECT * FROM monthly_sales
    WHERE total_sales &gt; 10000
");
?&gt;</code></pre>

<h2>Pagination</h2>
<pre><code>&lt;?php
$page = $_GET['page'] ?? 1;
$perPage = 20;
$offset = ($page - 1) * $perPage;

// Get total count
$total = $pdo-&gt;query("SELECT COUNT(*) FROM users")-&gt;fetchColumn();
$totalPages = ceil($total / $perPage);

// Get paginated results
$stmt = $pdo-&gt;prepare("
    SELECT * FROM users
    ORDER BY created_at DESC
    LIMIT :limit OFFSET :offset
");
$stmt-&gt;bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt-&gt;bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt-&gt;execute();
$users = $stmt-&gt;fetchAll();
?&gt;</code></pre>`
          }
        ]
      }
    ]
  },

  // Rust Subject
  {
    title: "Rust",
    slug: "rust",
    description: "Learn Rust programming with focus on ownership, memory safety, and systems programming",
    topics: [
      {
        title: "Rust Basics",
        description: "Getting started with Rust syntax, variables, and basic concepts",
        concepts: [
          {
            title: "Introduction to Rust",
            content: `<h1>Introduction to Rust</h1>
<p>Rust is a systems programming language focused on safety, speed, and concurrency.</p>

<h2>Hello World</h2>
<pre><code>fn main() {
    println!("Hello, World!");
    println!("Welcome to {}", "Rust");
}

// Compile and run
// $ rustc main.rs
// $ ./main</code></pre>

<h2>Why Rust?</h2>
<ul>
  <li><strong>Memory Safety</strong>: No null pointers, no dangling pointers</li>
  <li><strong>Zero-cost Abstractions</strong>: High-level features without runtime overhead</li>
  <li><strong>Concurrency</strong>: Fearless concurrency without data races</li>
  <li><strong>Performance</strong>: Comparable to C/C++</li>
  <li><strong>Package Manager</strong>: Cargo for easy dependency management</li>
</ul>

<h2>Cargo - Rust's Build Tool</h2>
<pre><code># Create new project
cargo new my_project
cd my_project

# Build project
cargo build

# Run project
cargo run

# Check code without building
cargo check

# Build for release
cargo build --release</code></pre>`
          },
          {
            title: "Variables and Mutability",
            content: `<h1>Variables and Mutability</h1>

<h2>Immutable by Default</h2>
<pre><code>fn main() {
    let x = 5;
    println!("x = {}", x);

    // x = 6; // ERROR: cannot assign twice to immutable variable

    // Mutable variable
    let mut y = 5;
    println!("y = {}", y);
    y = 6;
    println!("y = {}", y);
}</code></pre>

<h2>Constants</h2>
<pre><code>const MAX_POINTS: u32 = 100_000;
const PI: f64 = 3.14159;

fn main() {
    println!("Max points: {}", MAX_POINTS);
}</code></pre>

<h2>Shadowing</h2>
<pre><code>fn main() {
    let x = 5;
    let x = x + 1;  // Shadowing
    let x = x * 2;
    println!("x = {}", x);  // 12

    // Can change type with shadowing
    let spaces = "   ";
    let spaces = spaces.len();
    println!("Number of spaces: {}", spaces);
}</code></pre>`
          },
          {
            title: "Data Types",
            content: `<h1>Data Types</h1>

<h2>Scalar Types</h2>
<pre><code>fn main() {
    // Integers
    let decimal = 98_222;        // i32 (default)
    let hex = 0xff;
    let octal = 0o77;
    let binary = 0b1111_0000;
    let byte = b'A';  // u8 only

    // Explicit types
    let x: i8 = -128;
    let y: u8 = 255;
    let z: i64 = 9_223_372_036_854_775_807;

    // Floating point
    let f1 = 2.0;      // f64 (default)
    let f2: f32 = 3.0;

    // Boolean
    let t = true;
    let f: bool = false;

    // Character
    let c = 'z';
    let heart = '❤';
    let emoji = '😻';
}</code></pre>

<h2>Compound Types</h2>
<pre><code>fn main() {
    // Tuple
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup;  // Destructuring
    let first = tup.0;
    let second = tup.1;

    // Array (fixed size)
    let arr = [1, 2, 3, 4, 5];
    let first = arr[0];
    let second = arr[1];

    // Array with type annotation
    let arr: [i32; 5] = [1, 2, 3, 4, 5];

    // Initialize array with same value
    let arr = [3; 5];  // [3, 3, 3, 3, 3]
}</code></pre>`
          },
          {
            title: "Functions",
            content: `<h1>Functions</h1>

<h2>Function Definition</h2>
<pre><code>fn main() {
    println!("Result: {}", add(5, 3));
    greet("Alice");
}

fn add(x: i32, y: i32) -> i32 {
    x + y  // No semicolon = expression (returns value)
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

// Multiple return values with tuple
fn calculate(x: i32, y: i32) -> (i32, i32, i32) {
    (x + y, x - y, x * y)
}

fn main() {
    let (sum, diff, prod) = calculate(10, 5);
    println!("Sum: {}, Diff: {}, Prod: {}", sum, diff, prod);
}</code></pre>

<h2>Statements vs Expressions</h2>
<pre><code>fn main() {
    // Statement (doesn't return value)
    let x = 6;

    // Expression (returns value)
    let y = {
        let x = 3;
        x + 1  // No semicolon
    };
    println!("y = {}", y);  // 4

    // if is an expression
    let number = 5;
    let result = if number < 10 {
        "small"
    } else {
        "large"
    };
}</code></pre>`
          },
          {
            title: "Control Flow",
            content: `<h1>Control Flow</h1>

<h2>If Expressions</h2>
<pre><code>fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("divisible by 4");
    } else if number % 3 == 0 {
        println!("divisible by 3");
    } else if number % 2 == 0 {
        println!("divisible by 2");
    } else {
        println!("not divisible by 4, 3, or 2");
    }

    // if in let statement
    let condition = true;
    let number = if condition { 5 } else { 6 };
}</code></pre>

<h2>Loops</h2>
<pre><code>fn main() {
    // loop - infinite
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;  // Return value from loop
        }
    };
    println!("Result: {}", result);

    // while loop
    let mut number = 3;
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }

    // for loop
    let arr = [10, 20, 30, 40, 50];
    for element in arr.iter() {
        println!("Value: {}", element);
    }

    // Range
    for number in 1..4 {  // 1, 2, 3
        println!("{}", number);
    }

    for number in (1..4).rev() {  // 3, 2, 1
        println!("{}", number);
    }
}</code></pre>

<h2>Match</h2>
<pre><code>fn main() {
    let number = 7;

    match number {
        1 => println!("One"),
        2 | 3 | 5 | 7 => println!("Prime"),
        4 | 6 | 8 | 10 => println!("Even"),
        _ => println!("Other"),
    }

    // Match with ranges
    match number {
        1..=5 => println!("1-5"),
        6..=10 => println!("6-10"),
        _ => println!("Other"),
    }

    // Match is an expression
    let result = match number {
        1 => "one",
        2 => "two",
        _ => "many",
    };
}</code></pre>`
          },
          {
            title: "Strings",
            content: `<h1>Strings</h1>

<h2>String Types</h2>
<pre><code>fn main() {
    // String slice (&str) - immutable, fixed size
    let s1 = "Hello";  // &str

    // String - mutable, growable
    let mut s2 = String::from("Hello");
    s2.push_str(", World!");
    s2.push('!');

    // Creating strings
    let s3 = "initial contents".to_string();
    let s4 = String::from("initial contents");

    println!("{}", s2);
}</code></pre>

<h2>String Operations</h2>
<pre><code>fn main() {
    let mut s = String::from("Hello");

    // Append
    s.push_str(" World");
    s.push('!');

    // Concatenate
    let s1 = String::from("Hello, ");
    let s2 = String::from("World!");
    let s3 = s1 + &s2;  // s1 is moved

    // format! macro (doesn't take ownership)
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");
    let s = format!("{}-{}-{}", s1, s2, s3);

    // Length
    println!("Length: {}", s.len());

    // Iteration
    for c in "नमस्ते".chars() {
        println!("{}", c);
    }

    for b in "नमस्ते".bytes() {
        println!("{}", b);
    }
}</code></pre>

<h2>String Slicing</h2>
<pre><code>fn main() {
    let s = String::from("Hello World");

    let hello = &s[0..5];
    let world = &s[6..11];

    // Same as
    let hello = &s[..5];
    let world = &s[6..];
    let full = &s[..];

    println!("{} {}", hello, world);
}</code></pre>`
          }
        ]
      },
      {
        title: "Ownership and Borrowing",
        description: "Understanding Rust's unique ownership system and memory management",
        concepts: [
          {
            title: "Ownership Rules",
            content: `<h1>Ownership Rules</h1>
<p>Rust's ownership system is what makes it unique and memory-safe without garbage collection.</p>

<h2>The Rules</h2>
<ol>
  <li>Each value in Rust has a variable that's called its owner</li>
  <li>There can only be one owner at a time</li>
  <li>When the owner goes out of scope, the value is dropped</li>
</ol>

<h2>Move Semantics</h2>
<pre><code>fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 is moved to s2

    // println!("{}", s1);  // ERROR: s1 is no longer valid
    println!("{}", s2);  // OK

    // Stack-only data: Copy
    let x = 5;
    let y = x;  // x is copied
    println!("{} {}", x, y);  // Both valid
}</code></pre>

<h2>Ownership and Functions</h2>
<pre><code>fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // println!("{}", s);  // ERROR: s was moved

    let x = 5;
    makes_copy(x);
    println!("{}", x);  // OK: i32 is Copy
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}  // some_string dropped here

fn makes_copy(some_integer: i32) {
    println!("{}", some_integer);
}</code></pre>

<h2>Return Values and Ownership</h2>
<pre><code>fn main() {
    let s1 = gives_ownership();
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);
    // s2 is invalid, s3 is valid
}

fn gives_ownership() -> String {
    String::from("hello")
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string
}</code></pre>`
          },
          {
            title: "References and Borrowing",
            content: `<h1>References and Borrowing</h1>

<h2>Immutable References</h2>
<pre><code>fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);  // Borrow s1

    println!("Length of '{}' is {}", s1, len);  // s1 still valid
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s goes out of scope, but doesn't drop the value</code></pre>

<h2>Mutable References</h2>
<pre><code>fn main() {
    let mut s = String::from("hello");

    change(&mut s);

    println!("{}", s);  // "hello, world"
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}

// Restriction: Only one mutable reference at a time
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    // let r2 = &mut s;  // ERROR: cannot borrow as mutable more than once

    println!("{}", r1);
}</code></pre>

<h2>Mixing Mutable and Immutable References</h2>
<pre><code>fn main() {
    let mut s = String::from("hello");

    let r1 = &s;     // OK
    let r2 = &s;     // OK
    // let r3 = &mut s; // ERROR: cannot borrow as mutable

    println!("{} and {}", r1, r2);
    // r1 and r2 are no longer used after this point

    let r3 = &mut s; // OK: no immutable refs active
    println!("{}", r3);
}</code></pre>`
          },
          {
            title: "Slice Type",
            content: `<h1>Slice Type</h1>

<h2>String Slices</h2>
<pre><code>fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];

    // Shorthand
    let hello = &s[..5];
    let world = &s[6..];
    let entire = &s[..];

    let word = first_word(&s);
    println!("First word: {}", word);
}

fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];
        }
    }

    &s[..]
}</code></pre>

<h2>Array Slices</h2>
<pre><code>fn main() {
    let arr = [1, 2, 3, 4, 5];

    let slice = &arr[1..3];  // &[i32]

    println!("{:?}", slice);  // [2, 3]

    // Generic function with slices
    print_slice(&arr);
    print_slice(&arr[2..4]);
}

fn print_slice(slice: &[i32]) {
    for item in slice {
        println!("{}", item);
    }
}</code></pre>`
          },
          {
            title: "Lifetimes",
            content: `<h1>Lifetimes</h1>

<h2>Lifetime Annotations</h2>
<pre><code>// Function that returns a reference needs lifetime annotations
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let string2 = "short";

    let result = longest(string1.as_str(), string2);
    println!("Longest: {}", result);
}</code></pre>

<h2>Lifetime in Structs</h2>
<pre><code>struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
    println!("{}", i.part);
}</code></pre>

<h2>Lifetime Elision Rules</h2>
<pre><code>// Compiler can infer lifetimes in simple cases
fn first_word(s: &str) -> &str {  // Lifetimes inferred
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

// Static lifetime
let s: &'static str = "I have a static lifetime.";
// String literals always have 'static lifetime</code></pre>`
          },
          {
            title: "Smart Pointers",
            content: `<h1>Smart Pointers</h1>

<h2>Box&lt;T&gt; - Heap Allocation</h2>
<pre><code>fn main() {
    let b = Box::new(5);
    println!("b = {}", b);

    // Recursive type
    enum List {
        Cons(i32, Box<List>),
        Nil,
    }

    use List::{Cons, Nil};

    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}</code></pre>

<h2>Rc&lt;T&gt; - Reference Counting</h2>
<pre><code>use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("hello"));
    println!("Count: {}", Rc::strong_count(&a));  // 1

    let b = Rc::clone(&a);
    println!("Count: {}", Rc::strong_count(&a));  // 2

    {
        let c = Rc::clone(&a);
        println!("Count: {}", Rc::strong_count(&a));  // 3
    }

    println!("Count: {}", Rc::strong_count(&a));  // 2
}</code></pre>

<h2>RefCell&lt;T&gt; - Interior Mutability</h2>
<pre><code>use std::cell::RefCell;

fn main() {
    let value = RefCell::new(5);

    *value.borrow_mut() += 10;

    println!("{}", value.borrow());  // 15
}

// Common pattern: Rc<RefCell<T>>
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let value = Rc::new(RefCell::new(5));

    let a = Rc::clone(&value);
    let b = Rc::clone(&value);

    *a.borrow_mut() += 10;
    *b.borrow_mut() += 5;

    println!("{}", value.borrow());  // 20
}</code></pre>`
          },
          {
            title: "Common Collections",
            content: `<h1>Common Collections</h1>

<h2>Vectors</h2>
<pre><code>fn main() {
    // Creating vectors
    let v: Vec<i32> = Vec::new();
    let v = vec![1, 2, 3];

    // Adding elements
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);

    // Accessing elements
    let third = &v[2];
    println!("Third: {}", third);

    match v.get(2) {
        Some(third) => println!("Third: {}", third),
        None => println!("No third element"),
    }

    // Iteration
    for i in &v {
        println!("{}", i);
    }

    // Mutable iteration
    for i in &mut v {
        *i += 50;
    }
}</code></pre>

<h2>HashMaps</h2>
<pre><code>use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    // Access
    let team_name = String::from("Blue");
    let score = scores.get(&team_name);

    match score {
        Some(&s) => println!("Score: {}", s),
        None => println!("Team not found"),
    }

    // Iteration
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }

    // Update
    scores.insert(String::from("Blue"), 25);  // Overwrite

    // Insert if not exists
    scores.entry(String::from("Red")).or_insert(50);

    // Update based on old value
    let text = "hello world wonderful world";
    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("{:?}", map);
}</code></pre>`
          }
        ]
      }
    ]
  },

  // Go Lang Subject
  {
    title: "Go Lang",
    slug: "go-lang",
    description: "Learn Go programming language with focus on concurrency, simplicity, and performance",
    topics: [
      {
        title: "Go Basics",
        description: "Introduction to Go syntax, types, and fundamental concepts",
        concepts: [
          {
            title: "Getting Started with Go",
            content: `<h1>Getting Started with Go</h1>

<h2>Hello World</h2>
<pre><code>package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Printf("Welcome to %s\n", "Go")
}</code></pre>

<h2>Running Go Programs</h2>
<pre><code># Run directly
go run main.go

# Build executable
go build main.go
./main

# Install to $GOPATH/bin
go install

# Format code
go fmt main.go

# Get dependencies
go get -u github.com/pkg/errors</code></pre>

<h2>Why Go?</h2>
<ul>
  <li><strong>Simple</strong>: Clean, minimal syntax</li>
  <li><strong>Fast</strong>: Compiled to native code</li>
  <li><strong>Concurrent</strong>: Built-in goroutines and channels</li>
  <li><strong>Garbage Collected</strong>: Automatic memory management</li>
  <li><strong>Statically Typed</strong>: Type safety with inference</li>
  <li><strong>Standard Library</strong>: Rich set of packages</li>
</ul>`
          },
          {
            title: "Variables and Types",
            content: `<h1>Variables and Types</h1>

<h2>Variable Declaration</h2>
<pre><code>package main

import "fmt"

func main() {
    // var keyword
    var name string = "Alice"
    var age int = 25
    var price float64 = 19.99
    var isActive bool = true

    // Type inference
    var city = "NYC"

    // Short declaration (inside functions only)
    country := "USA"

    // Multiple declarations
    var (
        firstName string = "John"
        lastName  string = "Doe"
        userAge   int    = 30
    )

    // Multiple assignment
    x, y := 10, 20

    fmt.Println(name, age, price, isActive)
}</code></pre>

<h2>Basic Types</h2>
<pre><code>package main

func main() {
    // Integers
    var i8 int8 = 127
    var i16 int16 = 32767
    var i32 int32 = 2147483647
    var i64 int64 = 9223372036854775807
    var u8 uint8 = 255

    // int and uint (platform dependent)
    var i int = 42
    var u uint = 42

    // Floating point
    var f32 float32 = 3.14
    var f64 float64 = 3.14159265359

    // Complex numbers
    var c64 complex64 = 3 + 4i
    var c128 complex128 = 5 + 12i

    // Boolean
    var b bool = true

    // String
    var s string = "Hello, Go"

    // Byte (alias for uint8)
    var bt byte = 'A'

    // Rune (alias for int32, represents Unicode code point)
    var r rune = '世'
}</code></pre>

<h2>Constants</h2>
<pre><code>package main

const Pi = 3.14159
const (
    StatusOK       = 200
    StatusNotFound = 404
    StatusError    = 500
)

// iota - automatic increment
const (
    Sunday = iota  // 0
    Monday         // 1
    Tuesday        // 2
    Wednesday      // 3
)

func main() {
    const greeting = "Hello"
    // greeting = "Hi"  // ERROR: cannot assign to const
}</code></pre>`
          },
          {
            title: "Functions",
            content: `<h1>Functions</h1>

<h2>Basic Functions</h2>
<pre><code>package main

import "fmt"

// Function with parameters and return value
func add(x int, y int) int {
    return x + y
}

// Shortened parameter declaration
func multiply(x, y int) int {
    return x * y
}

// Multiple return values
func swap(x, y string) (string, string) {
    return y, x
}

// Named return values
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return  // Naked return
}

func main() {
    fmt.Println(add(5, 3))

    a, b := swap("hello", "world")
    fmt.Println(a, b)

    fmt.Println(split(17))
}</code></pre>

<h2>Variadic Functions</h2>
<pre><code>package main

import "fmt"

// Variadic function
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))        // 6
    fmt.Println(sum(1, 2, 3, 4, 5)) // 15

    nums := []int{1, 2, 3, 4}
    fmt.Println(sum(nums...))        // Unpack slice
}</code></pre>

<h2>Anonymous Functions and Closures</h2>
<pre><code>package main

import "fmt"

func main() {
    // Anonymous function
    func() {
        fmt.Println("Anonymous function")
    }()

    // Assign to variable
    square := func(x int) int {
        return x * x
    }
    fmt.Println(square(5))

    // Closure
    increment := makeIncrementer()
    fmt.Println(increment())  // 1
    fmt.Println(increment())  // 2
    fmt.Println(increment())  // 3
}

func makeIncrementer() func() int {
    i := 0
    return func() int {
        i++
        return i
    }
}</code></pre>`
          },
          {
            title: "Control Structures",
            content: `<h1>Control Structures</h1>

<h2>If-Else</h2>
<pre><code>package main

import "fmt"

func main() {
    x := 10

    if x > 0 {
        fmt.Println("Positive")
    } else if x < 0 {
        fmt.Println("Negative")
    } else {
        fmt.Println("Zero")
    }

    // If with initialization
    if num := 9; num < 0 {
        fmt.Println("Negative")
    } else if num < 10 {
        fmt.Println("Single digit")
    } else {
        fmt.Println("Multiple digits")
    }
    // num is not accessible here
}</code></pre>

<h2>For Loops</h2>
<pre><code>package main

import "fmt"

func main() {
    // Traditional for loop
    for i := 0; i < 5; i++ {
        fmt.Println(i)
    }

    // While-style loop
    sum := 1
    for sum < 1000 {
        sum += sum
    }

    // Infinite loop
    for {
        // Use break to exit
        break
    }

    // Range over slice
    nums := []int{2, 4, 6, 8}
    for i, num := range nums {
        fmt.Printf("Index: %d, Value: %d\n", i, num)
    }

    // Range over map
    kvs := map[string]string{"a": "apple", "b": "banana"}
    for k, v := range kvs {
        fmt.Printf("%s -> %s\n", k, v)
    }

    // Ignore index with _
    for _, num := range nums {
        fmt.Println(num)
    }
}</code></pre>

<h2>Switch</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func main() {
    // Basic switch
    day := 2
    switch day {
    case 1:
        fmt.Println("Monday")
    case 2:
        fmt.Println("Tuesday")
    case 3, 4, 5:
        fmt.Println("Midweek")
    default:
        fmt.Println("Weekend")
    }

    // Switch with condition
    t := time.Now()
    switch {
    case t.Hour() < 12:
        fmt.Println("Morning")
    case t.Hour() < 17:
        fmt.Println("Afternoon")
    default:
        fmt.Println("Evening")
    }

    // Type switch
    whatAmI := func(i interface{}) {
        switch t := i.(type) {
        case bool:
            fmt.Println("Boolean")
        case int:
            fmt.Println("Integer")
        case string:
            fmt.Println("String")
        default:
            fmt.Printf("Unknown type %T\n", t)
        }
    }

    whatAmI(true)
    whatAmI(1)
    whatAmI("hello")
}</code></pre>`
          },
          {
            title: "Arrays and Slices",
            content: `<h1>Arrays and Slices</h1>

<h2>Arrays</h2>
<pre><code>package main

import "fmt"

func main() {
    // Array declaration
    var arr [5]int
    arr[0] = 100
    fmt.Println(arr)  // [100 0 0 0 0]

    // Array literal
    primes := [5]int{2, 3, 5, 7, 11}
    fmt.Println(primes)

    // Let compiler count
    arr2 := [...]int{1, 2, 3}

    // 2D array
    var grid [3][3]int
    grid[0][0] = 1
}</code></pre>

<h2>Slices</h2>
<pre><code>package main

import "fmt"

func main() {
    // Slice from array
    primes := [6]int{2, 3, 5, 7, 11, 13}
    var s []int = primes[1:4]  // [3 5 7]

    // Slice literal
    slice := []int{2, 3, 5, 7, 11}

    // Using make
    s1 := make([]int, 5)        // len=5, cap=5
    s2 := make([]int, 0, 5)     // len=0, cap=5

    // Append
    s1 = append(s1, 1)
    s1 = append(s1, 2, 3, 4)

    // Slice operations
    fmt.Println(len(slice))     // Length
    fmt.Println(cap(slice))     // Capacity

    // Slicing slices
    fmt.Println(slice[1:3])     // [3 5]
    fmt.Println(slice[:3])      // [2 3 5]
    fmt.Println(slice[3:])      // [7 11]

    // Copy
    dest := make([]int, len(slice))
    copy(dest, slice)
}</code></pre>

<h2>Slice Tricks</h2>
<pre><code>package main

import "fmt"

func main() {
    s := []int{1, 2, 3, 4, 5}

    // Delete element at index i
    i := 2
    s = append(s[:i], s[i+1:]...)  // [1 2 4 5]

    // Insert at index
    s = []int{1, 2, 3, 4, 5}
    i = 2
    value := 99
    s = append(s[:i], append([]int{value}, s[i:]...)...)
    fmt.Println(s)  // [1 2 99 3 4 5]

    // Filter
    s = []int{1, 2, 3, 4, 5}
    n := 0
    for _, x := range s {
        if x%2 == 0 {
            s[n] = x
            n++
        }
    }
    s = s[:n]  // [2 4]
}</code></pre>`
          },
          {
            title: "Maps",
            content: `<h1>Maps</h1>

<h2>Creating and Using Maps</h2>
<pre><code>package main

import "fmt"

func main() {
    // Make a map
    m := make(map[string]int)

    // Set values
    m["one"] = 1
    m["two"] = 2

    fmt.Println(m)  // map[one:1 two:2]

    // Map literal
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
        "Charlie": 35,
    }

    // Get value
    age := ages["Alice"]
    fmt.Println(age)  // 25

    // Check if key exists
    age, ok := ages["David"]
    if ok {
        fmt.Println(age)
    } else {
        fmt.Println("Not found")
    }

    // Delete key
    delete(ages, "Bob")

    // Iterate
    for name, age := range ages {
        fmt.Printf("%s is %d years old\n", name, age)
    }

    // Get length
    fmt.Println(len(ages))
}</code></pre>

<h2>Nested Maps</h2>
<pre><code>package main

import "fmt"

func main() {
    // Map of maps
    users := make(map[string]map[string]string)

    users["alice"] = map[string]string{
        "email": "alice@example.com",
        "phone": "123-456-7890",
    }

    users["bob"] = map[string]string{
        "email": "bob@example.com",
        "phone": "098-765-4321",
    }

    fmt.Println(users["alice"]["email"])
}</code></pre>`
          }
        ]
      },
      {
        title: "Concurrency in Go",
        description: "Goroutines, channels, and concurrent programming patterns",
        concepts: [
          {
            title: "Goroutines",
            content: `<h1>Goroutines</h1>

<h2>Basic Goroutines</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    // Run in new goroutine
    go say("world")

    // Run in main goroutine
    say("hello")

    // Wait for goroutines
    time.Sleep(time.Second)
}</code></pre>

<h2>Anonymous Goroutines</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func main() {
    // Anonymous goroutine
    go func() {
        fmt.Println("Anonymous goroutine")
    }()

    // With parameters
    go func(msg string) {
        fmt.Println(msg)
    }("Hello from goroutine")

    time.Sleep(time.Second)
}</code></pre>

<h2>Multiple Goroutines</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func worker(id int) {
    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    // Start 5 workers
    for i := 1; i <= 5; i++ {
        go worker(i)
    }

    time.Sleep(2 * time.Second)
}</code></pre>`
          },
          {
            title: "Channels",
            content: `<h1>Channels</h1>

<h2>Basic Channels</h2>
<pre><code>package main

import "fmt"

func main() {
    // Create channel
    messages := make(chan string)

    // Send in goroutine
    go func() {
        messages <- "ping"
    }()

    // Receive
    msg := <-messages
    fmt.Println(msg)
}</code></pre>

<h2>Buffered Channels</h2>
<pre><code>package main

import "fmt"

func main() {
    // Buffered channel
    messages := make(chan string, 2)

    // Can send without blocking until buffer is full
    messages <- "buffered"
    messages <- "channel"

    fmt.Println(<-messages)
    fmt.Println(<-messages)
}</code></pre>

<h2>Channel Synchronization</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func worker(done chan bool) {
    fmt.Print("working...")
    time.Sleep(time.Second)
    fmt.Println("done")

    done <- true
}

func main() {
    done := make(chan bool, 1)
    go worker(done)

    <-done  // Block until signal received
}</code></pre>

<h2>Channel Direction</h2>
<pre><code>package main

import "fmt"

// Send-only channel
func ping(pings chan<- string, msg string) {
    pings <- msg
}

// Receive-only channel
func pong(pings <-chan string, pongs chan<- string) {
    msg := <-pings
    pongs <- msg
}

func main() {
    pings := make(chan string, 1)
    pongs := make(chan string, 1)

    ping(pings, "passed message")
    pong(pings, pongs)

    fmt.Println(<-pongs)
}</code></pre>`
          },
          {
            title: "Select Statement",
            content: `<h1>Select Statement</h1>

<h2>Basic Select</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func main() {
    c1 := make(chan string)
    c2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        c1 <- "one"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        c2 <- "two"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-c1:
            fmt.Println("received", msg1)
        case msg2 := <-c2:
            fmt.Println("received", msg2)
        }
    }
}</code></pre>

<h2>Timeout</h2>
<pre><code>package main

import (
    "fmt"
    "time"
)

func main() {
    c1 := make(chan string, 1)
    go func() {
        time.Sleep(2 * time.Second)
        c1 <- "result 1"
    }()

    select {
    case res := <-c1:
        fmt.Println(res)
    case <-time.After(1 * time.Second):
        fmt.Println("timeout 1")
    }
}</code></pre>

<h2>Non-blocking Operations</h2>
<pre><code>package main

import "fmt"

func main() {
    messages := make(chan string)
    signals := make(chan bool)

    // Non-blocking receive
    select {
    case msg := <-messages:
        fmt.Println("received message", msg)
    default:
        fmt.Println("no message received")
    }

    // Non-blocking send
    msg := "hi"
    select {
    case messages <- msg:
        fmt.Println("sent message", msg)
    default:
        fmt.Println("no message sent")
    }

    // Multi-way non-blocking
    select {
    case msg := <-messages:
        fmt.Println("received", msg)
    case sig := <-signals:
        fmt.Println("received signal", sig)
    default:
        fmt.Println("no activity")
    }
}</code></pre>`
          },
          {
            title: "WaitGroups",
            content: `<h1>WaitGroups</h1>

<h2>Basic WaitGroup</h2>
<pre><code>package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // Decrement counter when done

    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 5; i++ {
        wg.Add(1)  // Increment counter
        go worker(i, &wg)
    }

    wg.Wait()  // Block until counter is 0
    fmt.Println("All workers done")
}</code></pre>

<h2>Worker Pool</h2>
<pre><code>package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()

    for j := range jobs {
        fmt.Printf("worker %d processing job %d\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)

    var wg sync.WaitGroup

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)

    // Wait for workers to finish
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    for result := range results {
        fmt.Println("result:", result)
    }
}</code></pre>`
          },
          {
            title: "Mutex and Synchronization",
            content: `<h1>Mutex and Synchronization</h1>

<h2>Basic Mutex</h2>
<pre><code>package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.v[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.v[key]
}

func main() {
    c := SafeCounter{v: make(map[string]int)}
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc("somekey")
        }()
    }

    wg.Wait()
    fmt.Println(c.Value("somekey"))  // 1000
}</code></pre>

<h2>RWMutex</h2>
<pre><code>package main

import (
    "fmt"
    "sync"
    "time"
)

type Cache struct {
    mu    sync.RWMutex
    data  map[string]string
}

func (c *Cache) Get(key string) string {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.data[key]
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[key] = value
}

func main() {
    cache := Cache{data: make(map[string]string)}

    // Multiple concurrent reads
    for i := 0; i < 5; i++ {
        go func(id int) {
            for j := 0; j < 10; j++ {
                fmt.Printf("Reader %d: %s\n", id, cache.Get("key"))
                time.Sleep(10 * time.Millisecond)
            }
        }(i)
    }

    // Occasional writes
    go func() {
        for i := 0; i < 5; i++ {
            cache.Set("key", fmt.Sprintf("value-%d", i))
            time.Sleep(50 * time.Millisecond)
        }
    }()

    time.Sleep(time.Second)
}</code></pre>

<h2>Atomic Operations</h2>
<pre><code>package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var counter uint64
    var wg sync.WaitGroup

    for i := 0; i < 50; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for c := 0; c < 1000; c++ {
                atomic.AddUint64(&counter, 1)
            }
        }()
    }

    wg.Wait()
    fmt.Println("Counter:", counter)  // 50000

    // Atomic load and store
    atomic.StoreUint64(&counter, 0)
    value := atomic.LoadUint64(&counter)
    fmt.Println("Value:", value)
}</code></pre>`
          },
          {
            title: "Context Package",
            content: `<h1>Context Package</h1>

<h2>Cancellation</h2>
<pre><code>package main

import (
    "context"
    "fmt"
    "time"
)

func operation(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Cancelled:", ctx.Err())
            return
        default:
            fmt.Println("Working...")
            time.Sleep(500 * time.Millisecond)
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())

    go operation(ctx)

    time.Sleep(2 * time.Second)
    cancel()  // Cancel the operation

    time.Sleep(time.Second)
}</code></pre>

<h2>Timeout</h2>
<pre><code>package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()

    select {
    case <-time.After(3 * time.Second):
        fmt.Println("Operation completed")
    case <-ctx.Done():
        fmt.Println("Timeout:", ctx.Err())
    }
}</code></pre>

<h2>Deadline and Values</h2>
<pre><code>package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    // Deadline
    deadline := time.Now().Add(2 * time.Second)
    ctx, cancel := context.WithDeadline(context.Background(), deadline)
    defer cancel()

    select {
    case <-time.After(3 * time.Second):
        fmt.Println("Completed")
    case <-ctx.Done():
        fmt.Println("Deadline exceeded:", ctx.Err())
    }

    // Context values
    ctx = context.WithValue(context.Background(), "userID", 12345)
    processRequest(ctx)
}

func processRequest(ctx context.Context) {
    userID := ctx.Value("userID")
    fmt.Println("Processing for user:", userID)
}</code></pre>`
          }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to databases...');
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docpress');
    console.log('MongoDB connected');

    // Define Content model
    const Content = mongoose.model('Content', new mongoose.Schema({
      conceptId: String,
      htmlContent: String,
      rawContent: String,
      contentType: { type: String, default: 'html' },
      createdBy: String,
      lastModifiedBy: String,
      revisions: Array
    }));

    // Get admin user
    const [adminRows] = await sequelize.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (adminRows.length === 0) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }
    const adminId = adminRows[0].id;

    // Seed each subject
    for (let subjectIndex = 0; subjectIndex < seedData.length; subjectIndex++) {
      const subjectData = seedData[subjectIndex];
      const subjectId = uuidv4();

      console.log(`\n=== Creating Subject: ${subjectData.title} ===`);

      // Insert subject
      const [subjectRows] = await sequelize.query(`
        INSERT INTO subjects (id, title, slug, description, "displayOrder", "isPublished", "authorId", "createdAt", "updatedAt")
        VALUES (:id, :title, :slug, :description, :displayOrder, true, :authorId, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id
      `, {
        replacements: {
          id: subjectId,
          title: subjectData.title,
          slug: subjectData.slug,
          description: subjectData.description,
          displayOrder: subjectIndex + 1,
          authorId: adminId
        }
      });

      const finalSubjectId = subjectRows[0].id;

      // Seed topics for this subject
      for (let topicIndex = 0; topicIndex < subjectData.topics.length; topicIndex++) {
        const topicData = subjectData.topics[topicIndex];
        const topicId = uuidv4();

        console.log(`  Creating Topic: ${topicData.title}`);

        // Insert topic
        const [topicRows] = await sequelize.query(`
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
            displayOrder: topicIndex + 1
          }
        });

        const finalTopicId = topicRows[0].id;

        // Seed concepts for this topic
        for (let conceptIndex = 0; conceptIndex < topicData.concepts.length; conceptIndex++) {
          const conceptData = topicData.concepts[conceptIndex];
          const conceptId = uuidv4();

          // Insert content into MongoDB
          const mongoContent = await Content.create({
            conceptId: conceptId,
            htmlContent: conceptData.content,
            rawContent: conceptData.content,
            contentType: 'html',
            createdBy: adminId,
            lastModifiedBy: adminId,
            revisions: []
          });

          // Insert concept into PostgreSQL
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
              title: conceptData.title,
              slug: conceptData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              topicId: finalTopicId,
              contentId: mongoContent._id.toString(),
              displayOrder: conceptIndex + 1
            }
          });

          console.log(`    - Concept: ${conceptData.title}`);
        }
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${seedData.length} subjects with topics and concepts`);

  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    await mongoose.connection.close();
    console.log('\nDatabase connections closed');
  }
}

seedDatabase();
