# Java Deep-Dive Notes

> Personal reference covering Collections, Modern Java (Records, Enums, Pattern Matching, Switch Expressions), Modules, Concurrency (Threads, Executors, Virtual Threads, Futures), Functional Interfaces, and Reactor.

---

## Table of Contents
1. [Collection vs Collections](#1-collection-vs-collections)
2. [Collections Framework in Java 25](#2-collections-framework-in-java-25-in-detail)
3. [Enum in Java](#3-enum-in-java)
4. [Record in Java](#4-record-in-java)
5. [Cloneable and Serializable](#5-cloneable-and-serializable)
6. [Switch Expression in Java 25](#6-switch-expression-in-java-25)
7. [Statements vs Expressions](#7-difference-between-statements-and-expressions)
8. [Modules & Packages](#8-relationship-of-module-and-package)
9. [Pattern Matching (instanceof)](#9-pattern-matching-in-java-instanceof)
10. [Sequenced Collections](#10-sequenced-collection-in-detail)
11. [Executor and ExecutorService](#11-executor-and-executorservice-in-detail)
12. [Virtual Threads & Concurrency (Java 25)](#12-virtual-threads-and-concurrency-in-java-25)
13. [Callable](#13-callable)
14. [Future](#14-future-in-detail)
15. [CompletableFuture](#15-completablefuture-in-detail)
16. [CompletionStage](#16-completionstage)
17. [ThreadLocal](#17-threadlocal)
18. [ScopedValue](#18-scopedvalue)
19. [ThreadLocal vs ScopedValue](#19-difference-between-threadlocal-and-scopedvalue)
20. [Spring / Project Reactor](#20-spring-corereactor)
21. [Predicate, Runnable, Function, Consumer, Supplier](#21-predicate-runnable-function-consumer-supplier)
22. [Threads in Java — Full Overview](#22-threads-in-java-full-overview-limitations-and-why-executorservice--virtual-threads)

---

## 1. Collection vs Collections

These sound similar but are completely different constructs.

| Aspect | `Collection` | `Collections` |
|---|---|---|
| Type | Interface (`java.util.Collection<E>`) | Final utility class (`java.util.Collections`) |
| Purpose | Root interface representing a group of objects ("elements") | Provides static helper/utility methods to operate on collections |
| Instantiable? | No — it's an interface, implemented by `List`, `Set`, `Queue`, etc. | No — it has a private constructor; all methods are `static` |
| Contains | Method declarations like `add()`, `remove()`, `size()`, `iterator()` | Algorithms like `sort()`, `reverse()`, `synchronizedList()`, `unmodifiableList()`, `max()`, `min()`, `binarySearch()`, `emptyList()`, `singletonList()` |
| Extends | `Iterable<E>` | `Object` |
| Analogy | Like `Arrays` is to array *type*, `Collection` is the *type family* | Like `Arrays` (utility class) — `Collections` is to `Collection` what `Arrays` is to arrays |

### Example
```java
// Collection - the interface / contract
Collection<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");

// Collections - the utility class
Collections.sort((List<String>) names);
List<String> unmodifiable = Collections.unmodifiableList((List<String>) names);
List<String> empty = Collections.emptyList();
List<String> synced = Collections.synchronizedList(new ArrayList<>());
```

**Key takeaway:** `Collection` is a *data structure abstraction*; `Collections` is a *toolbox* of static algorithms that work on those abstractions (similar relationship to `Map`/`Collection` vs `Objects` utility class for `Object`).

---

## 2. Collections Framework in Java 25 (In Detail)

The **Java Collections Framework (JCF)** is a unified architecture for representing and manipulating groups of objects. It consists of:

### 2.1 Core Interface Hierarchy
```text
Iterable
  +-- Collection
        +-- List        (ordered, duplicates allowed, index access)
        |     +-- ArrayList
        |     +-- LinkedList
        |     +-- Vector (legacy, synchronized)
        |     +-- CopyOnWriteArrayList (concurrent)
        |
        +-- Set          (no duplicates)
        |     +-- HashSet
        |     +-- LinkedHashSet
        |     +-- TreeSet (implements SortedSet, NavigableSet)
        |     +-- EnumSet
        |
        +-- Queue        (FIFO / priority processing)
        |     +-- PriorityQueue
        |     +-- ArrayDeque
        |     +-- (java.util.concurrent) BlockingQueue, ConcurrentLinkedQueue
        |
        +-- Deque        (double-ended queue, extends Queue)
              +-- ArrayDeque
              +-- LinkedList

Map (NOT a Collection, separate hierarchy but part of framework)
  +-- HashMap
  +-- LinkedHashMap
  +-- TreeMap (SortedMap, NavigableMap)
  +-- Hashtable (legacy)
  +-- EnumMap
  +-- (java.util.concurrent) ConcurrentHashMap
```

### 2.2 Key Implementations & Characteristics

| Implementation | Ordering | Null allowed | Thread-safe | Backing structure | Time complexity (avg) |
|---|---|---|---|---|---|
| `ArrayList` | Insertion order | Yes | No | Resizable array | get O(1), add O(1) amortized, remove O(n) |
| `LinkedList` | Insertion order | Yes | No | Doubly linked list | add/remove O(1) at ends, get O(n) |
| `HashSet` | No guaranteed order | one `null` | No | `HashMap` internally | O(1) avg |
| `LinkedHashSet` | Insertion order | one `null` | No | Hash table + linked list | O(1) avg |
| `TreeSet` | Sorted (natural/Comparator) | No `null` | No | Red-Black tree | O(log n) |
| `HashMap` | No guaranteed order | one null key, many null values | No | Array of buckets (tree-ified after 8 collisions) | O(1) avg |
| `LinkedHashMap` | Insertion or access order | Yes | No | Hash table + linked list | O(1) avg |
| `TreeMap` | Sorted by key | No null key | No | Red-Black tree | O(log n) |
| `ConcurrentHashMap` | No order | No null key/value | Yes (segmented locking / CAS) | Bucketed, lock striping | O(1) avg |
| `CopyOnWriteArrayList` | Insertion order | Yes | Yes (copy-on-write) | Array copied on mutation | read O(1), write O(n) |

### 2.3 Modern Additions (Java 9 → 25)

- **Java 9**: `List.of()`, `Set.of()`, `Map.of()` / `Map.ofEntries()` — immutable factory methods (throw `UnsupportedOperationException` on mutation, disallow `null`).
- **Java 10**: `Collectors.toUnmodifiableList/Set/Map()`, `List.copyOf()`.
- **Java 16**: `Stream.toList()` shortcut (returns an unmodifiable list).
- **Java 21**: **Sequenced Collections** (`SequencedCollection`, `SequencedSet`, `SequencedMap`) — unified first/last access (see section 10).
- **Java 21**: Virtual-thread-friendly concurrent collections improvements, `KeyValueHolder` refinements.
- **Java 25 (as of latest LTS-track updates)**: Continued refinement of Collections under Project Amber/Valhalla influence — no major *new* collection type shipped in 25 itself, but the framework benefits from:
  - Finalized **Structured Concurrency** & **Scoped Values** interplay with concurrent collections.
  - Pattern matching for switch now works fluently with records stored in collections for destructuring during iteration.
  - Continued JEP-driven internal performance work (e.g., `HashMap`/`ConcurrentHashMap` bucket handling improvements) — behavior-compatible, not new API surface.

  > Practically: "Java 25 Collections Framework" = the same JCF interfaces you know (List/Set/Map/Queue/Deque), **plus** everything added since Java 9 (immutable factories) and Java 21 (Sequenced Collections) — these are the pieces most interviews/usage in 2025+ actually mean by "Java 25 collections."

### 2.4 Immutable Factory Methods (Java 9+)
```java
List<Integer> nums = List.of(1, 2, 3);      // immutable, no nulls allowed
Set<String> set   = Set.of("a", "b");
Map<String,Integer> map = Map.of("a", 1, "b", 2);
Map<String,Integer> map2 = Map.ofEntries(
    Map.entry("a", 1),
    Map.entry("b", 2)
);

nums.add(4); // throws UnsupportedOperationException
```

### 2.5 Choosing the Right Collection

- Need index-based random access → `ArrayList`
- Need frequent insert/delete at both ends → `ArrayDeque` (preferred over `LinkedList` even for stacks/queues today)
- Need uniqueness + fast lookup → `HashSet`
- Need uniqueness + insertion order → `LinkedHashSet`
- Need uniqueness + sorted order → `TreeSet`
- Need key-value fast lookup → `HashMap`
- Need key-value + insertion order → `LinkedHashMap`
- Need key-value + sorted → `TreeMap`
- Need thread-safety → `ConcurrentHashMap`, `CopyOnWriteArrayList`, or `Collections.synchronizedXxx()` wrappers
- Need LIFO/FIFO/priority → `ArrayDeque` / `PriorityQueue`

---

## 3. Enum in Java

`enum` is a special class type representing a fixed set of constants. Since Java 5.

### Key Properties
- Implicitly extends `java.lang.Enum<E>` (so an enum **cannot extend any other class**, but **can implement interfaces**).
- Each constant is an implicit `public static final` instance of the enum type.
- Compiler generates `values()` (returns array of all constants) and `valueOf(String)` (parses name to constant).
- Enums can have fields, constructors (implicitly `private`), and methods — including **constant-specific method bodies**.
- Enums are inherently `Serializable` and `Comparable` (ordered by declaration/ordinal).
- Safe for use in `switch` statements/expressions.

### Basic Example
```java
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}

Day d = Day.MONDAY;
for (Day day : Day.values()) {
    System.out.println(day.ordinal() + " " + day.name());
}
```

### Enum with Fields, Constructor, Methods
```java
public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6);

    private final double mass;   // kg
    private final double radius; // m

    Planet(double mass, double radius) { // implicitly private
        this.mass = mass;
        this.radius = radius;
    }

    double surfaceGravity() {
        final double G = 6.67300E-11;
        return G * mass / (radius * radius);
    }
}
```

### Constant-Specific Method Bodies (abstract methods per constant)
```java
public enum Operation {
    PLUS  { public int apply(int a, int b) { return a + b; } },
    MINUS { public int apply(int a, int b) { return a - b; } };

    public abstract int apply(int a, int b);
}
```

### EnumSet / EnumMap
Specialized high-performance collections for enums, backed by bit-vectors internally.
```java
EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
EnumMap<Day, String> schedule = new EnumMap<>(Day.class);
```

### Enum in switch (Java 21+ pattern matching)
```java
String desc = switch (d) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Weekday";
    case SATURDAY, SUNDAY -> "Weekend";
};
```

### Why use enums over `public static final int` constants?
- Type safety (compiler prevents passing invalid values).
- Namespacing (`Day.MONDAY` vs magic int `0`).
- Can carry behavior/data, not just a value.
- `values()`/`valueOf()` reflection-free enumeration.

---

## 4. Record in Java

Introduced as preview in Java 14, finalized in **Java 16**. A `record` is a special, restricted kind of class for modeling **immutable data carriers** ("plain data aggregates").

### What the compiler generates automatically
For:
```java
public record Point(int x, int y) { }
```
The compiler generates:
- A `private final` field for each component (`x`, `y`).
- A **canonical constructor** `Point(int x, int y)`.
- Public **accessor methods** matching component names: `x()`, `y()` (NOT `getX()`).
- `equals()` and `hashCode()` based on all components.
- `toString()` like `Point[x=1, y=2]`.

### Compact Constructor (validation without repeating parameter list)
```java
public record Point(int x, int y) {
    public Point {          // compact constructor - no parameter list repeated
        if (x < 0 || y < 0) throw new IllegalArgumentException("must be non-negative");
        // no need for this.x = x; this.y = y; — done implicitly
    }
}
```

### Records Can Have
- Static fields/methods.
- Additional (non-canonical) constructors — must delegate to the canonical constructor.
- Instance methods (but not additional instance fields beyond components).
- Implement interfaces.

### Records Cannot
- Extend another class (implicitly extends `java.lang.Record`).
- Be extended (implicitly `final`).
- Declare additional instance fields.
- Be abstract.

### Example with interface + static factory
```java
public record Range(int lo, int hi) implements Comparable<Range> {
    public Range {
        if (lo > hi) throw new IllegalArgumentException("lo > hi");
    }
    public static Range of(int lo, int hi) { return new Range(lo, hi); }
    public int length() { return hi - lo; }

    @Override
    public int compareTo(Range o) { return Integer.compare(lo, o.lo); }
}
```

### Record Patterns (Java 21+) — destructuring
```java
record Point(int x, int y) {}

Object obj = new Point(3, 4);
if (obj instanceof Point(int x, int y)) {
    System.out.println(x + y);
}

// Nested destructuring in switch
record Line(Point start, Point end) {}
static String describe(Object o) {
    return switch (o) {
        case Line(Point(var x1, var y1), Point(var x2, var y2)) ->
            "Line from (%d,%d) to (%d,%d)".formatted(x1, y1, x2, y2);
        default -> "unknown";
    };
}
```

### When to use Records
- DTOs, value objects, API responses, tuple-like data, map/reduce intermediate results.
- Anywhere you'd hand-write a class with only fields + `equals`/`hashCode`/`toString`/getters and no mutable state.

**Not** suitable when you need mutability, inheritance, or lazy-initialized/derived mutable state.

---

## 5. Cloneable and Serializable

Both are **marker interfaces** (no methods) — they signal a capability to the JVM rather than defining a contract via methods.

### Cloneable
```java
public interface Cloneable { }  // empty marker
```
- Signals that `Object.clone()` is legal to call on instances of this class.
- If a class does **not** implement `Cloneable` and you call `clone()`, it throws `CloneNotSupportedException`.
- `Object.clone()` performs a **shallow copy** by default (field-by-field copy; nested objects are shared, not copied).
- Must override `clone()` and make it `public` (native `Object.clone()` is `protected`).

```java
class Point implements Cloneable {
    int x, y;
    @Override
    public Point clone() {
        try {
            return (Point) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e); // can't happen since we implement Cloneable
        }
    }
}
```
**Deep clone** requires manually cloning mutable referenced fields too, or preferably avoiding `clone()` altogether (Joshua Bloch's *Effective Java* recommends copy constructors / static factory "copy" methods instead — `Cloneable` is widely considered a design flaw in Java: it's fragile, doesn't play well with `final` fields, and its contract is under-specified).

### Serializable
```java
public interface Serializable { }  // empty marker
```
- Signals that instances can be converted to a byte stream (`ObjectOutputStream`) and reconstructed (`ObjectInputStream`), for persistence, caching, or network transfer (e.g., RMI, session replication).
- JVM's default serialization uses reflection to write all non-`transient`, non-`static` fields.
- `transient` fields are skipped during serialization.
- `serialVersionUID` — a `private static final long` — controls version compatibility across serialize/deserialize of evolving classes; recommended to declare explicitly to avoid `InvalidClassException` on class changes.
- Custom control: implement `writeObject(ObjectOutputStream)` / `readObject(ObjectInputStream)`, or `Externalizable` for full manual control.

```java
class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private transient String password; // excluded from serialization
}
```

### Cloneable vs Serializable — comparison

| Aspect | `Cloneable` | `Serializable` |
|---|---|---|
| Purpose | In-memory object duplication | Convert object ⇄ byte stream |
| Methods defined | None (marker only); relies on `Object.clone()` | None (marker only); relies on `ObjectOutputStream`/`ObjectInputStream` reflection |
| Failure mode without interface | `CloneNotSupportedException` | `NotSerializableException` |
| Depth | Shallow by default | Deep by default (whole object graph is serialized, following references) |
| Modern alternative | Copy constructors, builder pattern, `record` with `with...` methods | JSON (Jackson/Gson), Protocol Buffers |
| Common criticism | Fragile, shallow copy semantics, doesn't compose well with inheritance | Security risks (deserialization attacks), versioning fragility, slower than modern formats |

---

## 6. Switch Expression in Java 25

Switch **expressions** (finalized Java 14) return a value, unlike traditional switch **statements**. Java 21 added pattern matching for switch (finalized), and Java 25 continues on that same finalized model — no fall-through, arrow syntax, exhaustiveness checking.

### Traditional switch statement (fall-through, no value)
```java
int day = 3;
String name;
switch (day) {
    case 1: name = "Mon"; break;
    case 2: name = "Tue"; break;
    default: name = "Unknown";
}
```

### Switch Expression (arrow syntax, Java 14+)
```java
String name = switch (day) {
    case 1 -> "Mon";
    case 2 -> "Tue";
    case 3 -> "Wed";
    default -> "Unknown";
};
```
- No fall-through with `->`.
- Multiple labels per case: `case 1, 7 -> "Weekend-ish";`
- Block body uses `yield` to return a value:
```java
int numLetters = switch (day) {
    case 1, 2, 3 -> {
        int len = 3;
        yield len;
    }
    default -> 0;
};
```

### Pattern Matching in switch (Java 21+, stable in 25)
```java
static String formatType(Object obj) {
    return switch (obj) {
        case Integer i when i > 0 -> "positive int: " + i;
        case Integer i -> "non-positive int: " + i;
        case String s -> "string of length " + s.length();
        case null -> "it's null!";           // explicit null handling
        default -> "unknown type";
    };
}
```
- **Guarded patterns** with `when` clause for extra conditions.
- **`case null`** can be handled explicitly inside switch (previously threw `NullPointerException`).
- **Exhaustiveness**: for `sealed` types/enums, the compiler enforces all cases are covered, so `default` can be omitted.

### Sealed + Records + Switch (a very common Java 21-25 idiom)
```java
sealed interface Shape permits Circle, Square, Rectangle {}
record Circle(double radius) implements Shape {}
record Square(double side) implements Shape {}
record Rectangle(double w, double h) implements Shape {}

static double area(Shape s) {
    return switch (s) {
        case Circle c -> Math.PI * c.radius() * c.radius();
        case Square sq -> sq.side() * sq.side();
        case Rectangle r -> r.w() * r.h();
        // no default needed - compiler knows all permitted subtypes are covered
    };
}
```

### Rules & Gotchas
- Every branch must either `yield`/return a value of a compatible type or throw.
- Mixing `->` and `:` syntax in the same switch block is not allowed.
- Switch expression must be **exhaustive** (cover all possible input values, or have a `default`).

---

## 7. Difference between Statements and Expressions

| Aspect | Statement | Expression |
|---|---|---|
| Definition | A complete unit of execution — performs an action | A piece of code that **evaluates to a value** |
| Returns a value? | No | Yes |
| Can be used inline? | No (can't assign a statement to a variable) | Yes — can be embedded in other expressions/assignments |
| Terminated by | Semicolon `;` as a full unit | Combined with operators, or as part of a larger statement |
| Examples | `if`, `for`, `while`, `switch` (statement form), variable declaration, `return;`, method call used purely for side effect | `2 + 3`, `a > b`, `x++`, `new Foo()`, method calls that return a value, `switch` **expression**, ternary `? :`, lambda expressions |

### Examples
```java
// Statement — no value produced, controls flow
if (x > 0) {
    System.out.println("positive");
}

// Expression — produces a value
int y = x + 5;          // "x + 5" is an expression
boolean b = (x > 0);    // "(x > 0)" is an expression
int max = (a > b) ? a : b; // ternary is an expression

// Java 14+: switch can be BOTH
switch (x) { case 1: System.out.println("one"); }      // statement form
int result = switch (x) { case 1 -> 10; default -> 0; }; // expression form
```

### Expression Statements
Some expressions, when followed by `;`, become "expression statements" — a bridge between the two:
```java
x++;              // expression "x++" used as a statement
foo();            // method call expression used as a statement
new Object();     // object creation expression used as a statement
```

**Rule of thumb:** *"Can I put this on the right side of an `=`?"* — if yes, it's an expression. If it only controls flow or performs an action without yielding a usable value, it's a statement.

---

## 8. Relationship of Module and Package

### Package
- A **namespace mechanism** grouping related classes/interfaces (e.g., `com.company.util`).
- Maps to a directory structure on disk / in the JAR.
- Declared with `package com.company.util;` at the top of a `.java` file.
- Controls **access** via package-private (default) visibility.
- Has existed since Java 1.0.

### Module (Java 9+, Project Jigsaw / JPMS — Java Platform Module System)
- A **higher-level grouping of packages** — a "package of packages," representing a deployable, self-describing unit.
- Declared via a `module-info.java` file at the root of the module's source tree.
- Provides **strong encapsulation**: only explicitly `exported` packages are visible to other modules, even if classes inside are `public`.
- Declares dependencies (`requires`), exposed API (`exports`), services (`provides`/`uses`), and reflective access permissions (`opens`).

### Relationship

```
Module (e.g., com.myapp.core)
 +-- module-info.java
 +-- package com.myapp.core.service
 |      +-- OrderService.java
 |      +-- PaymentService.java
 +-- package com.myapp.core.util   (internal, NOT exported)
        +-- StringHelper.java
```

- A module **contains** one or more packages.
- A package belongs to exactly one module (in the module path — packages can't be split across modules, this is the "split package" restriction).
- Packages provide **compile-time/source-level organization + access-modifier scoping**; Modules provide **deployment-level organization + strong encapsulation + explicit dependency graph**, enforced by the JVM at runtime, not just convention.

### Example `module-info.java`
```java
module com.myapp.core {
    requires java.sql;               // dependency on another module
    requires transitive java.logging; // re-exported to consumers of this module

    exports com.myapp.core.service;  // public API surface
    // com.myapp.core.util is NOT exported -> invisible outside module, even though classes are public

    opens com.myapp.core.model to com.fasterxml.jackson.databind; // reflective access for a specific module (e.g., JSON libs)

    provides com.myapp.core.spi.PaymentProvider
        with com.myapp.core.service.StripePaymentProvider; // service provider

    uses com.myapp.core.spi.PaymentProvider; // service consumer
}
```

### How Package Documentation is Handled
- **Javadoc** is the standard tool: `/** ... */` comments above classes/methods/fields.
- Package-level documentation goes in a `package-info.java` file placed in the package directory:
```java
/**
 * Provides classes for handling order processing and payment workflows.
 * <p>This package is the core domain layer of the application.</p>
 *
 * @since 1.0
 */
package com.myapp.core.service;
```
- Module-level documentation can also live directly as a Javadoc comment on `module-info.java`:
```java
/**
 * Core business module providing order and payment services.
 */
module com.myapp.core {
    exports com.myapp.core.service;
}
```
- Running `javadoc` on a modular project generates a module-aware documentation site: module summary page → package summary pages → class pages, respecting `exports` (unexported/internal packages are excluded from generated public docs unless `-private`/specific flags are used).

### How Modules Are Created (Steps)
1. Organize source in a directory structure matching package names, e.g. `src/com.myapp.core/com/myapp/core/service/OrderService.java`.
2. Add a `module-info.java` at the module's source root (same level as the top-level package folders).
3. Declare `requires` for dependencies and `exports` for public API packages.
4. Compile with the module path:
   ```
   javac -d out --module-source-path src -m com.myapp.core
   ```
5. Run with:
   ```
   java --module-path out -m com.myapp.core/com.myapp.core.Main
   ```
6. Optionally, package as a **modular JAR** (contains `module-info.class`) using `jar --create --file mods/core.jar -C out/com.myapp.core .`
7. Use `jlink` to create a custom, minimal runtime image containing only the modules your app needs.

### Why Modules Were Introduced
- Pre-Java 9, everything on the classpath was one flat namespace — no true encapsulation (`public` meant public to the *entire JVM*), "JAR hell" (no way to declare/verify dependencies), and monolithic `rt.jar` (the whole JDK loaded regardless of what you used).
- JPMS solves: strong encapsulation, reliable configuration (fail fast at startup for missing dependencies), scalable platform (via `jlink`, a Java app can ship a minimal, custom-sized JRE).

---

## 9. Pattern Matching in Java (instanceof, variable binding)

Introduced (finalized) in **Java 16**: `instanceof` pattern matching removes the need for explicit casting after a type check.

### Before (Java 15 and earlier)
```java
if (obj instanceof String) {
    String s = (String) obj;   // manual cast required
    System.out.println(s.length());
}
```

### After — Pattern Matching for instanceof (Java 16+)
```java
if (obj instanceof String s) {   // "s" is the pattern variable
    System.out.println(s.length());  // no cast needed, s is in scope
}
```

### Scope of the Pattern Variable
The pattern variable `s` is only **definitely assigned** (usable) in contexts where the compiler can prove the type check succeeded:

```java
// Usable in the "true" branch
if (obj instanceof String s) {
    System.out.println(s);
}

// Usable AFTER an early return/throw in the negative branch (flow scoping)
if (!(obj instanceof String s)) {
    return;
}
System.out.println(s); // s is in scope here! Because if we reach this line, obj IS a String

// Usable when combined with && (short-circuit guarantees prior conditions held)
if (obj instanceof String s && s.length() > 5) {
    System.out.println("long string: " + s);
}

// NOT usable with || (compiler can't prove type in that branch)
// if (obj instanceof String s || s.isEmpty()) { }  // COMPILE ERROR
```

### Pattern Matching for switch (Java 21+, see also section 6)
```java
static String describe(Object obj) {
    return switch (obj) {
        case Integer i -> "int " + i;
        case String s when s.isBlank() -> "blank string";
        case String s -> "string " + s;
        case null -> "null value";
        default -> "something else";
    };
}
```

### Record Patterns (Java 21+) — nested destructuring
```java
record Point(int x, int y) {}
record Rect(Point topLeft, Point bottomRight) {}

if (obj instanceof Rect(Point(var x1, var y1), Point(var x2, var y2))) {
    int width = x2 - x1;
}
```

### Benefits
- Eliminates boilerplate casting.
- Reduces `ClassCastException` risk.
- Enables safer, more expressive **exhaustive** logic when combined with `sealed` types.
- Improves readability — intent (type check + extraction) is expressed in one line.

---

## 10. Sequenced Collection in Detail

Introduced in **Java 21** (JEP 431) to solve a long-standing gap: there was no uniform way to say "give me the first/last element" or "iterate in reverse" across ordered collection types (`List` had `get(0)`/`get(size()-1)`, but `LinkedHashSet` and `LinkedHashMap` had no equivalent, and `Deque` had a different, incompatible API).

### New Interfaces

```java
interface SequencedCollection<E> extends Collection<E> {
    SequencedCollection<E> reversed();
    void addFirst(E e);
    void addLast(E e);
    E getFirst();
    E getLast();
    E removeFirst();
    E removeLast();
}

interface SequencedSet<E> extends Set<E>, SequencedCollection<E> {
    SequencedSet<E> reversed();  // covariant override
}

interface SequencedMap<K,V> extends Map<K,V> {
    SequencedMap<K,V> reversed();
    SequencedSet<K> sequencedKeySet();
    SequencedCollection<V> sequencedValues();
    SequencedSet<Map.Entry<K,V>> sequencedEntrySet();
    V putFirst(K k, V v);
    V putLast(K k, V v);
    Map.Entry<K,V> firstEntry();
    Map.Entry<K,V> lastEntry();
    Map.Entry<K,V> pollFirstEntry();
    Map.Entry<K,V> pollLastEntry();
}
```

### Who implements what

| Interface | Implemented by |
|---|---|
| `SequencedCollection` | `List` (all impls), `Deque` (all impls), `LinkedHashSet` |
| `SequencedSet` | `LinkedHashSet`, `TreeSet` |
| `SequencedMap` | `LinkedHashMap`, `TreeMap` |

`HashSet` and `HashMap` do **not** implement these — they have no defined encounter order.

### Example Usage
```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3));
list.addFirst(0);
list.addLast(4);
System.out.println(list.getFirst());       // 0
System.out.println(list.getLast());        // 4
System.out.println(list.reversed());       // [4, 3, 2, 1, 0]

LinkedHashMap<String,Integer> map = new LinkedHashMap<>();
map.put("a", 1);
map.put("b", 2);
map.putFirst("z", 0);                       // insert at start
System.out.println(map.firstEntry());       // z=0
System.out.println(map.sequencedKeySet());  // [z, a, b]

LinkedHashSet<String> set = new LinkedHashSet<>(List.of("x", "y", "z"));
System.out.println(set.getFirst());         // x
System.out.println(set.reversed());         // [z, y, x]
```

### Why It Matters
- Prior to Java 21, reversing a `List` required `Collections.reverse()` (mutating!) or manual iteration; now `reversed()` gives an unmodifiable, **live view** (changes to original reflect in the view) without copying.
- Provides API consistency: same method names (`getFirst`, `addLast`, etc.) work across `List`, `Deque`, `LinkedHashSet`, `LinkedHashMap` — reduces cognitive overhead switching between collection types.
- `reversed()` returns a view, not a copy — O(1), backed by the original collection.

---

## 11. Executor and ExecutorService in Detail

Part of `java.util.concurrent`, introduced in **Java 5**, to decouple **task submission** from **thread management/execution policy**.

### Executor (the root interface)
```java
public interface Executor {
    void execute(Runnable command);
}
```
- The simplest abstraction: "give me a task, I'll run it somehow" (could be same thread, new thread, pooled thread — implementation-defined).
- No lifecycle management, no return values, no way to know when a task completes.

### ExecutorService (extends Executor)
Adds lifecycle management and richer task submission:
```java
public interface ExecutorService extends Executor {
    <T> Future<T> submit(Callable<T> task);
    Future<?> submit(Runnable task);
    <T> Future<T> submit(Runnable task, T result);
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks) throws InterruptedException;
    <T> T invokeAny(Collection<? extends Callable<T>> tasks) throws InterruptedException, ExecutionException;
    void shutdown();
    List<Runnable> shutdownNow();
    boolean isShutdown();
    boolean isTerminated();
    boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException;
}
```

### Common Factory Methods — `Executors` (utility class)

| Factory | Behavior |
|---|---|
| `newFixedThreadPool(n)` | Fixed pool of `n` reusable threads; unbounded queue |
| `newCachedThreadPool()` | Unbounded pool, creates threads as needed, reuses idle ones (60s keep-alive), good for many short-lived tasks |
| `newSingleThreadExecutor()` | One worker thread, tasks run sequentially (FIFO) |
| `newScheduledThreadPool(n)` | Supports delayed/periodic task execution |
| `newWorkStealingPool()` | ForkJoinPool-based, parallel, work-stealing (uses available cores) |
| `newVirtualThreadPerTaskExecutor()` (Java 21+) | Creates a **new virtual thread per task** — see section 12 |

> **Caution:** `Executors` factory methods are now often discouraged in production (see Java's own doc guidance / static analysis warnings) in favor of directly configuring `ThreadPoolExecutor`, because e.g. `newFixedThreadPool`/`newCachedThreadPool` use unbounded queues or unbounded thread creation, which can exhaust memory under load.

### `ThreadPoolExecutor` — full manual control
```java
ExecutorService executor = new ThreadPoolExecutor(
    2,                          // core pool size
    4,                          // max pool size
    60L, TimeUnit.SECONDS,      // keep-alive time for idle threads beyond core size
    new LinkedBlockingQueue<>(100), // work queue
    new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy when queue+pool are full
);
```

### Rejection Policies (`RejectedExecutionHandler`)
- `AbortPolicy` (default) — throws `RejectedExecutionException`.
- `CallerRunsPolicy` — runs the task on the caller's thread (natural backpressure).
- `DiscardPolicy` — silently drops the task.
- `DiscardOldestPolicy` — drops the oldest queued task, then retries.

### Typical Usage Pattern
```java
ExecutorService executor = Executors.newFixedThreadPool(4);
try {
    Future<Integer> future = executor.submit(() -> compute());
    List<Future<String>> results = executor.invokeAll(tasks);
    executor.execute(() -> log("fire and forget"));
} finally {
    executor.shutdown();
    if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
        executor.shutdownNow();
    }
}
```
Since **Java 19**, `ExecutorService` implements `AutoCloseable`, so you can use try-with-resources:
```java
try (ExecutorService executor = Executors.newFixedThreadPool(4)) {
    executor.submit(() -> doWork());
} // automatically calls close() -> shutdown() + awaits termination
```

### shutdown() vs shutdownNow()
| Method | Behavior |
|---|---|
| `shutdown()` | Graceful — stops accepting new tasks, lets already-submitted tasks (including queued ones) finish |
| `shutdownNow()` | Aggressive — attempts to stop all actively executing tasks (via interrupt), halts processing of queued tasks, returns the list of tasks that never started |

### ScheduledExecutorService
```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
scheduler.schedule(() -> task(), 5, TimeUnit.SECONDS);               // one-shot delay
scheduler.scheduleAtFixedRate(() -> task(), 0, 10, TimeUnit.SECONDS); // fixed rate
scheduler.scheduleWithFixedDelay(() -> task(), 0, 10, TimeUnit.SECONDS); // fixed delay between end and next start
```

---

## 12. Virtual Threads and Concurrency in Java 25

Virtual Threads (**JEP 444**) were finalized in **Java 21**, and continue to be the cornerstone of modern Java concurrency in Java 25, alongside **Structured Concurrency** and **Scoped Values** which have matured through preview stages.

### What Are Virtual Threads?
- Lightweight threads implemented **by the JDK** (not the OS), managed by the JVM's scheduler, multiplexed onto a small number of OS ("platform") threads called **carrier threads**.
- Each `Thread` object (platform or virtual) is still `java.lang.Thread` — same API — but virtual threads are cheap to create (millions possible) vs platform threads (limited to thousands due to OS thread stack size ~1MB and OS scheduling overhead).

### Creating Virtual Threads
```java
// Direct creation
Thread vt = Thread.ofVirtual().start(() -> System.out.println("Hi from virtual thread"));

// Named + factory
Thread.Builder builder = Thread.ofVirtual().name("worker-", 0);
Thread t = builder.start(() -> doWork());

// Executor-based (recommended for task-oriented workloads)
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 100_000; i++) {
        executor.submit(() -> handleRequest());
    }
} // waits for all tasks on close()
```

### How They Work Internally
- Virtual threads run user code until they perform a **blocking operation** (I/O, `Thread.sleep`, lock acquisition, etc.).
- When blocked, the virtual thread is **unmounted** from its carrier (platform) thread, freeing the carrier to run another virtual thread. When the blocking operation completes, the virtual thread is **remounted** onto (possibly a different) carrier thread to continue.
- This makes traditional **blocking, synchronous code style scale like async/reactive code** — without callback hell or reactive operators.
- Carrier threads = platform threads from a small `ForkJoinPool` (by default sized to `Runtime.availableProcessors()`).

### Advantages
1. **Massive scalability** — can create millions of virtual threads (vs thousands of platform threads) since each has a small, resizable stack stored on the heap, not a fixed OS-level stack.
2. **Simple programming model** — write plain blocking/sequential code; no need for reactive frameworks (`CompletableFuture` chains, `Mono`/`Flux`) just to get throughput under high concurrency.
3. **Compatibility** — same `Thread` API, works with `ThreadLocal`, existing blocking I/O libraries, JDBC drivers, etc. (as long as they don't pin the carrier thread).
4. **Better resource utilization** — thread-per-request architecture becomes viable again for high-concurrency I/O-bound servers (each HTTP request = one virtual thread, no thread-pool queueing bottleneck).
5. **Cheap context switching** — since virtual threads aren't scheduled by the OS, mount/unmount is much cheaper than an OS context switch.
6. **Structured Concurrency (JEP 480 in Java 25 track)** — treats a group of related tasks running in different threads as a single unit of work, simplifying error handling/cancellation:
```java
try (var scope = StructuredTaskScope.open()) {
    Subtask<String> user  = scope.fork(() -> fetchUser());
    Subtask<String> order = scope.fork(() -> fetchOrder());
    scope.join(); // wait for both, propagate cancellation/errors as a unit
    combine(user.get(), order.get());
}
```

### Limitations / Caveats
1. **Not faster for CPU-bound work** — virtual threads help I/O-bound/blocking concurrency, not raw computation; CPU-bound tasks are still limited by actual CPU cores (use `ForkJoinPool`/parallel streams for those).
2. **Thread pinning** — a virtual thread can get "pinned" to its carrier thread (unable to unmount) in certain cases:
   - Executing inside a `synchronized` block/method that blocks (this has been substantially improved/fixed since JDK 24, but historically was a major caveat — always check current JDK release notes).
   - Native method calls or foreign function calls that block.
   - Pinning during blocking operations can starve the (small) carrier pool if many virtual threads pin simultaneously.
3. **`ThreadLocal` overuse becomes expensive at scale** — with millions of virtual threads, heavy `ThreadLocal` usage (especially large/inheritable ones) leads to significant memory overhead; **`ScopedValue`** (see section 18) was designed as the modern replacement.
4. **Thread-pool-based rate limiting/backpressure logic breaks** — code that assumes a fixed, small thread pool as an implicit concurrency limiter (e.g., "only N DB calls can run at once because there are only N threads") no longer holds; you need explicit `Semaphore`s or connection pool limits instead.
5. **Not a silver bullet for legacy blocking libraries with internal thread-pool bottlenecks** — e.g., some connection pools or drivers still cap effective concurrency internally, negating some virtual-thread scalability gains until updated.
6. **Debugging/observability tooling** — profilers, thread dumps, and monitoring tools needed updates to meaningfully represent millions of virtual threads (improved over JDK 21→25, but still an evolving area).
7. **`Thread.stop()`, thread groups and some legacy APIs** are unsupported or deprecated for virtual threads.

### When to Use What
| Workload | Best fit |
|---|---|
| High-concurrency I/O-bound (web servers, microservice calls, DB queries) | Virtual threads (`newVirtualThreadPerTaskExecutor`) |
| CPU-bound (image processing, number crunching) | Platform threads / `ForkJoinPool` / parallel streams |
| Fixed small number of long-running background workers | Platform threads (fixed thread pool) |

---

## 13. Callable

`java.util.concurrent.Callable<V>` — introduced in Java 5 as an alternative to `Runnable` for tasks that need to **return a value** or **throw checked exceptions**.

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```

### Callable vs Runnable

| Aspect | `Runnable` | `Callable<V>` |
|---|---|---|
| Method | `void run()` | `V call() throws Exception` |
| Return value | None | Yes, generic type `V` |
| Checked exceptions | Cannot throw checked exceptions | Can throw checked exceptions |
| Usable with `Thread` | Yes (`new Thread(runnable)`) | No — not directly; used via `ExecutorService` |
| Usable with `ExecutorService.submit()` | Yes (`Future<?>`) | Yes (`Future<V>`) |

### Example
```java
Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42;
};

ExecutorService executor = Executors.newSingleThreadExecutor();
Future<Integer> future = executor.submit(task);
Integer result = future.get(); // blocks until done, returns 42
executor.shutdown();
```

### invokeAll / invokeAny with Callable
```java
List<Callable<Integer>> tasks = List.of(() -> 1, () -> 2, () -> 3);
List<Future<Integer>> results = executor.invokeAll(tasks);      // run all, wait for all
Integer first = executor.invokeAny(tasks);                       // run all, return first successful
```

---

## 14. Future in Detail

`java.util.concurrent.Future<V>` represents the **result of an asynchronous computation** — a placeholder for a value that may not be available yet.

```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
}
```

### Key Methods
- `get()` — **blocks** the calling thread until the result is available (or throws if the task failed/was cancelled).
- `get(timeout, unit)` — blocks with a timeout, throws `TimeoutException` if it doesn't complete in time.
- `cancel(mayInterruptIfRunning)` — attempts to cancel; if `true`, interrupts the thread running the task if already started.
- `isDone()` — `true` if completed (normally, exceptionally, or via cancellation).
- `isCancelled()` — `true` if cancelled before completion.

### Example
```java
ExecutorService executor = Executors.newFixedThreadPool(2);
Future<Integer> future = executor.submit(() -> {
    Thread.sleep(2000);
    return 10 * 10;
});

if (!future.isDone()) {
    System.out.println("Still computing...");
}
Integer result = future.get(3, TimeUnit.SECONDS); // blocks up to 3s
executor.shutdown();
```

### Limitations of `Future` (motivation for `CompletableFuture`)
1. **No way to manually complete it** from outside the computing thread.
2. **No callback/composition support** — you cannot chain "when this completes, do X" without blocking via `get()`.
3. **No combining multiple futures** (e.g., "wait for both A and B, then combine results") without manual blocking coordination.
4. **No exception handling API** — exceptions are only visible when you call `get()` (wrapped in `ExecutionException`); no functional-style `.exceptionally()`/`.handle()`.
5. **Blocking-only result retrieval** — the only way to consume the result is to block a thread with `get()`.

These gaps led to `CompletableFuture` (Java 8).

---

## 15. CompletableFuture in Detail

`java.util.concurrent.CompletableFuture<T>` (Java 8) implements both `Future<T>` and `CompletionStage<T>` — provides a **rich, functional, non-blocking API** for asynchronous programming with composition, chaining, combining, and exception handling.

### Creating a CompletableFuture
```java
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> fetchData()); // async, returns value
CompletableFuture<Void> cf2 = CompletableFuture.runAsync(() -> doSomething());     // async, no return value
CompletableFuture<String> cf3 = new CompletableFuture<>();                          // manually completed later
cf3.complete("done");   // externally sets the result
cf3.completeExceptionally(new RuntimeException("failed"));
```
By default `supplyAsync`/`runAsync` use `ForkJoinPool.commonPool()`; you can supply a custom `Executor` as a second argument (recommended in production to avoid starving the common pool).

### Chaining / Transformation
```java
CompletableFuture<Integer> result = CompletableFuture
    .supplyAsync(() -> 10)
    .thenApply(x -> x * 2)        // transform result: sync, on same thread that completed the future
    .thenApplyAsync(x -> x + 1);  // transform result: async, on ForkJoinPool (or custom executor)
```

### Consuming without transforming
```java
future.thenAccept(value -> System.out.println(value)); // consume value, no return
future.thenRun(() -> System.out.println("done"));       // ignore value entirely
```

### Composing dependent async operations
```java
CompletableFuture<String> combined = CompletableFuture
    .supplyAsync(() -> fetchUserId())
    .thenCompose(userId -> fetchUserDetailsAsync(userId)); // flatMap-like: chains two async stages
```
`thenApply` (map) vs `thenCompose` (flatMap): use `thenCompose` when the next step *itself* returns a `CompletableFuture`, to avoid nested `CompletableFuture<CompletableFuture<T>>`.

### Combining Independent Futures
```java
CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> 10);
CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> 20);

CompletableFuture<Integer> combined = f1.thenCombine(f2, (a, b) -> a + b); // 30

CompletableFuture<Void> all = CompletableFuture.allOf(f1, f2, combined);   // wait for all
CompletableFuture<Object> any = CompletableFuture.anyOf(f1, f2);           // completes when first completes
```

### Exception Handling
```java
CompletableFuture<Integer> cf = CompletableFuture.supplyAsync(() -> {
    if (true) throw new RuntimeException("boom");
    return 1;
});

cf.exceptionally(ex -> {                 // recover from exception, provide fallback value
    System.out.println("Error: " + ex.getMessage());
    return -1;
});

cf.handle((result, ex) -> {              // runs regardless of success/failure
    if (ex != null) return -1;
    return result;
});

cf.whenComplete((result, ex) -> {        // side effect, does NOT change the result/exception
    if (ex != null) log(ex);
});
```

### Async Variants (`...Async` suffix)
Every composing method (`thenApply`, `thenAccept`, `thenCompose`, `thenCombine`, etc.) has an `...Async` overload:
- Without `Async`: continuation runs on whichever thread completed the previous stage (could be the calling thread if already complete, or the worker thread).
- With `Async` (no executor arg): runs on `ForkJoinPool.commonPool()`.
- With `Async` + explicit `Executor` arg: runs on the given executor — best practice for controlling thread pool usage.

### Timeouts (Java 9+)
```java
cf.orTimeout(5, TimeUnit.SECONDS);                          // completes exceptionally with TimeoutException
cf.completeOnTimeout(defaultValue, 5, TimeUnit.SECONDS);     // completes with a fallback value instead
```

### Summary Table

| Method | Purpose |
|---|---|
| `supplyAsync` / `runAsync` | Start an async computation |
| `thenApply` / `thenApplyAsync` | Transform result (map) |
| `thenCompose` / `thenComposeAsync` | Chain dependent async stage (flatMap) |
| `thenCombine` | Combine two independent futures |
| `thenAccept` / `thenRun` | Consume result / run side effect |
| `allOf` / `anyOf` | Wait for all / any of multiple futures |
| `exceptionally` | Recover from exception |
| `handle` | Handle both success and failure |
| `whenComplete` | Side effect on completion (doesn't alter outcome) |
| `orTimeout` / `completeOnTimeout` | Timeout handling |

---

## 16. CompletionStage

`java.util.concurrent.CompletionStage<T>` is the **interface** that defines the composable, functional contract that `CompletableFuture` implements. It represents **one stage** of a possibly multi-stage asynchronous computation.

```java
public interface CompletionStage<T> {
    <U> CompletionStage<U> thenApply(Function<? super T,? extends U> fn);
    <U> CompletionStage<U> thenApplyAsync(Function<? super T,? extends U> fn);
    CompletionStage<Void> thenAccept(Consumer<? super T> action);
    <U> CompletionStage<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn);
    <U,V> CompletionStage<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T,? super U,? extends V> fn);
    CompletionStage<T> exceptionally(Function<Throwable, ? extends T> fn);
    // ... and many more
    CompletableFuture<T> toCompletableFuture();
}
```

### Relationship to CompletableFuture

| Aspect | `CompletionStage<T>` | `CompletableFuture<T>` |
|---|---|---|
| Type | Interface — defines the composition contract | Concrete class implementing both `Future<T>` and `CompletionStage<T>` |
| Purpose | Abstracts "a stage in an async pipeline," allows library authors to depend on the contract without depending on `CompletableFuture`'s concrete API (e.g., blocking `get()`) | The (only, standard) implementation shipped with the JDK |
| Blocking methods | None — purely reactive/composition-based, no `get()` | Has both — inherits blocking (`Future.get()`) AND non-blocking composition (`CompletionStage` methods) |
| Typical usage | As a return type for APIs that want to expose only the composition/reactive contract, not allow callers to block | Used directly in application code |

### Why the split exists
- `CompletionStage` was designed so that **library/API authors** could expose async pipelines without exposing blocking (`Future.get()`), encouraging fully non-blocking, callback/composition-based usage.
- `CompletableFuture` bundles both: it's the pragmatic, "do everything" class most developers use directly, while `CompletionStage` is the pure functional-composition abstraction underneath.

---

## 17. ThreadLocal

`java.lang.ThreadLocal<T>` provides **thread-confined variables** — each thread accessing a `ThreadLocal` gets its own, independently initialized copy.

### Basic Usage
```java
public class Context {
    private static final ThreadLocal<String> currentUser = new ThreadLocal<>();

    public static void set(String user) { currentUser.set(user); }
    public static String get() { return currentUser.get(); }
    public static void clear() { currentUser.remove(); } // IMPORTANT to avoid leaks
}
```

### With Initial Value
```java
ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
// SimpleDateFormat is not thread-safe; ThreadLocal gives each thread its own instance
```

### How It Works Internally
- Each `Thread` object has a private field `threadLocals` (a `ThreadLocalMap`).
- `ThreadLocal.set(value)` stores the value keyed by the `ThreadLocal` instance itself (using weak references to the `ThreadLocal` key) in the **current thread's** map.
- `ThreadLocal.get()` reads from the current thread's map.
- Because storage is per-thread, no synchronization is needed to access it.

### Common Use Cases
- Storing per-request context (user session, transaction ID, locale) in web servers (thread-per-request model).
- Non-thread-safe objects like `SimpleDateFormat`, `Random` — give each thread its own instance to avoid contention/synchronization.
- Logging context (e.g., MDC in SLF4J/Logback uses `ThreadLocal` internally).

### InheritableThreadLocal
A variant that **propagates** the value from parent thread to any child thread it spawns at creation time:
```java
InheritableThreadLocal<String> ctx = new InheritableThreadLocal<>();
ctx.set("parent-value");
new Thread(() -> System.out.println(ctx.get())).start(); // prints "parent-value"
```

### Pitfalls
1. **Memory leaks** — in thread-pool environments (threads are reused, not destroyed), forgetting to call `remove()` after use leaves stale data referenced by the (long-lived) pooled thread, causing memory leaks and potential data leakage between unrelated tasks/requests.
2. **Not automatically propagated** across `ExecutorService`-submitted tasks (a task on a pooled thread does NOT see the submitter's `ThreadLocal` values, unless manually copied).
3. **Costly at scale with virtual threads** — with potentially millions of virtual threads, each with their own `ThreadLocalMap`, especially with `InheritableThreadLocal` (which copies values down for every virtual thread creation), memory and CPU overhead becomes significant. This directly motivated `ScopedValue`.

---

## 18. ScopedValue

`ScopedValue<T>` (finalized as of recent JDK releases in the 21→25 timeframe, evolved through several preview JEPs — JEP 429 → JEP 446 → JEP 481/JEP for Java 25) is designed as a **modern, safer, and more efficient alternative to `ThreadLocal`**, especially in a world of millions of virtual threads.

### Core Idea
- A `ScopedValue` is **immutable** for the duration of a well-defined **dynamic scope** — bound at the start of a block of code and automatically un-bound when that block exits.
- No `set()`/`remove()` lifecycle to manage manually — eliminates the memory-leak risk inherent to `ThreadLocal`.

### Basic Usage
```java
public class Context {
    static final ScopedValue<String> CURRENT_USER = ScopedValue.newInstance();

    void handleRequest() {
        ScopedValue.where(CURRENT_USER, "alice")
                   .run(() -> processRequest()); // CURRENT_USER bound only within this call tree
    }

    void processRequest() {
        System.out.println(CURRENT_USER.get()); // "alice" - visible anywhere in the call stack
    }
    // Outside of .run(), CURRENT_USER.get() would throw NoSuchElementException (unbound)
}
```

### Key Characteristics
- **Immutable within scope** — once bound with `where(...).run(...)`, the value cannot be changed (no `set()` mid-scope) — safer for reasoning about concurrent code.
- **Automatically cleaned up** — when `run()` (or `call()`) returns, the binding is automatically removed; no `remove()` needed, no leak risk.
- **Cheap propagation to child threads/tasks** — especially with `StructuredTaskScope`, scoped values propagate to forked subtasks efficiently, without deep-copying like `InheritableThreadLocal`.
- **Rebinding** — nested `where()` calls can shadow an outer binding for the duration of the inner scope, restoring the outer value after.

```java
ScopedValue.where(CURRENT_USER, "bob").run(() -> {
    System.out.println(CURRENT_USER.get()); // "bob"
    ScopedValue.where(CURRENT_USER, "carol").run(() -> {
        System.out.println(CURRENT_USER.get()); // "carol"
    });
    System.out.println(CURRENT_USER.get()); // back to "bob"
});
```

### With Structured Concurrency
```java
ScopedValue.where(REQUEST_ID, "req-123").run(() -> {
    try (var scope = StructuredTaskScope.open()) {
        scope.fork(() -> fetchUser());   // REQUEST_ID is visible here too
        scope.fork(() -> fetchOrders()); // and here
        scope.join();
    }
});
```

---

## 19. Difference between ThreadLocal and ScopedValue

| Aspect | `ThreadLocal<T>` | `ScopedValue<T>` |
|---|---|---|
| Mutability | Mutable — `set()` any time, any number of times | Immutable within a bound scope — set once via `where().run()`, cannot be changed mid-scope |
| Lifecycle | Manual — must call `remove()` or risk memory leaks | Automatic — bound value is scoped to a block and cleaned up when the block exits |
| Scope | Unbounded — lives as long as the thread (or until explicitly removed); persists across unrelated code in the same thread | Well-defined, bounded — only visible within the dynamic extent of the `run()`/`call()` block and its callees |
| Propagation to child threads | `InheritableThreadLocal` copies values (deep, can be expensive) | Cheap, efficient propagation to forked subtasks, especially via `StructuredTaskScope` |
| Memory/performance with Virtual Threads | Expensive at scale — every virtual thread carries its own `ThreadLocalMap` | Designed specifically to be cheap and safe at millions-of-virtual-threads scale |
| Safety | Risk of stale data/leaks in pooled threads; can be read/written from anywhere, harder to reason about | Immutability + automatic cleanup makes reasoning about correctness easier; no leak risk |
| Reassignment mid-scope | Yes, freely | No — must create a new nested scope via `where()` to "change" the value for a sub-block |
| Introduced | Java 1.2 (as `ThreadLocal`) | Finalized around JDK 21-25 timeframe (through several preview JEPs) |
| Best for | Legacy code, simple thread-confined mutable caches | Structured, request-scoped/contextual data in modern concurrent (especially virtual-thread-heavy) applications |

**Rule of thumb:** For **new code**, especially anything involving virtual threads or structured concurrency, prefer `ScopedValue` for propagating request-scoped immutable context (user ID, trace ID, transaction context). Reach for `ThreadLocal` only when you genuinely need **mutable**, per-thread state that changes over the thread's lifetime (e.g., a reusable, non-thread-safe object like a formatter).

---

## 20. Spring / Project Reactor

("Spring CoreReactor" — treated here as **Project Reactor**, the reactive library that underpins **Spring WebFlux** / the reactive stack in the Spring ecosystem.)

### What is Project Reactor?
- A fully non-blocking **reactive streams** library for the JVM, implementing the [Reactive Streams](https://www.reactive-streams.org/) specification (`Publisher`, `Subscriber`, `Subscription`, `Processor`).
- Developed by Pivotal/VMware, foundational to **Spring WebFlux**, `spring-webflux`, `R2DBC` (reactive DB access), and reactive Spring Cloud Gateway.
- Provides two core reactive types:

| Type | Represents |
|---|---|
| `Mono<T>` | A stream of **0 or 1** element (async equivalent of `Optional<T>` / a single-value `CompletableFuture`) |
| `Flux<T>` | A stream of **0 to N** elements (async equivalent of `Stream<T>`, potentially infinite) |

### Basic Examples
```java
Mono<String> mono = Mono.just("hello");
mono.subscribe(System.out::println);

Flux<Integer> flux = Flux.range(1, 5)
    .map(i -> i * 2)
    .filter(i -> i > 4);
flux.subscribe(System.out::println); // prints 6, 8, 10
```

### Key Operators
```java
Flux.just(1, 2, 3)
    .map(i -> i * 2)                 // transform each element
    .filter(i -> i > 2)              // keep matching elements
    .flatMap(i -> Flux.just(i, i+1)) // async 1-to-many mapping, results interleaved
    .concatMap(i -> asyncCall(i))    // like flatMap but preserves order
    .doOnNext(System.out::println)   // side effect per element
    .onErrorResume(e -> Flux.empty())// error recovery
    .subscribe();
```

### Backpressure
- A core Reactive Streams concept: **the subscriber controls how much data the publisher sends**, preventing a fast producer from overwhelming a slow consumer.
- Reactor operators like `onBackpressureBuffer()`, `onBackpressureDrop()`, `limitRate()` manage this explicitly.

### Reactor + Spring WebFlux
```java
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userRepository.findById(id); // non-blocking, backed by R2DBC
    }

    @GetMapping("/users")
    public Flux<User> getAllUsers() {
        return userRepository.findAll(); // streams results as they arrive
    }
}
```
- Spring WebFlux runs on a small, fixed number of event-loop threads (Netty by default), achieving high concurrency for I/O-bound workloads **without** blocking threads — conceptually similar to what virtual threads achieve for imperative code, but via the reactive/callback (non-blocking) model instead of thread-per-task blocking.

### Reactor vs Virtual Threads / CompletableFuture (context)

| Aspect | `CompletableFuture` | Project Reactor (`Mono`/`Flux`) | Virtual Threads (blocking style) |
|---|---|---|---|
| Programming model | Callback/functional chains, single value | Callback/functional chains, 0..N values, backpressure-aware | Plain sequential/blocking code |
| Backpressure | No | Yes, built-in | N/A (not stream-based) |
| Learning curve | Moderate | Steep (operators, schedulers, backpressure) | Low — looks like ordinary code |
| Best for | Simple async composition of a few tasks | Streaming/reactive pipelines, high-throughput non-blocking I/O | High-concurrency I/O-bound apps wanting simple code |
| Debugging | Easier (mostly) | Harder (stack traces less intuitive, though `Hooks.onOperatorDebug()` helps) | Easy — normal stack traces |

Reactor remains dominant for **stream-processing style** workloads (event streams, reactive DB access, gateway/proxy layers) where the composability of operators (`map`, `flatMap`, `zip`, `merge`, `window`, etc.) and built-in backpressure are valuable, whereas virtual threads are increasingly preferred for simpler request/response-style services that don't need reactive operators.

---

## 21. Predicate, Runnable, Function, Consumer, Supplier

All from `java.util.function` (except `Runnable`, which is `java.lang`), all annotated `@FunctionalInterface` — each has exactly one abstract method (SAM), enabling lambda/method-reference usage.

### Signatures

| Interface | Abstract method | Input | Output | Package |
|---|---|---|---|---|
| `Runnable` | `void run()` | none | none (void) | `java.lang` |
| `Supplier<T>` | `T get()` | none | `T` | `java.util.function` |
| `Consumer<T>` | `void accept(T t)` | `T` | none (void) | `java.util.function` |
| `Function<T,R>` | `R apply(T t)` | `T` | `R` | `java.util.function` |
| `Predicate<T>` | `boolean test(T t)` | `T` | `boolean` | `java.util.function` |

### Examples
```java
Runnable r = () -> System.out.println("Running");
r.run();

Supplier<String> s = () -> "generated value";
System.out.println(s.get());

Consumer<String> c = str -> System.out.println("Consumed: " + str);
c.accept("hello");

Function<Integer, String> f = i -> "Number: " + i;
System.out.println(f.apply(5));

Predicate<Integer> p = i -> i % 2 == 0;
System.out.println(p.test(4)); // true
```

### Similarities
- All are **functional interfaces** — usable as lambda expression targets or method references.
- All are **stateless by contract convention** — designed for pure, side-effect-free usage (though `Consumer`/`Runnable` are inherently about side effects).
- All support **composition** via default methods:

| Interface | Composition methods |
|---|---|
| `Function<T,R>` | `andThen(after)`, `compose(before)` |
| `Predicate<T>` | `and(other)`, `or(other)`, `negate()` |
| `Consumer<T>` | `andThen(after)` |
| `Supplier<T>` | none (no natural composition point — it takes no input) |
| `Runnable` | none |

```java
Function<Integer, Integer> times2 = x -> x * 2;
Function<Integer, Integer> plus3  = x -> x + 3;
Function<Integer, Integer> combo  = times2.andThen(plus3); // (x*2)+3
System.out.println(combo.apply(5)); // 13

Predicate<Integer> isEven = x -> x % 2 == 0;
Predicate<Integer> isPositive = x -> x > 0;
Predicate<Integer> both = isEven.and(isPositive);
```

### Differences (Purpose)

| Interface | Purpose (mnemonic) | Typical use |
|---|---|---|
| `Runnable` | "Do something" — no input, no output | `Thread`, `Executor.execute()` |
| `Supplier<T>` | "Give me something" — no input, produces output | Lazy value generation, factory methods, `Optional.orElseGet()` |
| `Consumer<T>` | "Do something WITH something" — input, no output | `forEach()`, callbacks, logging |
| `Function<T,R>` | "Transform something into something else" — input → output | `map()` in streams, transformations |
| `Predicate<T>` | "Test something" — input → boolean | `filter()` in streams, validation |

### Bonus Variants
- `BiFunction<T,U,R>`, `BiConsumer<T,U>`, `BiPredicate<T,U>` — two-argument versions.
- `UnaryOperator<T>` extends `Function<T,T>` (same input/output type).
- `BinaryOperator<T>` extends `BiFunction<T,T,T>` — used in `Stream.reduce()`.
- Primitive specializations to avoid boxing: `IntPredicate`, `IntFunction<R>`, `ToIntFunction<T>`, `IntSupplier`, `IntConsumer`, and `Long`/`Double` equivalents.

### In Streams (where these shine together)
```java
List<String> names = List.of("Alice", "Bob", "Charlie", "Dave");
names.stream()
     .filter(n -> n.length() > 3)   // Predicate<String>
     .map(String::toUpperCase)      // Function<String,String>
     .forEach(System.out::println); // Consumer<String>
```

---

## 22. Threads in Java — Full Overview, Limitations, and Why ExecutorService & Virtual Threads Were Introduced

### 22.1 What is a Thread?
A thread is the smallest unit of CPU scheduling/execution within a process. Java threads (`java.lang.Thread`) map, by default, 1:1 to **OS/platform threads**, managed by the OS scheduler.

### 22.2 Creating Threads (Traditional Ways)

**1. Extending `Thread`**
```java
class MyThread extends Thread {
    @Override
    public void run() { System.out.println("Running"); }
}
new MyThread().start(); // start(), never call run() directly
```

**2. Implementing `Runnable`** (preferred — allows extending another class, favors composition over inheritance)
```java
Runnable task = () -> System.out.println("Running");
new Thread(task).start();
```

**3. Implementing `Callable`** (via `ExecutorService`, returns a value — see section 13)

### 22.3 Thread Lifecycle (States)
```
NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED
```
| State | Meaning |
|---|---|
| `NEW` | Created, `start()` not yet called |
| `RUNNABLE` | Executing or eligible to be scheduled by the OS |
| `BLOCKED` | Waiting to acquire a monitor lock (`synchronized`) |
| `WAITING` | Waiting indefinitely (`Object.wait()`, `Thread.join()` with no timeout) |
| `TIMED_WAITING` | Waiting with a timeout (`Thread.sleep()`, `wait(timeout)`) |
| `TERMINATED` | `run()` has completed |

### 22.4 Core Synchronization Primitives
- `synchronized` (methods/blocks) — intrinsic monitor lock, mutual exclusion.
- `wait()` / `notify()` / `notifyAll()` — low-level inter-thread coordination (must hold the monitor).
- `volatile` — ensures visibility of changes across threads (not atomicity).
- `java.util.concurrent.locks` — `ReentrantLock`, `ReadWriteLock` — more flexible locking (tryLock, timed lock, fairness policies).
- `java.util.concurrent.atomic` — `AtomicInteger`, `AtomicLong`, `AtomicReference` — lock-free, CAS-based atomic operations.

### 22.5 Limitations of Raw/Platform Threads
1. **Expensive to create** — each platform `Thread` maps to an OS thread, consuming a fixed-size stack (often ~512KB–1MB by default) and requiring OS-level context-switch overhead.
2. **Limited scalability** — practically, a JVM can only sustain a few thousand platform threads before running out of memory or suffering severe context-switch overhead; this directly caps "thread-per-request" server designs under high concurrency (C10K problem).
3. **No built-in lifecycle/result management** — raw `Thread` gives you `start()`, `join()`, `interrupt()` — no return values, no exception propagation back to caller, no easy cancellation semantics, no queuing/backpressure.
4. **No reuse** — a `Thread` object is one-shot; once `run()` finishes, that thread object is dead — creating a new thread per task is wasteful.
5. **Manual, error-prone resource management** — you have to manually track and `join()` every thread, or handle uncaught exceptions via `setUncaughtExceptionHandler`, all manually.
6. **No task queuing** — if you spawn a new `Thread` per task with no limit, sudden bursts of load can spawn unbounded threads, exhausting system resources ("thread explosion").

### 22.6 Why ExecutorService Was Introduced (Java 5)
`ExecutorService` (see section 11) solved the above by:
- **Decoupling task submission from execution mechanics** — you submit `Runnable`/`Callable`, the framework decides how/when/on which thread to run it.
- **Thread pooling / reuse** — avoids the cost of creating a new OS thread per task; a bounded pool of reusable worker threads processes a queue of tasks.
- **Backpressure & bounded resource usage** — via bounded queues + rejection policies, prevents unbounded thread/resource growth.
- **Result & exception handling** — via `Future`/`Callable`, results and exceptions propagate cleanly back to the submitter.
- **Lifecycle management** — `shutdown()`/`shutdownNow()`/`awaitTermination()` give controlled, graceful shutdown.
- **Scheduling support** — `ScheduledExecutorService` for delayed/periodic tasks, replacing the more error-prone/legacy `Timer`/`TimerTask`.

However, `ExecutorService` **still fundamentally uses platform threads** underneath (a "pool," but each pooled thread is still a full OS thread) — so the *ceiling* on concurrency (thousands, not millions) remained, and thread-pool sizing became a delicate, error-prone tuning exercise (too few → underutilized CPU during I/O waits; too many → context-switch thrashing and memory pressure).

### 22.7 Why Virtual Threads Were Introduced (Java 21, JEP 444)
Even with `ExecutorService`, developers faced a hard tradeoff for I/O-bound workloads:
- **Thread-per-request with platform threads** → simple code, but doesn't scale past a few thousand concurrent requests.
- **Reactive/async style (`CompletableFuture` chains, Reactor `Mono`/`Flux`, callback-based NIO)** → scales to hundreds of thousands of concurrent operations using a small fixed pool of threads, but at the cost of **much higher code complexity** ("callback hell," fragmented stack traces, steep learning curve, harder debugging).

**Virtual threads (Project Loom)** resolve this tradeoff by decoupling the *unit of concurrency* (a virtual thread — cheap, JVM-managed) from the *unit of OS scheduling* (a small, fixed set of carrier/platform threads). This lets developers:
- Write **simple, sequential, blocking-style code** (easy to read, debug, and reason about — normal stack traces, normal try/catch, normal loops).
- Get the **scalability of the reactive/async model** (blocked virtual threads don't tie up an OS thread — they're unmounted while waiting, letting the small carrier pool serve other virtual threads).
- Reuse **existing blocking APIs and libraries** (JDBC, blocking I/O, `synchronized`) largely unchanged, unlike reactive programming which typically requires an entirely non-blocking-compatible library ecosystem (R2DBC instead of JDBC, etc.).

### 22.8 Complete Comparison Table

| Approach | Concurrency ceiling | Code complexity | Memory per unit | Best for |
|---|---|---|---|---|
| Raw `Thread` per task | ~thousands | Low, but unmanaged/manual lifecycle | ~0.5-1MB (OS stack) | Learning, tiny scripts, not production servers |
| `ExecutorService` (platform thread pool) | ~thousands (pool-bounded) | Low-medium | ~0.5-1MB per pooled thread | CPU-bound work, moderate-concurrency I/O-bound work |
| Reactive (Reactor, `CompletableFuture` chains) | Hundreds of thousands+ | High (operators, backpressure, debugging) | Very low (event-loop based, few OS threads) | High-throughput streaming/non-blocking I/O pipelines |
| Virtual Threads (`newVirtualThreadPerTaskExecutor`) | Millions | Low (looks like sequential blocking code) | Very low (small, resizable heap-allocated stack) | High-concurrency I/O-bound services, simple thread-per-request designs at scale |

### 22.9 Summary — The Evolution
```text
Raw Thread (Java 1.0)
   -> error-prone, unscalable, no lifecycle mgmt

Executor / ExecutorService (Java 5)
   -> thread pooling, task abstraction, lifecycle mgmt, Future for results
   -> still bound by OS thread limits

Future limitations, so: CompletableFuture (Java 8)
   -> composable, non-blocking result handling, functional chaining

Reactive Streams / Project Reactor (Spring ecosystem)
   -> true non-blocking I/O at scale, but steep complexity cost

Virtual Threads + Structured Concurrency + Scoped Values (Java 21 -> 25, Project Loom)
   -> scalability of reactive/async, simplicity of synchronous blocking code
   -> ScopedValue replaces ThreadLocal as the scalable context-propagation mechanism
```

---

*End of notes.*
