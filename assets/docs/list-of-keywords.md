# Java Keywords

## 1. Primitive Data Types (8)

| Keyword | Use |
|---------|-----|
| `byte` | 8-bit signed integer. |
| `short` | 16-bit signed integer. |
| `int` | 32-bit signed integer (default integer type). |
| `long` | 64-bit signed integer. |
| `float` | 32-bit floating-point number. |
| `double` | 64-bit floating-point number (default decimal type). |
| `char` | Stores a single Unicode character. |
| `boolean` | Stores `true` or `false`. |

---

## 2. Flow Control / Decision Making (14)

| Keyword | Use |
|---------|-----|
| `if` | Executes code when a condition is true. |
| `else` | Executes code when the `if` condition is false. |
| `switch` | Selects one of many execution paths. |
| `case` | Defines a branch inside a `switch`. |
| `for` | Creates a loop with initialization, condition, and update. |
| `while` | Repeats while a condition remains true. |
| `do` | Executes the loop body at least once before checking the condition. |
| `break` | Terminates the nearest loop or switch. |
| `continue` | Skips the current iteration of a loop. |
| `return` | Exits a method and optionally returns a value. |
| `goto` | Reserved keyword; not used in Java. |
| `throw` | Explicitly throws an exception. |
| `throws` | Declares exceptions a method may throw. |
| `assert` | Verifies assumptions during debugging/testing. |

---

## 3. Exception Handling (4)

| Keyword | Use |
|---------|-----|
| `try` | Wraps code that may throw an exception. |
| `catch` | Handles an exception thrown from a `try` block. |
| `finally` | Executes regardless of whether an exception occurs. |
| `throw` | Throws an exception explicitly. |

---

## 4. OOP / Class & Object (9)

| Keyword | Use |
|---------|-----|
| `class` | Declares a class. |
| `interface` | Declares an interface. |
| `enum` | Declares an enumeration. |
| `extends` | Inherits from a superclass or extends an interface. |
| `implements` | Specifies interfaces implemented by a class. |
| `new` | Creates a new object or array. |
| `this` | Refers to the current object. |
| `super` | Refers to the parent class. |
| `instanceof` | Checks whether an object belongs to a specific type. |

---

## 5. Access Modifiers (3)

| Keyword | Use |
|---------|-----|
| `public` | Accessible from anywhere. |
| `private` | Accessible only within the same class. |
| `protected` | Accessible within the package and subclasses. |

---

## 6. Non-Access Modifiers (8)

| Keyword | Use |
|---------|-----|
| `static` | Belongs to the class rather than an object. |
| `final` | Prevents modification, overriding, or inheritance. |
| `abstract` | Declares an incomplete class or method. |
| `synchronized` | Ensures thread-safe access to code or methods. |
| `native` | Indicates implementation in non-Java code (JNI). |
| `transient` | Excludes a field from serialization. |
| `volatile` | Ensures visibility of variable updates across threads. |
| `strictfp` | Enforces IEEE 754 floating-point calculations. |

---

## 7. Packages & Imports (2)

| Keyword | Use |
|---------|-----|
| `package` | Declares the package of a class. |
| `import` | Imports classes or packages for use. |

---

## 8. Method Related (1)

| Keyword | Use |
|---------|-----|
| `void` | Indicates that a method returns no value. |

---

## 9. Reserved but Unused (3)

| Keyword | Use |
|---------|-----|
| `const` | Reserved keyword; not used in Java. |
| `goto` | Reserved keyword; not used in Java. |
| `_` | Reserved since Java 9; cannot be used as an identifier. |

---

# Java Contextual Keywords (17)

Unlike restricted keywords, **contextual keywords act as keywords only in specific language contexts.**

## 1. Module System (Java 9)

| Keyword | Use |
|---------|-----|
| `module` | Declares a Java module. |
| `open` | Opens all packages in a module for reflection. |
| `opens` | Opens a specific package for reflection. |
| `exports` | Makes a package accessible to other modules. |
| `requires` | Declares a dependency on another module. |
| `transitive` | Makes required modules available transitively. |
| `to` | Restricts `exports` or `opens` to specific modules. |
| `uses` | Declares consumption of a service. |
| `provides` | Declares a service implementation. |
| `with` | Specifies the implementation class for a provided service. |

---

## 2. Other Contextual Keywords

| Keyword | Use |
|---------|-----|
| `var` | Enables local variable type inference. |
| `yield` | Returns a value from a switch expression. |
| `record` | Declares an immutable data carrier class. |
| `sealed` | Restricts which classes/interfaces may extend or implement it. |
| `non-sealed` | Allows further inheritance from a sealed parent. |
| `permits` | Specifies permitted subclasses of a sealed class/interface. |
| `when` | Used in pattern matching for `switch` (preview feature). |

---

#

--Difference Between colletion and collections
--Collextion framework in Java25 in detail
--Emun in Java
--Record in java
--Clonable and serializable
--switch expression in java 25
--Difference between statements and expressions
--relationship of module and package, how package documentation is handeled, how modules are created in java
--pattern matching in java (related to instanceof variable)
--Sequenced Collection in detail
--Executor and Executor Service in detail
--Virtual Threads and Concurrency in java 25[advantges and limitations]
--Callable
--Future in detail 
--CompletableFuture in detail
--CompletionStage
--ThreadLocal
--ScopedValue
--Difference between ThreadLocal and ScopedValue
--Spring CoreReactor
--Predicate, Runnable, Function, Consumer, Supplier in detail[similarities and differences]
--Threads in java[full overview and limitations and why was executor service and virtual threads introduced] 