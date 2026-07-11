# 00-Java-Basics.md

# Java Basics

> A quick revision guide covering the core Java concepts required for backend development and technical interviews.

---

# Table of Contents

1. What is Java?
2. Features of Java
3. Java Editions
4. Java Architecture
5. JVM, JRE & JDK
6. Java Compilation Process
7. Platform Independence
8. Java Program Structure
9. Variables
10. Data Types
11. Type Conversion
12. Operators
13. Control Statements
14. Methods
15. Memory Management
16. Access Modifiers
17. Packages
18. Object-Oriented Programming
19. Wrapper Classes
20. String vs StringBuilder vs StringBuffer
21. Arrays
22. Command Line Arguments
23. Important Interview Questions
24. Quick Revision

---

# 1. What is Java?

Java is a **high-level, object-oriented, class-based programming language** developed by Sun Microsystems (now Oracle).

### Goals

* Write Once, Run Anywhere (WORA)
* Platform Independent
* Secure
* Robust
* Multithreaded
* High Performance using JIT

---

# 2. Features of Java

| Feature              | Description                             |
| -------------------- | --------------------------------------- |
| Simple               | Easy syntax similar to C/C++            |
| Object-Oriented      | Everything revolves around objects      |
| Platform Independent | Bytecode runs on any JVM                |
| Secure               | No pointer manipulation                 |
| Robust               | Exception handling & Garbage Collection |
| Multithreaded        | Built-in thread support                 |
| Portable             | Same bytecode everywhere                |
| Architecture Neutral | CPU independent                         |
| Distributed          | Supports networking APIs                |
| Dynamic              | Classes loaded during runtime           |

---

# 3. Java Editions

| Edition              | Purpose                 |
| -------------------- | ----------------------- |
| Java SE              | Desktop, Backend        |
| Java EE (Jakarta EE) | Enterprise Applications |
| Java ME              | Embedded Devices        |

---

# 4. Java Architecture

```
Java Source (.java)
        │
        ▼
Java Compiler (javac)
        │
        ▼
Bytecode (.class)
        │
        ▼
JVM
        │
        ▼
Machine Code
```

---

# 5. JVM vs JRE vs JDK

| Component | Contains               | Purpose               |
| --------- | ---------------------- | --------------------- |
| JVM       | Runtime Engine         | Executes Bytecode     |
| JRE       | JVM + Libraries        | Runs Java Programs    |
| JDK       | JRE + Compiler + Tools | Develop Java Programs |

### JDK

Includes

* javac
* java
* javadoc
* jdb
* jar
* jshell

---

# 6. Compilation Process

```
Hello.java
      │
      ▼
javac Hello.java
      │
      ▼
Hello.class
      │
      ▼
java Hello
      │
      ▼
JVM
      │
      ▼
Machine Code
```

---

# 7. Platform Independence

Java code is compiled into **Bytecode**.

Bytecode runs on any operating system having a compatible JVM.

```
Windows JVM
Linux JVM
Mac JVM

↓

Same Bytecode
```

---

# 8. Basic Java Program

```java
public class Hello {

    public static void main(String[] args) {

        System.out.println("Hello Java");

    }

}
```

### Execution starts from

```
main()
```

---

# 9. Variables

Variables store data.

## Types

### Local Variable

Inside method

### Instance Variable

Belongs to object

### Static Variable

Belongs to class

Example

```java
class Employee{

    static String company;

    String name;

}
```

---

# 10. Data Types

## Primitive

| Type    | Size          |
| ------- | ------------- |
| byte    | 1 byte        |
| short   | 2 bytes       |
| int     | 4 bytes       |
| long    | 8 bytes       |
| float   | 4 bytes       |
| double  | 8 bytes       |
| char    | 2 bytes       |
| boolean | JVM dependent |

---

## Non Primitive

* String
* Array
* Class
* Interface
* Enum
* Record
* Collection

---

# 11. Type Conversion

## Widening (Implicit)

```
byte

↓

short

↓

int

↓

long

↓

float

↓

double
```

Example

```java
int a=10;

double d=a;
```

---

## Narrowing

```java
double d=15.5;

int a=(int)d;
```

Needs explicit casting.

---

# 12. Operators

## Arithmetic

```
+
-
*
/
%
```

## Relational

```
>
<
>=
<=
==
!=
```

## Logical

```
&&

||

!
```

## Assignment

```
=

+=

-=

*=

/=
```

## Bitwise

```
&

|

^

~

<<

>>

>>>
```

## Ternary

```java
condition ? value1 : value2
```

---

# 13. Control Statements

## Decision

* if
* else
* switch

## Loop

* for
* while
* do while
* enhanced for

## Jump

* break
* continue
* return

---

# 14. Methods

Syntax

```java
returnType methodName(parameters){

}
```

Example

```java
public int add(int a,int b){

    return a+b;

}
```

---

## Method Overloading

Same method

Different parameters

Compile Time Polymorphism

---

## Method Overriding

Same method

Different implementation

Runtime Polymorphism

---

# 15. Memory Management

```
JVM Memory

Heap
│
├── Objects
├── Arrays

Stack
│
├── Method Calls
├── Local Variables

Method Area
│
├── Class Metadata
├── Static Variables

PC Register

Native Method Stack
```

---

## Garbage Collection

Automatically removes unreachable objects.

Popular collectors

* G1
* ZGC
* Shenandoah
* Serial GC
* Parallel GC

---

# 16. Access Modifiers

| Modifier  | Same Class | Package | Subclass | World |
| --------- | ---------- | ------- | -------- | ----- |
| public    | ✔          | ✔       | ✔        | ✔     |
| protected | ✔          | ✔       | ✔        | ✘     |
| default   | ✔          | ✔       | ✘        | ✘     |
| private   | ✔          | ✘       | ✘        | ✘     |

---

# 17. Packages

Purpose

* Organize classes
* Prevent naming conflicts
* Access control

Example

```java
package com.company.project;
```

Import

```java
import java.util.List;
```

---

# 18. OOP Concepts

## Encapsulation

Binding data + methods together.

---

## Inheritance

Acquire parent properties.

Keyword

```
extends
```

---

## Polymorphism

One interface

Many implementations.

Compile Time

Runtime

---

## Abstraction

Hide implementation.

Implemented using

* Interface
* Abstract Class

---

# 19. Wrapper Classes

| Primitive | Wrapper   |
| --------- | --------- |
| byte      | Byte      |
| short     | Short     |
| int       | Integer   |
| long      | Long      |
| float     | Float     |
| double    | Double    |
| char      | Character |
| boolean   | Boolean   |

Useful because Collections store objects, not primitives.

---

# 20. String vs StringBuilder vs StringBuffer

| Feature     | String | StringBuilder | StringBuffer |
| ----------- | ------ | ------------- | ------------ |
| Mutable     | ❌      | ✔             | ✔            |
| Thread Safe | ✔      | ❌             | ✔            |
| Performance | Slow   | Fast          | Medium       |

Use

* String → Constant values
* StringBuilder → Single Thread
* StringBuffer → Multi Thread

---

# 21. Arrays

Example

```java
int[] numbers={1,2,3,4};
```

Characteristics

* Fixed Size
* Same Data Type
* Indexed
* Contiguous Memory (logical abstraction)

---

# 22. Command Line Arguments

```java
public static void main(String[] args){

}
```

Example

```
java Hello John
```

```
args[0] = John
```

---

# 23. Important Interview Questions

### What is Java?

High-level, object-oriented, platform-independent language.

---

### Why is Java Platform Independent?

Because it runs Bytecode on JVM.

---

### Difference between JDK JRE JVM?

* JDK → Development
* JRE → Execution Environment
* JVM → Executes Bytecode

---

### Why String is Immutable?

* Security
* Thread Safety
* Hashing
* String Pool

---

### Stack vs Heap?

Stack

* Local Variables
* Method Calls

Heap

* Objects
* Arrays

---

### Why main() is static?

So JVM can invoke it without creating an object.

---

### Why Java has no pointers?

For security and simplicity.

---

### Why multiple inheritance isn't supported for classes?

To avoid the Diamond Problem.

---

# 24. Quick Revision

## Remember

* Java = Object-Oriented + Platform Independent
* Bytecode runs on JVM
* JDK > JRE > JVM
* Compilation: `.java` → `.class`
* JVM Memory = Heap + Stack + Method Area
* 8 Primitive Data Types
* 4 OOP Pillars
* String is Immutable
* Wrapper Classes convert primitives to objects
* Arrays are fixed size
* Access Modifiers control visibility
* Packages organize code
* Garbage Collector manages memory
* Method Overloading = Compile Time
* Method Overriding = Runtime
* Java uses pass-by-value
* Everything except primitives is referenced by object references

---

# Cheat Sheet

```
Java File
   ↓
javac
   ↓
Bytecode
   ↓
JVM
   ↓
Machine Code

JDK
 ├── JRE
 │    └── JVM

Memory

Heap → Objects
Stack → Local Variables
Method Area → Class Metadata

OOP

Encapsulation
Inheritance
Polymorphism
Abstraction

Compile Time
Overloading

Runtime
Overriding
```
