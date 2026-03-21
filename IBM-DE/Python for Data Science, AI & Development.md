# Python for Data Science, AI & Development
### Python Basics
Python is a high-level, general-purpose language known for readable syntax and a huge ecosystem. It’s widely used in data science, AI and machine learning, web development, and IoT, supported by an active global community and strong documentation.
#### Working in Jupyter notebooks
Jupyter is a web application for creating and sharing notebooks: documents that combine code, output (tables/plots), and narrative text. Notebooks are built from cells. Code cells execute immediately, while Markdown cells hold formatted explanations and headings, making it easier to communicate results alongside computations. Jupyter can support multiple languages via kernels, but it’s commonly used with Python.

Everyday notebook actions:
- Run a cell: Shift + Enter (or the Run button).
- Add or delete cells: use the + toolbar button; delete with Edit → Delete Cells or by pressing D twice.
- Run everything: Run → Run All Cells for a clean top-to-bottom execution.
- Work in parallel: open multiple notebooks and arrange them side-by-side.
- Present and wrap up: mix Markdown and code for a “story,” optionally use slide mode, then shut down the kernel to release memory (“No Kernel” indicates it’s stopped).
#### Expressions and variables
An expression is something Python evaluates to produce a value. Arithmetic expressions combine operands (numbers) with operators (+, -, , /). In Python 3, `/` always returns a float (for example, `25 / 5` evaluates to `5.0`). Operator precedence follows standard math rules: multiplication/division happen before addition/subtraction unless parentheses override the order.

Variables store values to reuse them:
- `total_min = 142`
- `total_hour = total_min / 60`

Reassigning `total_min` changes future results without rewriting formulas. Use meaningful names (often with underscores) so code remains readable.

A precision fix: `//` is floor division, meaning it rounds down (toward negative infinity). This is not “round to nearest,” and it differs from truncation for negative values (e.g., `-3 // 2` is `-2`).
#### Types and typecasting
A type describes how Python represents data. Common built-ins include `int` (integers), `float` (floating-point numbers), `str` (strings), and `bool` (`True`/`False`). Inspect a value with `type(x)`.

Typecasting converts between types:
- `float(2)` → `2.0`
- `int(1.9)` → `1` (fraction discarded)
- `int("123")` → `123`, but `int("1.2")` raises an error; use `float("1.2")` instead
- `str(3.14)` → `"3.14"`
- `int(True)` → `1` and `int(False)` → `0`; `bool(0)` → `False`, `bool(1)` → `True`

Python’s `int` can grow to very large values (limited mainly by memory), while floats have limited precision.
#### Strings as sequences
A string is a sequence of characters enclosed in quotes (single or double). Strings can contain letters, digits, spaces, and punctuation, and can assign them to variables and print them.

Indexing is zero-based: `s[0]` is the first character. Negative indexes count from the end: `s[-1]` is the last character. Slicing uses `s[start:stop]`, where `stop` is _exclusive_:

```python
name = "The BodyGuard"
print(name[:3])    # "The"
print(name[4:8])   # "Body"
```

Add a step (stride): `s[start:stop:step]`. For example, `s[::2]` selects every second character. Use `len(s)` to get string length.

Strings support sequence-style operations:
- **Concatenation:** `"The " + "BodyGuard"` → `"The BodyGuard"`
- **Replication:** `"ha" * 3` → `"hahaha"`

Strings are immutable: Can’t change a character in place, but can create a new string from old pieces (e.g., `name + " is the best"`).

One correction from the notebook: there is no built-in string method named `camelcase()`. If “title-cased” version is required, try `name.title()`, or implement customised own transformation.
#### Escape Sequences and Raw Strings
Backslashes start escape sequences, which represent special characters:
- `\n` newline, `\t` tab, `\\` a literal backslash

Raw strings (prefix with `r`) treat backslashes literally. They’re useful for Windows paths and for regular-expression patterns, where backslashes are common.

```python
print("Line1\nLine2")
print(r"C:\new_folder\file.txt")
```
#### Useful string methods
Most string methods return a new string (they don’t mutate the original):
- `upper()` converts to uppercase
- `lower()`  converts to lowercase
- `replace(old, new)` substitutes a substring
- `find(sub)` returns the first index of `sub`, or `-1` if not found
- `split()` returns an array of substrings,  defaults to whitespace as separators.

```python
a = "Thriller is the sixth studio album"
print(a.upper())

b = "The BodyGuard is the best album"
print(b.replace("BodyGuard", "Janet"))

name = "The BodyGuard"
print(name.find("Guard"))     # index or -1
print(name.split())           # ["The", "BodyGuard"]
```
#### Formatting strings for output
Three common formatting styles appear in the materials:
- f-strings: `f"My name is {name} and I am {age}."`
- str.format(): `"My name is {} and I am {}.".format(name, age)`
- % operator: `"My name is %s and I am %d." % (name, age)`

F-strings are often preferred because they’re readable and can evaluate expressions inside `{}` (for example, `f"sum={x+y}"`).

```python
name = "John"
age = 30
print(f"My name is {name} and I am {age} years old.")
print("My name is {} and I am {} years old.".format(name, age))
print("My name is %s and I am %d years old." % (name, age))
```
#### Regular expressions in Python
RegEx matchs text by pattern, using Python’s built-in `re` module:
- `re.search(pattern, text)` returns the first match or `None`
- `match.group()` retrieves the matched substring
- `re.findall(pattern, text)` returns all matches as a list
- `re.split(pattern, text)` splits using a pattern
- `re.sub(pattern, repl, text)` replaces matches

Write patterns as raw strings (`r"..."`) to avoid accidental escapes. The notebook demonstrates tokens such as `\d` (a digit) and `\W` (a non-word character). A phone-number pattern, for instance, can be written as `r"\d{10}"` (ten digits). Always check that a match exists before calling `.group()`.

```python
import re

text = "My phone number is 1234567890"
m = re.search(r"\d{10}", text)
if m:
    digits = m.group()
    print(digits[:3] + "-" + digits[3:6] + "-" + digits[6:])
else:
    print("No phone number found")
```
### Python Data Structures
#### Tuples: ordered and immutable
A tuple is an ordered sequence, written as comma-separated elements (often inside parentheses):

```python
ratings = (10, 9, 6.5, "classic", 10)
```

Tuples can mix types. Access elements by index starting at 0 (`ratings[0]`). Negative indexes count from the end (`ratings[-1]`). Slicing returns a new tuple containing a range: `ratings[0:3]` gives the first three items. The end index is exclusive, so it should be “one past” the last index required.

Concatenate tuples with `+`:

```python
combined = ("a", "b") + (1, 2)
```

Tuples are immutable, meaning can’t change an item in place (`ratings[2] = 7` raises an error). If needing a modified version, create a new tuple or convert to a list first. To sort a tuple, use `sorted(ratings)`, which returns a new list. Tuples can also be nested, and can chain indexes:

```python
nested = (1, ("x", "y"), ["p", "q"])
nested[1][0]  # "x"
```

### Lists: ordered and mutable
Lists look similar, but use square brackets and can be changed in place:

```python
L = ["HardRock", 10, 1.2]
```

Indexing and slicing work exactly like tuples. Lists support concatenation with `+`, and they also have mutating methods:

```python
L.extend(["Jazz", 8])   # adds each element
L.append(["Pop", 9])    # adds one element (a nested list)
```

Because lists are mutable, to replace or delete elements:

```python
L[0] = "Banana"
del L[1]
```

A useful string-to-list pattern is `split`:

```python
"ACDC,Back in Black".split(",")
```

Watch out for aliasing: `b = L` makes `b` point at the same list object, so changes to `L` appear in `b`. To clone, make a shallow copy with `L[:]` or `list(L)`.
### Sets: unordered and unique
A set is an unordered collection of unique elements. Create one with curly braces (duplicates are dropped) or with `set(...)`:

```python
A = {"ACDC", "BackInBlack", "ACDC"}
B = set(["ACDC", "Who", "Who"])
```

Sets don’t support indexing. Instead, use membership tests and set operations:

```python
"ACDC" in A
A.add("NSYNC")
A.discard("NSYNC")
common = AlbumSet1 & AlbumSet2   # intersection
all_items = AlbumSet1 | AlbumSet2  # union
```

> [!NOTE]
> Both `discard()` and `remove()` methods remove an element from a set, but their behavior when the element is not found is different. 

| Method      | When element exists | When element does NOT exist  |
| ----------- | ------------------- | ---------------------------- |
| `discard()` | Removes the element | Does nothing (no `KeyError`) |
| `remove()`  | Removes the element | Raises a `KeyError`          |
Use `discard()` when unsure if the item is in the set and don't require the program to raise an exception. Use `remove()` when expecting the element to be present, and its absence indicates an error in logic or data.

To test containment, use `issubset()` (lowercase): `common.issubset(AlbumSet1)`.
### Dictionaries: key-value mappings
A dictionary stores values by key (a label instead of a numeric index):

```python
albums = {"Back in Black": 1980, "The Dark Side of the Moon": 1973}
```

Keys must be unique and immutable (strings, numbers, tuples). Values can be any type and may repeat; in many examples the value is a release date or year. Access and update values by key:

```python
albums["Back in Black"]
albums["Graduation"] = 2007
```

Delete with `del`, and remember that `in` checks keys (not values):

```python
del albums["Graduation"]
"Thriller" in albums
albums.keys(); albums.values()
```
### Choosing the right type
Use tuples for fixed records, lists for ordered collections that will be modified, sets for fast membership/uniqueness, and dictionaries for quick lookups by name or ID.
## Python Programming Fundamentals
Python programs evaluate conditions, branch into different code paths, repeat work with loops, package reusable logic into functions, handle runtime failures with exceptions, and model data and behaviour with objects and classes. These features work together to create predictable behaviour from changing inputs.
#### Comparison operators and Boolean results
Comparison operators test a relationship between operands and return Boolean results, `True` or `False`.

- `==` tests whether two values are equal.
- `!=` tests whether two values differ. The `!` character is an exclamation mark.
- `<`, `<=`, `>`, `>=` test ordering for values that support ordering comparisons.

Numeric comparisons follow magnitude. Floating-point comparisons work the same way, though rounding can affect equality tests when values come from calculations.

String comparisons are lexicographic. Python compares characters in order until a difference appears, then decides based on the first differing character. Case and spelling matter.

Python also supports chained comparisons, which read naturally and avoid repeated names.

```python
a = 6
a == 7   # False
a == 6   # True

i = 6
i > 5    # True
i >= 5   # True
i < 6    # False
i != 2   # True

x = 5
0 <= x <= 10  # True

"AC/DC" == "Michael Jackson"  # False
"AC/DC" != "Michael Jackson"  # True
```
#### Branching with if, elif, else
Branching selects which statements execute based on a condition.

- `if` starts a conditional block.
- `elif` adds an additional condition that is checked only when earlier conditions are `False`.
- `else` provides a default path when no earlier condition is `True`.

Python uses a colon to start each block and indentation to define the block body. Parentheses around the condition are optional. Statements after the conditional blocks execute regardless of which branch ran.

Boolean results commonly drive control flow. A program can store a comparison result in a variable and reuse it across multiple checks, which reduces duplicated logic and supports clearer naming.

```python
age = 17

if age >= 18:
    print("Access granted")
else:
    print("Access denied")

print("Move on")
```

Multiple outcomes suit an `if` with one or more `elif` branches. Only the first matching branch executes.

```python
age = 18

if age > 18:
    print("Attend an all-ages event")
elif age == 18:
    print("Attend an age-limited event")
else:
    print("Attend an under-18 event")
```

Nested conditionals support decisions that depend on a first choice. An ATM-style workflow often checks a menu selection, then checks constraints on an entered amount.

```python
choice = "Withdraw Cash"

if choice == "Withdraw Cash":
    amount = int(input("Enter the amount to withdraw: "))
    if amount % 10 == 0:
        print("Amount dispensed:", amount)
    else:
        print("Enter a multiple of 10")
else:
    print("Session ended")
```
#### Logical operators
Logical operators combine and transform Boolean expressions.

- `not x` flips the truth value of `x`.
- `x and y` is `True` only when both expressions are `True`.
- `x or y` is `True` when at least one expression is `True`.

`and` and `or` evaluate left to right and stop early when the final result is already determined. This short-circuit behaviour avoids unnecessary work and can prevent errors when a later expression relies on an earlier check.

Operator precedence places `not` before `and`, and `and` before `or`, so parentheses can improve readability when conditions become complex.

```python
album_year = 1990

if album_year < 1980 or album_year > 1989:
    print("Not an 80s album")

album_year = 1983
if album_year >= 1980 and album_year <= 1989:
    print("An 80s album")

is_do_not_disturb = True
if not is_do_not_disturb:
    send_notification("New message received")
```
#### Loops: for, range, enumerate, while
Loops repeat a block of code while changing state. The repeating pattern is consistent even when syntax differs.

- Initialisation sets starting values.
- A condition or sequence controls when repetition stops.
- Each iteration runs the loop body.
- An update step changes state so progress occurs.

A `for` loop iterates over items in a sequence. A `range` object supplies a sequence of integers.

- `range(n)` produces `0` up to `n - 1`.
- `range(start, stop)` produces `start` up to `stop - 1`.

In Python 3, `range` creates a lazy sequence rather than a list, which saves memory for large ranges. A list can be created with `list(range(...))` when required.

```python
for i in range(3):
    print(i)  # 0, 1, 2

for i in range(10, 15):
    print(i)  # 10 to 14
```

A loop can update list elements by index. This pattern uses `range(len(list_name))` to visit each index.

```python
colours = ["red", "yellow", "green"]
for i in range(len(colours)):
    colours[i] = "white"
```

Direct iteration suits read-only processing, or cases where the element value is sufficient.

```python
squares = ["red", "yellow", "green"]
for colour in squares:
    print(colour)
```

`enumerate` yields pairs of index and value, which supports tasks that need both.

```python
fruits = ["apple", "banana", "orange"]
for index, fruit in enumerate(fruits):
    print("Index:", index, "Fruit:", fruit)
```

A `while` loop repeats as long as its condition remains `True`. It suits cases where the number of iterations is unknown at the start. The loop body must update state to avoid infinite repetition.

A common pattern copies items until a sentinel condition fails.

```python
squares = ["orange", "orange", "purple", "orange"]
new_squares = []
i = 0

while i < len(squares) and squares[i] == "orange":
    new_squares.append(squares[i])
    i += 1
```

Loop choice depends on the problem shape.

- A `for` loop suits processing every item in a known sequence.
- A `while` loop suits processing until a condition changes, such as waiting for valid input or scanning until a non-matching value appears.

Loop variables represent the current item or index. A `for` loop overwrites its loop variable each iteration, so later code should not assume it retains an earlier value unless explicitly captured. When a loop updates a list by index, the code must ensure indexes remain valid and avoid mixing index updates with changes that alter list length inside the same loop.
#### Functions: reuse, inputs, outputs, and side effects
A function packages a repeated action into a named unit. Functions support modular program design and make behaviour easier to test in isolation.

- A function can accept inputs through parameters.
- A function can return a value with `return`.
- A function can also perform side effects, such as printing, writing a file, or mutating a list.

Python provides built-in functions for common tasks.

- `len` returns the length of a sequence or collection.
- `sum` totals numeric items in an iterable.
- `max` and `min` return the largest and smallest items.

```python
values = [10, 20, 30]
print(len(values))
print(sum(values))
print(max(values), min(values))
```

Python also distinguishes between a function that returns a new value and a method that mutates an object.

- `sorted(sequence)` returns a new sorted list.
- `list.sort()` sorts a list in place and returns `None`.

```python
ratings = [10, 9, 6, 10, 10, 8, 9, 6]

new_ratings = sorted(ratings)
ratings.sort()

print(new_ratings)
print(ratings)
```

A user-defined function starts with `def`, names parameters in parentheses, and uses an indented block for its body. Multiple parameters allow a function to express richer behaviour.

```python
def add_one(a):
    b = a + 1
    return b

def mult(a, b):
    return a * b

print(add_one(5))
print(mult(10, 3.14))
```

When a function has no explicit `return`, Python returns `None`. This design suits functions that exist mainly for side effects.

```python
def print_name():
    print("Michael Jackson")

result = print_name()
print(result)  # None
```

Docstrings describe function purpose and can be displayed with `help`, which improves maintainability in shared codebases.

```python
def calculate_total(a, b):
    """Return the sum of two numbers."""
    return a + b

Function calls bind argument values to parameter names for the duration of the call. Each call creates a new local scope, so local variables from one call do not leak into the next.

- Parameters are the names in the function definition.
- Arguments are the values supplied at the call site.
- A returned value can be assigned to a name or passed into another function.

```python
total = calculate_total(2, 3)
print(total)
print(calculate_total(total, 10))
```
```

Python is dynamically typed, so operators can behave differently depending on operand types. Multiplying a string by an integer repeats the string rather than raising an error. This flexibility makes quick experimentation easier, but it also increases the need for tests and input validation.

```python
print(2 * "Michael Jackson")
print(2 * 3)
```

A `pass` statement provides an empty placeholder block when syntax requires a body.

```python
def no_work():
    pass
```

Functions can contain loops and can call other functions. This combination supports reusable patterns such as printing indexed items in a sequence.

```python
def show_indexed(items):
    for i, item in enumerate(items):
        print(i, item)

show_indexed(["a", "b", "c"])
```

Variadic parameters accept a variable number of arguments. `*args` packs extra positional arguments into a tuple.

```python
def show_names(*names):
    for name in names:
        print(name)

show_names("AC/DC", "Pink Floyd", "Meat Loaf")
```
#### Scope: global and local names
Scope determines where a name is visible and which value a name refers to.

- Global scope holds names defined outside any function.
- Local scope holds names defined inside a function call.

A local name can reuse a global name without conflict because each function call creates its own local namespace. Python resolves names by checking the local scope first, then the global scope.

```python
date = 2017

def thriller():
    date = 1982
    return date

print(thriller())  # 1982
print(date)        # 2017
```

Reading a global variable from inside a function works without special syntax. Assigning to a global variable from inside a function requires `global`, which can make behaviour harder to trace. A function that returns a value and lets the caller assign it usually produces clearer code.

```python
rating = 9

def add_one_to_rating():
    return rating + 1

new_rating = add_one_to_rating()
```
#### Exceptions and error handling
Python raises exceptions when operations fail at runtime. Handling exceptions prevents a program from terminating unexpectedly and provides controlled recovery paths. Exception handling also separates normal logic from recovery logic, which improves readability when failures are expected, such as invalid user input or unavailable files.

A `try` block runs code that might fail. One or more `except` blocks catch and handle specific exception types. Catching a broad exception without naming a type can hide the true cause of a fault and slow debugging, particularly inside larger programs.

Good exception handling focuses on precision and intent.

- Catch the most specific exception types that match the operation.
- Keep the `try` block small so the source of failure is clear.
- Use clear messages or logging that explain what failed.
- Allow unexpected exceptions to surface during development.

```python
try:
    amount = int(input("Enter a number: "))
    result = 10 / amount
except ValueError:
    print("Enter digits only")
except ZeroDivisionError:
    print("Division by zero is not allowed")
```

File operations can fail for many reasons, including missing files, permissions, and path errors. In Python 3, these errors are usually subclasses of `OSError`, including `FileNotFoundError`.

`else` runs only when the `try` block completes without raising an exception. `finally` runs regardless of success or failure and suits cleanup such as closing a file handle.

```python
file_handle = None
try:
    file_handle = open("data.txt", "w", encoding="utf-8")
    file_handle.write("Hello")
except OSError:
    print("File operation failed")
else:
    print("File written successfully")
finally:
    if file_handle is not None:
        file_handle.close()
        print("File closed")
```

Common exception types include:
- `TypeError` for incompatible operations on types.
- `IndexError` for invalid list or tuple indexes.
- `KeyError` for missing dictionary keys.
- `ImportError` for failed imports.
- `ValueError` for invalid values passed to an operation.

Syntax errors occur before execution, such as `SyntaxError` from invalid code structure, and cannot be recovered with `try`. These issues require source changes.
#### Objects and classes
Python treats values as objects. Each object has a type, an internal representation, and methods that operate on the object.

A class defines a new type by specifying attributes and methods. An object created from a class is an instance. Instances carry state through attribute values and expose behaviour through methods.

Dot notation accesses attributes and calls methods. `type(obj)` reports an object's type. `dir(obj)` lists attributes and methods, including internal names that start and end with underscores.

Names wrapped in double underscores usually exist for the interpreter and standard library. Application code typically uses the plain attribute and method names, and treats underscore-heavy names as implementation details.

A class commonly defines `__init__`, which initialises instance attributes. The first parameter, `self`, refers to the instance under construction. Class attributes live on the class and are shared across instances, while instance attributes can vary for each object.

This distinction supports shared configuration and per-object state.

- Class attributes store shared constants or defaults.
- Instance attributes store values that differ for each instance.

An instance can access a class attribute through dot notation, though assigning to the same name on the instance creates or updates an instance attribute instead of changing the class attribute.

```python
class Circle:
    def __init__(self, radius, colour):
        self.radius = radius
        self.colour = colour

    def add_radius(self, r):
        self.radius = self.radius + r

c1 = Circle(2, "red")
c2 = Circle(4, "green")
c1.add_radius(3)
print(c1.radius, c2.radius)
```

Changing attributes directly is possible, though methods usually provide a clearer, validated interface to state changes.

```python
c1.colour = "blue"
```

A second class can model a different shape with different attributes.

```python
class Rectangle:
    def __init__(self, height, width, colour):
        self.height = height
        self.width = width
        self.colour = colour

r1 = Rectangle(2, 3, "yellow")
print(r1.height, r1.width, r1.colour)
```

A class can also include shared settings as class attributes and can enforce constraints through methods.

```python
class Car:
    max_speed = 120

    def __init__(self, make, model, colour, speed=0):
        self.make = make
        self.model = model
        self.colour = colour
        self.speed = speed

    def accelerate(self, delta):
        if self.speed + delta <= Car.max_speed:
            self.speed += delta
        else:
            self.speed = Car.max_speed

    def get_speed(self):
        return self.speed

car1 = Car("Toyota", "Camry", "Blue")
car2 = Car("Honda", "Civic", "Red")
car1.accelerate(30)
car2.accelerate(20)
print(car1.get_speed(), car2.get_speed())
```
### Lab: Exception Handling
#### Exercise 1: Handling ZeroDivisionError
Imagine you have two numbers and want to determine what happens when you divide one number by the other. To do this, you need to create a Python function called `safe_divide.` You give this function two numbers, a `'numerator'` and a `'denominator'`. The 'numerator' is the number you want to divide, and the `'denominator'` is the number you want to divide by. Use the user input method of Python to take the values.

The function should be able to do the division for you and give you the result. But here's the catch: if you try to divide by zero (which is not allowed in math), the function should be smart enough to catch that and tell you that it's not possible to divide by zero. Instead of showing an error, it should return None, which means 'nothing' or 'no value', and print `"Error: Cannot divide by Zero.`
##### Solution
``` Python
def divide(num,denom):
    try:
        result = num / denom
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero.")
        return None

num = int(input("Enter the numerator value: "))
denom = int(input("Enter the denominator value: "))
print(divide(num,denom))
```
#### Exercise 2: Handling ValueError
Imagine you have a number and want to calculate its square root. To do this, you need to create a Python function. You give this function one number, `'number1'`.

The function should generate the square root value if you provide a positive integer or float value as input. However, the function should be clever enough to detect the mistake if you enter a negative value. It should kindly inform you with a message saying, `'Invalid input! Please enter a positive integer or a float value.`
##### Solution
``` Python
from math import sqrt

def square_root(number):
    try:
        result = sqrt(number)
        return result
    except ValueError:
        print("Unexpected input: please provide a positive int or float.")
        return None
    except:
	    print("Unexpected input.")
	    return None

input_number=int(input("Enter number to square root: "))
print(square_root(input_number))
```
#### Exercise 3: Handling Generic Exceptions
Imagine you have a number and want to perform a complex mathematical task. The calculation requires dividing the value of the input argument "num" by the difference between "num" and 5, and the result has to be stored in a variable called "result".

You have to define a function so that it can perform that complex mathematical task. The function should handle any potential errors that occur during the calculation. To do this, you can use a try-except block. If any exception arises during the calculation, it should catch the error using the generic exception class "Exception" as "e". When an exception occurs, the function should display "An error occurred during calculation.
##### Solution
``` Python
def calc(num):
    try:
        result = num / (num - 5)
        print ("Result: " + str(result))
    except Exception as e:
        print("Error:", e)

f_input = float(input("Enter a number: "))
calc(f_input)
```
---
### Lab: Objects and Classes
#### Scenario: Car dealership's inventory management system
You are working on a Python program to simulate a car dealership's inventory management system. The system aims to model cars and their attributes accurately.
##### Task 1
You are tasked with creating a Python program to represent vehicles using a class. Each car should have attributes for maximum speed and mileage.
```Python
class Vehicle:
    # Constructor
    def __init__(self, maxSpeed, mileage):
        self.maxSpeed = maxSpeed 
        self.mileage = mileage
```
##### Task 2
Update the class with the default color for all vehicles," white".
```Python
class Vehicle:
	color = "white"
    # Constructor
    def __init__(self, maxSpeed, mileage):
        self.maxSpeed = maxSpeed 
        self.mileage = mileage
```
##### Task 3
Additionally, you need to create methods in the Vehicle class to assign seating capacity to a vehicle.
```Python
class Vehicle:
	colour = "white"
    # Constructor
    def __init__(self, maxSpeed, mileage):
		self.maxSpeed = maxSpeed 
		self.mileage = mileage
        
    def addSeats(self, seats):
		self.seats = seats
	    
```
##### Task 4
Create a method to display all the properties of an object of the class.
```Python
class Vehicle:
	colour = "white"
    # Constructor
    def __init__(self, maxSpeed, mileage):
        self.maxSpeed = maxSpeed 
        self.mileage = mileage
        
    def addSeats(self, seats):
	    self.seats = seats
	    
	def displayAttr(self):
		print("Attributes:")
		print(self.colour)
		print(self.seats)
		print(self.maxSpeed)
		print(self.mileage)
```
##### Task 5
Additionally, you need to create two objects of the Vehicle class object that should have a max speed of 200kmph and mileage of 20kmpl with five seating capacities, and another car object should have a max speed of 180kmph and mileage of 25kmpl with four seating capacities.
```Python
carOne = Vehicle(200, 20)
carOne.addSeats(5)
carTwo = Vehicle(180,25)
carTwo.addSeats(4)
```

> [!NOTE]
> Vehicle.displayAttr() won't work if you don't call Vehicle.addSeats() prior. The solution doesn't tell you this, but it is better practice to declare all attributes that can be acted on by a method, in the constructor, to avoid AttributeError exceptions.

---
#### Lab: Text Analysis
Let's consider a real-life scenario where you are analyzing customer feedback for a product. You have a large data set of customer reviews in the form of strings, and you want to extract useful information from them using the three identified tasks:
##### Task 1
String in lowercase: You want to pre-process the customer feedback by converting all the text to lowercase. This step helps standardize the text. Lower casing the text allows you to focus on the content rather than the specific letter casing.
##### Task 2
Frequency of all words in a given string: After converting the text to lowercase, you want to determine the frequency of each word in the customer feedback. This information will help you identify which words are used more frequently, indicating the key aspects or topics that customers are mentioning in their reviews. By analyzing the word frequencies, you can gain insights into the most common issues raised by customers.
##### Task 3
Frequency of a specific word: In addition to analyzing the overall word frequencies, you want to specifically track the frequency of a particular word that is relevant to your analysis. For example, you might be interested in monitoring how often the word "reliable" appears in customer reviews to gauge customer sentiment about the product's reliability. By focusing on the frequency of a specific word, you can gain a deeper understanding of customer opinions or preferences related to that particular aspect.

By performing these tasks on the customer feedback dataset, you can gain valuable insights into customer sentiment
##### Solution
```Python
import string
from collections import Counter

class TextAnalyzer:
    def __init__(self, text):
        self.unFormatted = text
        self.lowered = text.lower()
        table = str.maketrans({st: " " for st in string.punctuation})
        self.noPunc = self.lowered.translate(table)
        self.tokenised = self.noPunc.split()
        self.wordFreq = dict(Counter(self.tokenised))
    
    def returnFreq(self, word):
       	return self.wordFreq[word]
```
## Working with Data in Python
### File handling with open()
Python reads and writes files through file objects returned by `open()`. The call accepts a file path and a mode. The path can be a simple filename when the file sits in the current working directory, or an absolute or relative path when it sits elsewhere. The mode tells Python how the program intends to use the file.

A typical read operation looks like:

```python
f = open("file.txt", "r")
```

The variable f now references a file object. That object exposes useful attributes, including name and mode, which help with debugging and logging. Code that calls `open()` must also close the file when it finishes, usually with `f.close()`. Leaving files open can waste system resources and can delay writes being flushed to disk.

The with statement manages the file lifecycle. A context manager created by with `open(...) as f:` closes the file when the block ends, including when an exception interrupts the block. This pattern reduces leaks and prevents accidental use of a handle after closing.

```python
with open("file.txt", "r") as f:
    data = f.read()
```
### Reading text files
A file object supports several reading strategies. The best choice depends on file size and on whether the program needs random access or streaming.

- `read()` returns the remaining file content as one string. It suits small to medium files and quick transformations.
- `readline()` returns the next line as a string, including the trailing newline character when present. It suits interactive processing where each line triggers an action.
- `readlines()` returns a list of lines. Each list element is one line from the file in order. It suits cases where the program needs indexing into the line list.

Printing a string renders new lines. Inspecting the raw representation shows newline characters as "\n". Programs that compare strings often strip the newline with `rstrip("\n")` when the newline is not meaningful.

Iterating over the file object streams line by line without an explicit `readline()` call:

```python
with open("file.txt", "r") as f:
    for line in f:
        print(line, end="")
```

This loop stops when the iterator reaches end of file. The pattern scales better than `readlines()` for large inputs.
### Reading specific characters and positions
Python reads a fixed number of characters with `read(n)`, where n is the number of characters to return from the current file position. Each call advances the file pointer, so successive reads continue from where the previous read stopped.

Random access uses `seek(offset)`. For text files, the offset refers to a position in the underlying byte stream. In practice, seek works reliably when the program uses an encoding that matches the file and avoids seeking into the middle of multi-byte characters. Code that needs predictable offsets often uses binary mode and decodes the bytes after reading.

```python
with open("file.txt", "r") as f:
    f.seek(10)
    chunk = f.read(5)
```

The program can combine `seek()` and `read()` to sample headers, skip fixed-width fields, or resume processing from a known checkpoint.
### Writing, appending, and copying files
Writing requires a mode that permits output. The most common modes are:
- "w" creates a new file or truncates an existing file, then writes from the start
- "a" opens a file for appending and writes at the end
- "x" creates a new file and fails if the file already exists

The `write()` method writes the provided string and returns the number of characters written. A newline must be included explicitly with "\n" when the output needs line breaks.

```python
with open("Example2.txt", "w") as f:
    f.write("This is line A\n")
    f.write("This is line B\n")
```

Writing multiple lines often uses a list and a loop:
- store each line as a string in a list
- iterate over the list
- write each string plus "\n" to keep the output readable

```python
lines = ["This is line 1", "This is line 2", "This is line 3"]
with open("Example3.txt", "w") as f:
    for line in lines:
        f.write(line + "\n")
```

Appending preserves existing content and adds new data at the end, which suits logs and incremental exports.

```python
with open("Example2.txt", "a") as f:
    f.write("This is line C\n")
```

Copying one text file to another uses two open calls. The program reads from the source in "r" mode and writes to the destination in "w" mode. Iterating over the source file object copies line by line without loading the full file into memory.

```python
with open("source.txt", "r") as src, open("destination.txt", "w") as dst:
    for line in src:
        dst.write(line)
```
### File modes used in practice
Python uses a compact mode string to combine behaviours. The program can extend the basic modes with:
- "+" to allow both reading and writing
- "b" to use binary mode
- "t" to force text mode, though text is the default

Common combinations include:
- "r" read an existing file, raising an error if it does not exist
- "w" write, creating or truncating the file
- "a" append, creating the file if required
- "x" exclusive creation
- "rb" and "wb" for binary reads and writes
- "r+" read and write without truncation
- "w+" write and read with truncation
- "a+" append and read

Mode choice affects data safety. "w" can destroy existing content, so programs that cannot risk overwriting often use "x" or write to a temporary file and rename it after validation.
### Pandas essentials for data analysis
Pandas is a third-party library that provides high-level data structures for tabular and labelled data. Code typically imports it as:

```python
import pandas as pd
```

The two core structures are:
- Series: a one-dimensional labelled array, similar to a single spreadsheet column
- DataFrame: a two-dimensional table with labelled rows and columns

Pandas loads common data formats into a DataFrame.

- `pd.read_csv(path)` loads a CSV file
- `pd.read_excel(path)` loads an Excel file into a DataFrame

The program assigns the result to a variable such as df and then inspects a sample:

```python
df = pd.read_csv("your_file.csv")
df.head()
```

DataFrames support a spreadsheet-like mental model. Columns can hold different data types, and each column uses a label for selection and joins.

Creating a DataFrame from a dictionary maps keys to column labels and lists to column values:

```python
data = {"Name": ["Alice", "Bob"], "Age": [25, 30]}
df = pd.DataFrame(data)
```
### Selecting and indexing data in Pandas
Column selection uses labels.

- `df["Name"]` returns a Series
- `df[["Name", "Age"]]` returns a DataFrame

Row and cell selection uses either integer position or labels.

- `df.iloc[2]` selects the third row by position
- `df.iloc[2, 1] `selects a single cell by position
- `df.loc[1]` selects the row with label 1
- `df.loc[1, "Name"]` selects a single cell by label

Label-based indexing becomes important when the index uses meaningful identifiers. When the program replaces a default integer index with labels such as "A", "B", and "C", `df.loc["A", "Artist"]` selects the value at that labelled row and column.

Slicing creates subsets. Position-based slicing uses standard Python slice rules, including the exclusion of the end index. Label-based slicing with loc includes both endpoints for ordered labels, which can surprise new users.
### Working with unique values, filters, and exports
Pandas supports exploratory analysis with methods that operate on columns.

- `df["Released"].unique()` returns the distinct values in a column
- `df["Released"].nunique()` returns the number of distinct values

Filtering uses Boolean masks:

```python
mask = df["Released"] > 1979
df1 = df[mask]
```

This pattern scales to multiple conditions by combining masks with & and | operators, wrapped in parentheses.

Exports write the transformed data back to disk. `df.to_csv("output.csv", index=False)` writes a CSV file and omits the DataFrame index. Pandas also writes to Excel and other formats through dedicated methods.
### NumPy essentials for numerical computing
NumPy is the standard library for fast numerical arrays in Python. It provides the ndarray type, which stores fixed-size, homogeneous data efficiently. Code typically imports it as:

```python
import numpy as np
```

A one-dimensional ndarray often represents a vector. A two-dimensional ndarray represents a matrix. Creating an array commonly starts from a Python list:

```python
u = np.array([1, 0])
v = np.array([0, 1])
m = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
```

Key array attributes include:
- ndim number of dimensions
- shape size along each dimension
- size total number of elements
- dtype data type of elements

These attributes help validate inputs before computation and explain why operations fail when shapes do not align.
### Indexing, slicing, and vector-style operations in NumPy
Indexing uses bracket notation. For a 1D array, u\[0\] selects the first element. For a 2D array, m\[row, col\] selects a single element.

Slicing selects contiguous ranges. For example, m\[0, :2\] selects the first row and the first two columns. m\[:2, -1\] selects the last column for the first two rows.

NumPy applies arithmetic element-wise by default. Arrays of the same shape support addition, subtraction, multiplication, and division on corresponding positions. This includes the Hadamard product, where u * v multiplies element by element.

Scalar operations apply to every element. NumPy adds a scalar to an array through broadcasting, which avoids loops in Python code and often runs much faster.
### Dot products, matrix multiplication, and universal functions
The dot product produces a scalar for two 1D vectors of equal length. `np.dot(u, v)` calculates the sum of products across positions. Matrix multiplication uses the same dot machinery, or the @ operator for arrays with compatible shapes.

NumPy also provides universal functions that apply element-wise to arrays.

- `np.sin(x)` applies the sine function to every element
- `np.sqrt(x)` applies square root
- `np.exp(x)` applies the exponential function

Aggregation methods summarise arrays.

- `x.mean()` returns the average value
- `x.max()` returns the maximum value
- `np.sum(x)` returns the total across all elements
### Generating grids and plotting functions
NumPy generates evenly spaced values with `np.linspace(start, stop, num)`. This supports numerical evaluation of functions over an interval, such as evaluating `sin()` from 0 to 2*pi.

Plotting commonly uses Matplotlib, typically imported as `matplotlib.pyplot as plt`. A basic plot maps x values to y values:

```python
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)
plt.plot(x, y)
plt.show()
```

This pattern supports quick checks of model behaviour and transformations.
### Matrix operations overview
Linear algebra operations follow shape rules.

- Element-wise addition, subtraction, and multiplication require matching shapes.
- Matrix multiplication requires the number of columns in the left matrix to match the number of rows in the right matrix. If A has shape m x n and B has shape n x p, then A @ B has shape m x p.
- A row vector dotted with a column vector of the same length produces a scalar.
- A column vector dotted with a row vector produces a 2D matrix.

These rules explain why some multiplications are valid and why the resulting array changes shape.