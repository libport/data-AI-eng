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
### Lab: Exception Handling
#### Exercise 1: Handling ZeroDivisionError
> Imagine you have two numbers and want to determine what happens when you divide one number by the other. To do this, you need to create a Python function called `safe_divide.` You give this function two numbers, a `'numerator'` and a `'denominator'`. The 'numerator' is the number you want to divide, and the `'denominator'` is the number you want to divide by. Use the user input method of Python to take the values.
> 
> The function should be able to do the division for you and give you the result. But here's the catch: if you try to divide by zero (which is not allowed in math), the function should be smart enough to catch that and tell you that it's not possible to divide by zero. Instead of showing an error, it should return None, which means 'nothing' or 'no value', and print `"Error: Cannot divide by Zero.`
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
> Imagine you have a number and want to calculate its square root. To do this, you need to create a Python function. You give this function one number, `'number1'`.
> 
> The function should generate the square root value if you provide a positive integer or float value as input. However, the function should be clever enough to detect the mistake if you enter a negative value. It should kindly inform you with a message saying, `'Invalid input! Please enter a positive integer or a float value.`
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
> Imagine you have a number and want to perform a complex mathematical task. The calculation requires dividing the value of the input argument "num" by the difference between "num" and 5, and the result has to be stored in a variable called "result".
> 
> You have to define a function so that it can perform that complex mathematical task. The function should handle any potential errors that occur during the calculation. To do this, you can use a try-except block. If any exception arises during the calculation, it should catch the error using the generic exception class "Exception" as "e". When an exception occurs, the function should display "An error occurred during calculation.
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