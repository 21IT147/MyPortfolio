# 01-Java-Keywords.md

# Java Keywords

> Java keywords are **reserved words** that have predefined meanings in the language and **cannot be used as identifiers** (variable names, class names, method names, etc.). Java also has **contextual keywords** that act as keywords only in specific contexts.

---

# Table of Contents

1. What are Java Keywords?
2. Restricted Keywords
3. Contextual Keywords
4. Categories of Restricted Keywords
5. Reserved but Unused Keywords
6. Restricted vs Contextual Keywords
7. Interview Questions
8. Quick Revision

---

# 1. What are Java Keywords?

A **keyword** is a reserved word that the Java compiler recognizes with a predefined meaning.

Example:

```java
int age = 22;
```

Here, `int` is a keyword and cannot be used as an identifier.

❌ Invalid

```java
int class = 10;
```

---

# 2. Types of Keywords

Java has two types of keywords:

* **Restricted Keywords (51)** – Always treated as keywords.
* **Contextual Keywords (17)** – Treated as keywords only in specific contexts.

---

# 3. Restricted Keywords (51)

## A. Primitive Data Types (8)

| Keyword   | Use                          |
| --------- | ---------------------------- |
| `byte`    | 8-bit signed integer         |
| `short`   | 16-bit signed integer        |
| `int`     | 32-bit signed integer        |
| `long`    | 64-bit signed integer        |
| `float`   | 32-bit floating-point number |
| `double`  | 64-bit floating-point number |
| `char`    | Stores a Unicode character   |
| `boolean` | Stores `true` or `false`     |

---

## B. Flow Control / Decision Making (14)

| Keyword    | Use                                            |
| ---------- | ---------------------------------------------- |
| `if`       | Executes code when condition is true           |
| `else`     | Executes alternate block                       |
| `switch`   | Multiple conditional branching                 |
| `case`     | Represents a switch branch                     |
| `for`      | Loop with initialization, condition and update |
| `while`    | Repeats while condition is true                |
| `do`       | Executes loop body before checking condition   |
| `break`    | Exits loop or switch                           |
| `continue` | Skips current iteration                        |
| `return`   | Exits a method                                 |
| `goto`     | Reserved but unused                            |
| `throw`    | Throws an exception                            |
| `throws`   | Declares exceptions thrown by a method         |
| `assert`   | Verifies assumptions during debugging          |

---

## C. Exception Handling (4)

| Keyword   | Use                                    |
| --------- | -------------------------------------- |
| `try`     | Wraps code that may throw an exception |
| `catch`   | Handles an exception                   |
| `finally` | Executes regardless of exception       |
| `throw`   | Explicitly throws an exception         |

> **Note:** `throw` also appears in Flow Control because it changes the execution flow.

---

## D. OOP / Class & Object (9)

| Keyword      | Use                                    |
| ------------ | -------------------------------------- |
| `class`      | Declares a class                       |
| `interface`  | Declares an interface                  |
| `enum`       | Declares an enumeration                |
| `extends`    | Inherits from a parent class/interface |
| `implements` | Implements an interface                |
| `new`        | Creates an object                      |
| `this`       | Refers to current object               |
| `super`      | Refers to parent class                 |
| `instanceof` | Checks object type                     |

---

## E. Access Modifiers (3)

| Keyword     | Use                                      |
| ----------- | ---------------------------------------- |
| `public`    | Accessible from everywhere               |
| `protected` | Accessible within package and subclasses |
| `private`   | Accessible only inside the class         |

---

## F. Non-Access Modifiers (8)

| Keyword        | Use                                           |
| -------------- | --------------------------------------------- |
| `static`       | Member belongs to class                       |
| `final`        | Prevents modification/overriding/inheritance  |
| `abstract`     | Declares incomplete class or method           |
| `synchronized` | Makes code thread-safe                        |
| `native`       | Implemented in native (C/C++) code            |
| `transient`    | Excludes field from serialization             |
| `volatile`     | Ensures visibility across threads             |
| `strictfp`     | Enforces IEEE 754 floating-point calculations |

---

## G. Packages & Imports (2)

| Keyword   | Use                      |
| --------- | ------------------------ |
| `package` | Declares package         |
| `import`  | Imports classes/packages |

---

## H. Method Related (1)

| Keyword | Use                       |
| ------- | ------------------------- |
| `void`  | Indicates no return value |

---

## I. Reserved but Unused (3)

| Keyword | Use                                                    |
| ------- | ------------------------------------------------------ |
| `const` | Reserved for future use                                |
| `goto`  | Reserved for future use                                |
| `_`     | Reserved since Java 9; cannot be used as an identifier |

---

# 4. Contextual Keywords (17)

Unlike restricted keywords, contextual keywords are treated as keywords **only in specific language constructs**.

---

## Module System (Java 9) (10)

| Keyword      | Use                                                |
| ------------ | -------------------------------------------------- |
| `module`     | Declares a module                                  |
| `open`       | Opens all packages for reflection                  |
| `opens`      | Opens a specific package for reflection            |
| `exports`    | Exports a package to other modules                 |
| `requires`   | Declares module dependency                         |
| `transitive` | Makes required modules transitively available      |
| `to`         | Restricts `exports` or `opens` to specific modules |
| `uses`       | Declares service consumption                       |
| `provides`   | Declares a service implementation                  |
| `with`       | Specifies service implementation class             |

---

## Other Contextual Keywords (7)

| Keyword      | Introduced | Use                                  |
| ------------ | ---------- | ------------------------------------ |
| `var`        | Java 10    | Local variable type inference        |
| `yield`      | Java 14    | Returns value from switch expression |
| `record`     | Java 16    | Declares immutable data carrier      |
| `sealed`     | Java 17    | Restricts inheritance                |
| `non-sealed` | Java 17    | Removes inheritance restriction      |
| `permits`    | Java 17    | Specifies permitted subclasses       |
| `when`       | Preview    | Guard condition in pattern matching  |

---

# 5. Reserved but Unused Keywords

These keywords are reserved but currently have no implementation.

| Keyword | Reason                                        |
| ------- | --------------------------------------------- |
| `const` | Reserved to avoid future compatibility issues |
| `goto`  | Reserved because Java avoids goto statements  |
| `_`     | Reserved from Java 9 onwards                  |

---

# 6. Restricted vs Contextual Keywords

| Feature                                    | Restricted               | Contextual                |
| ------------------------------------------ | ------------------------ | ------------------------- |
| Reserved everywhere                        | ✅                        | ❌                         |
| Can be used as identifier in some contexts | ❌                        | ✅                         |
| Count                                      | 51                       | 17                        |
| Examples                                   | `class`, `int`, `public` | `var`, `record`, `sealed` |

---

# 7. Frequently Asked Interview Questions

### Q1. How many restricted keywords are there in Java?

**51**

---

### Q2. How many contextual keywords are there?

**17**

---

### Q3. Difference between `throw` and `throws`?

| `throw`             | `throws`                 |
| ------------------- | ------------------------ |
| Throws an exception | Declares exceptions      |
| Used inside method  | Used in method signature |

---

### Q4. Difference between `this` and `super`?

| `this`                   | `super`                 |
| ------------------------ | ----------------------- |
| Refers to current object | Refers to parent object |

---

### Q5. Difference between `extends` and `implements`?

| `extends`         | `implements`             |
| ----------------- | ------------------------ |
| Class inheritance | Interface implementation |

---

### Q6. Difference between `static` and `final`?

* `static` → Belongs to the class.
* `final` → Prevents modification.

---

### Q7. Why are `goto` and `const` reserved?

To avoid future language conflicts and maintain compatibility.

---

### Q8. Can `var` be used as a class name?

Yes, because `var` is a **contextual keyword**, not a restricted keyword. However, it is discouraged because it can reduce code readability.

---

# 8. Quick Revision

## Primitive Types

```text
byte
short
int
long
float
double
char
boolean
```

---

## Access Modifiers

```text
public
protected
private
```

---

## OOP

```text
class
interface
enum
extends
implements
new
this
super
instanceof
```

---

## Exception Handling

```text
try
catch
finally
throw
throws
```

---

## Threading

```text
synchronized
volatile
transient
native
```

---

## Packages

```text
package
import
```

---

## Method

```text
void
```

---

## Reserved

```text
const
goto
_
```

---

## Contextual Keywords

### Module System

```text
module
open
opens
exports
requires
transitive
to
uses
provides
with
```

### Others

```text
var
yield
record
sealed
non-sealed
permits
when
```

---

# Cheat Sheet

| Category                      |  Count |
| ----------------------------- | -----: |
| Primitive Data Types          |      8 |
| Flow Control                  |     14 |
| Exception Handling            |      4 |
| OOP / Class & Object          |      9 |
| Access Modifiers              |      3 |
| Non-Access Modifiers          |      8 |
| Packages & Imports            |      2 |
| Method Related                |      1 |
| Reserved but Unused           |      3 |
| **Restricted Keywords Total** | **51** |
| **Contextual Keywords Total** | **17** |

---

## One-Line Summary

* **Restricted keywords** are always reserved by the compiler.
* **Contextual keywords** behave as keywords only in specific language contexts.
* Java has **51 restricted keywords** and **17 contextual keywords**.
* `throw` throws an exception, while `throws` declares it.
* `var`, `record`, `sealed`, and `yield` are contextual keywords introduced in newer Java versions.
